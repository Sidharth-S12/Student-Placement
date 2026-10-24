/**
 * End-to-End Test: Placement Genie Company Registration and Admin Approval Workflow
 *
 * Validates:
 * 1. Company registration creates company document with consistent 'pending' approvalStatus.
 * 2. Admin portal fetches registered companies, accurately returns pending counts and status filters.
 * 3. Pending recruiters can access profile but are restricted from publishing drives.
 * 4. Recruiter self-approval is strictly prevented (both via review endpoint and profile update).
 * 5. Admin rejection requires a rejection reason and records reviewer metadata + timestamp.
 * 6. Rejected recruiters are restricted on backend and see the rejection reason.
 * 7. Admin approval activates the company, clears rejection reason, and allows full portal access.
 * 8. Approved recruiters can successfully publish campus recruitment drives.
 */

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('================================================================');
  console.log('🧪 Starting Placement Genie Company Registration & Approval Tests');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  const timestamp = Date.now();
  const testCompanyUid = `company_test_${timestamp}`;
  const testCompanyEmail = `recruiter_${timestamp}@innovatetech.com`;
  const testCompanyName = `InnovateTech Solutions ${timestamp}`;

  const adminHeaders = {
    'Content-Type': 'application/json',
    'x-student-id': 'local_admin_placement_edu',
    'x-user-email': 'admin@placement.edu',
    'x-user-role': 'admin'
  };

  const recruiterHeaders = {
    'Content-Type': 'application/json',
    'x-student-id': testCompanyUid,
    'x-user-email': testCompanyEmail,
    'x-user-role': 'company'
  };

  const studentHeaders = {
    'Content-Type': 'application/json',
    'x-student-id': 'default_student',
    'x-user-email': 'student@gmail.com',
    'x-user-role': 'student'
  };

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Register New Company
    // -------------------------------------------------------------------------
    console.log('🔹 TEST 1: Company Registration Flow');
    const registerRes = await fetch(`${BASE_URL}/api/auth/sync-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: testCompanyUid,
        email: testCompanyEmail,
        role: 'company',
        displayName: 'InnovateTech HR Lead',
        companyName: testCompanyName,
        website: 'https://innovatetech.com',
        industry: 'Cloud & AI Engineering',
        phone: '+91 9123456780',
        description: 'Next-gen enterprise cloud solutions provider.'
      })
    });

    const registerData = await registerRes.json();
    assert(registerRes.status === 200, 'Company registration endpoint returns HTTP 200');
    assert(registerData.success === true, 'Registration payload indicates success');
    assert(registerData.user?.approvalStatus === 'pending', 'Newly registered company has approvalStatus = "pending"');

    // -------------------------------------------------------------------------
    // TEST 2: Admin Portal Fetches Companies & Displays Pending Registrations
    // -------------------------------------------------------------------------
    console.log('\n🔹 TEST 2: Admin Portal Company Approvals Fetch & Filtering');
    const adminFetchRes = await fetch(`${BASE_URL}/api/admin/companies`, {
      headers: adminHeaders
    });
    const adminFetchData = await adminFetchRes.json();

    assert(adminFetchRes.status === 200, 'Admin can fetch companies list (HTTP 200)');
    assert(Array.isArray(adminFetchData.companies), 'Companies list is an array');
    assert(adminFetchData.counts?.pending > 0, `Pending count is greater than 0 (got ${adminFetchData.counts?.pending})`);

    const foundInAll = adminFetchData.companies.find(c => c.uid === testCompanyUid);
    assert(!!foundInAll, 'Newly registered company is listed in Admin Portal');
    assert(foundInAll?.approvalStatus === 'pending', 'Company listed with approvalStatus = "pending"');

    // Filter by pending
    const pendingFetchRes = await fetch(`${BASE_URL}/api/admin/companies?status=pending`, {
      headers: adminHeaders
    });
    const pendingData = await pendingFetchRes.json();
    const foundInPending = pendingData.companies.find(c => c.uid === testCompanyUid);
    assert(!!foundInPending, 'Company appears when filtering by status=pending');

    // Filter by approved (must NOT include the pending company)
    const approvedFetchRes = await fetch(`${BASE_URL}/api/admin/companies?status=approved`, {
      headers: adminHeaders
    });
    const approvedData = await approvedFetchRes.json();
    const foundInApproved = approvedData.companies.find(c => c.uid === testCompanyUid);
    assert(!foundInApproved, 'Pending company is excluded when filtering by status=approved');

    // -------------------------------------------------------------------------
    // TEST 3: Pending Recruiter Restrictions
    // -------------------------------------------------------------------------
    console.log('\n🔹 TEST 3: Pending Recruiter Access Restrictions');
    const recruiterProfileRes = await fetch(`${BASE_URL}/api/company/profile`, {
      headers: recruiterHeaders
    });
    const recruiterProfile = await recruiterProfileRes.json();

    assert(recruiterProfileRes.status === 200, 'Pending recruiter can retrieve company profile (HTTP 200)');
    assert(recruiterProfile.profile?.approvalStatus === 'pending', 'Recruiter profile shows approvalStatus = "pending"');

    // Attempt to publish drive while pending -> must be 403 Forbidden
    const driveAttemptRes = await fetch(`${BASE_URL}/api/company/drives`, {
      method: 'POST',
      headers: recruiterHeaders,
      body: JSON.stringify({
        jobRole: 'Software Development Engineer I',
        packageCTC: '14 LPA',
        driveDate: '2026-11-20',
        minCGPA: 7.5,
        minReadiness: 65,
        eligibleDepartments: ['CSE', 'AI & DS'],
        driveStatus: 'Upcoming',
        venue: 'Campus Placement Auditorium'
      })
    });
    assert(driveAttemptRes.status === 403, 'Pending recruiter is blocked from publishing drives (HTTP 403)');

    // -------------------------------------------------------------------------
    // TEST 4: Recruiter Self-Approval Prevention
    // -------------------------------------------------------------------------
    console.log('\n🔹 TEST 4: Recruiter Self-Approval Prevention');
    // Attempt 1: Recruiter calling Admin review endpoint directly
    const selfApproveReviewRes = await fetch(`${BASE_URL}/api/admin/companies/${testCompanyUid}/review`, {
      method: 'POST',
      headers: recruiterHeaders,
      body: JSON.stringify({ status: 'approved' })
    });
    assert(selfApproveReviewRes.status === 403, 'Recruiter cannot call admin review endpoint (HTTP 403 Forbidden)');

    // Attempt 2: Recruiter passing approvalStatus: 'approved' in profile update
    const selfApproveProfileRes = await fetch(`${BASE_URL}/api/company/profile`, {
      method: 'PUT',
      headers: recruiterHeaders,
      body: JSON.stringify({
        companyName: testCompanyName,
        approvalStatus: 'approved'
      })
    });
    const updatedProfileData = await selfApproveProfileRes.json();
    assert(updatedProfileData.profile?.approvalStatus === 'pending', 'Recruiter profile update ignores tampered approvalStatus');

    // -------------------------------------------------------------------------
    // TEST 5: Admin Rejection Flow (Requires Reason)
    // -------------------------------------------------------------------------
    console.log('\n🔹 TEST 5: Admin Rejection Flow & Requirement of Reason');
    // Rejection without reason -> should fail
    const rejectNoReasonRes = await fetch(`${BASE_URL}/api/admin/companies/${testCompanyUid}/review`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ status: 'rejected', reason: '' })
    });
    assert(rejectNoReasonRes.status === 400, 'Rejection without reason returns HTTP 400 Bad Request');

    // Rejection with valid reason
    const rejectionReasonText = 'Incomplete business registration documentation and unverified phone.';
    const rejectValidRes = await fetch(`${BASE_URL}/api/admin/companies/${testCompanyUid}/review`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        status: 'rejected',
        reason: rejectionReasonText
      })
    });
    const rejectData = await rejectValidRes.json();
    assert(rejectValidRes.status === 200, 'Rejection with valid reason succeeds (HTTP 200)');
    assert(rejectData.company?.approvalStatus === 'rejected', 'Company status updated to "rejected"');
    assert(rejectData.company?.rejectionReason === rejectionReasonText, 'Rejection reason recorded accurately');
    assert(!!rejectData.company?.reviewedBy, 'Reviewer ID recorded');
    assert(!!rejectData.company?.reviewedAt, 'Review timestamp recorded');

    // Recruiter checks profile after rejection
    const rejectedProfileRes = await fetch(`${BASE_URL}/api/company/profile`, {
      headers: recruiterHeaders
    });
    const rejectedProfile = await rejectedProfileRes.json();
    assert(rejectedProfile.profile?.approvalStatus === 'rejected', 'Recruiter sees approvalStatus = "rejected"');
    assert(rejectedProfile.profile?.rejectionReason === rejectionReasonText, 'Recruiter sees the rejection reason');

    // Rejected recruiter cannot publish drives
    const rejectedDriveRes = await fetch(`${BASE_URL}/api/company/drives`, {
      method: 'POST',
      headers: recruiterHeaders,
      body: JSON.stringify({
        jobRole: 'Software Engineer',
        packageCTC: '10 LPA'
      })
    });
    assert(rejectedDriveRes.status === 403, 'Rejected recruiter is blocked from publishing drives (HTTP 403)');

    // -------------------------------------------------------------------------
    // TEST 6: Admin Approval Flow
    // -------------------------------------------------------------------------
    console.log('\n🔹 TEST 6: Admin Approval Flow');
    const approveRes = await fetch(`${BASE_URL}/api/admin/companies/${testCompanyUid}/review`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ status: 'approved' })
    });
    const approveData = await approveRes.json();

    assert(approveRes.status === 200, 'Admin approve company returns HTTP 200');
    assert(approveData.company?.approvalStatus === 'approved', 'Company status updated to "approved"');
    assert(approveData.company?.rejectionReason === null, 'Rejection reason cleared upon approval');
    assert(!!approveData.company?.reviewedAt, 'Approval timestamp recorded');

    // -------------------------------------------------------------------------
    // TEST 7: Approved Recruiter Access & Drive Publishing
    // -------------------------------------------------------------------------
    console.log('\n🔹 TEST 7: Approved Recruiter Access & Drive Publishing');
    const approvedProfileRes = await fetch(`${BASE_URL}/api/company/profile`, {
      headers: recruiterHeaders
    });
    const approvedProfile = await approvedProfileRes.json();

    assert(approvedProfile.profile?.approvalStatus === 'approved', 'Recruiter profile shows approvalStatus = "approved"');

    // Now publishing drive MUST succeed
    const publishDriveRes = await fetch(`${BASE_URL}/api/company/drives`, {
      method: 'POST',
      headers: recruiterHeaders,
      body: JSON.stringify({
        jobRole: 'Full Stack Engineer',
        packageCTC: '16 LPA',
        driveDate: '2026-11-25',
        minCGPA: 7.0,
        minReadiness: 60,
        eligibleDepartments: ['CSE', 'ECE', 'AI & DS'],
        driveStatus: 'Upcoming',
        venue: 'Campus Auditorium A',
        description: 'Building next-generation distributed systems.'
      })
    });
    const publishData = await publishDriveRes.json();

    assert(publishDriveRes.status === 201, 'Approved company can publish recruitment drive (HTTP 201 Created)');
    assert(publishData.success === true, 'Drive published successfully');
    assert(publishData.drive?.jobRole === 'Full Stack Engineer', 'Drive job role saved correctly');
    assert(publishData.drive?.companyApprovalStatus === 'approved', 'Drive companyApprovalStatus marked as "approved"');

    // -------------------------------------------------------------------------
    // TEST 8: Unauthorized / Student Access to Admin Endpoints
    // -------------------------------------------------------------------------
    console.log('\n🔹 TEST 8: Role-Based Authorization Enforcement');
    const studentAdminAccessRes = await fetch(`${BASE_URL}/api/admin/companies`, {
      headers: studentHeaders
    });
    assert(studentAdminAccessRes.status === 403, 'Student access to admin companies endpoint returns HTTP 403 Forbidden');

    const unauthAdminAccessRes = await fetch(`${BASE_URL}/api/admin/companies`, {
      headers: { 'Content-Type': 'application/json' }
    });
    assert(unauthAdminAccessRes.status === 403, 'Unauthenticated access to admin companies endpoint returns HTTP 403 Forbidden');

  } catch (err) {
    console.error('Fatal error during test execution:', err);
    failed++;
  }

  console.log('\n================================================================');
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
