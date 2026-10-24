/**
 * Comprehensive Recruiter Portal Isolation & Authorization Test Suite
 * Tests Company A vs Company B isolation, 403 protections, matching logic, and workflows.
 */

import http from 'http';

function makeRequest(method, path, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(rawData);
        } catch (e) {
          parsed = rawData;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(message);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

async function runTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING PLACEMENT GENIE RECRUITER PORTAL ISOLATION TEST SUITE');
  console.log('================================================================\n');

  const timestamp = Date.now();
  const companyAUid = `test_comp_A_${timestamp}`;
  const companyBUid = `test_comp_B_${timestamp}`;
  const pendingCompUid = `test_comp_pending_${timestamp}`;
  const rejectedCompUid = `test_comp_rejected_${timestamp}`;

  const adminHeaders = {
    'x-user-role': 'admin',
    'x-user-uid': 'local_admin_placement_edu',
    'x-user-email': 'admin@placement.edu'
  };

  const compAHeaders = {
    'x-user-role': 'company',
    'x-user-uid': companyAUid,
    'x-user-email': `recruiter_${timestamp}@alphatech.com`
  };

  const compBHeaders = {
    'x-user-role': 'company',
    'x-user-uid': companyBUid,
    'x-user-email': `recruiter_${timestamp}@betasoft.com`
  };

  const pendingHeaders = {
    'x-user-role': 'company',
    'x-user-uid': pendingCompUid,
    'x-user-email': `pending_${timestamp}@gammapending.com`
  };

  const rejectedHeaders = {
    'x-user-role': 'company',
    'x-user-uid': rejectedCompUid,
    'x-user-email': `rejected_${timestamp}@deltarejected.com`
  };

  // 1. Setup Companies in Firestore / Mock Store
  console.log('--- Step 1: Registering Test Companies ---');
  await makeRequest('POST', '/api/auth/sync-role', {}, {
    uid: companyAUid,
    email: compAHeaders['x-user-email'],
    role: 'company',
    companyName: 'AlphaTech Corp',
    approvalStatus: 'approved'
  });

  await makeRequest('POST', '/api/auth/sync-role', {}, {
    uid: companyBUid,
    email: compBHeaders['x-user-email'],
    role: 'company',
    companyName: 'BetaSoft Labs',
    approvalStatus: 'approved'
  });

  await makeRequest('POST', '/api/auth/sync-role', {}, {
    uid: pendingCompUid,
    email: pendingHeaders['x-user-email'],
    role: 'company',
    companyName: 'GammaPending Inc',
    approvalStatus: 'pending'
  });

  await makeRequest('POST', '/api/auth/sync-role', {}, {
    uid: rejectedCompUid,
    email: rejectedHeaders['x-user-email'],
    role: 'company',
    companyName: 'DeltaRejected Ltd',
    approvalStatus: 'rejected'
  });

  // Explicitly approve Company A and Company B via Admin review
  await makeRequest('POST', `/api/admin/companies/${companyAUid}/review`, adminHeaders, {
    status: 'approved',
    reason: 'Approved for automated testing'
  });
  await makeRequest('POST', `/api/admin/companies/${companyBUid}/review`, adminHeaders, {
    status: 'approved',
    reason: 'Approved for automated testing'
  });

  // Verify Company A Profile
  const compAProfileRes = await makeRequest('GET', '/api/company/profile', compAHeaders);
  assert(compAProfileRes.status === 200, 'Company A profile fetch status is 200');
  assert(compAProfileRes.data.profile.companyName === 'AlphaTech Corp', 'Company A receives its own profile');
  assert(compAProfileRes.data.profile.approvalStatus === 'approved', 'Company A profile is approved');

  // Verify Company B Profile
  const compBProfileRes = await makeRequest('GET', '/api/company/profile', compBHeaders);
  assert(compBProfileRes.status === 200, 'Company B profile fetch status is 200');
  assert(compBProfileRes.data.profile.companyName === 'BetaSoft Labs', 'Company B receives its own profile');

  // 2. Setup Students for Eligibility Testing
  console.log('\n--- Step 2: Registering Test Students with Criteria ---');
  const student1Uid = `student_1_${timestamp}`; // CSE, CGPA 8.5, Readiness 80, Batch 2026
  const student2Uid = `student_2_${timestamp}`; // ECE, CGPA 6.8, Readiness 60, Batch 2026
  const student3Uid = `student_3_${timestamp}`; // ME, CGPA 9.2, Readiness 88, Batch 2026
  const student4Uid = `student_4_${timestamp}`; // Missing CGPA & Dept

  const s1Headers = { 'x-user-role': 'student', 'x-user-uid': student1Uid, 'x-user-email': `student1_${timestamp}@gmail.com` };
  const s2Headers = { 'x-user-role': 'student', 'x-user-uid': student2Uid, 'x-user-email': `student2_${timestamp}@gmail.com` };
  const s3Headers = { 'x-user-role': 'student', 'x-user-uid': student3Uid, 'x-user-email': `student3_${timestamp}@gmail.com` };
  const s4Headers = { 'x-user-role': 'student', 'x-user-uid': student4Uid, 'x-user-email': `student4_${timestamp}@gmail.com` };

  await makeRequest('POST', '/api/auth/sync-role', {}, {
    uid: student1Uid,
    email: s1Headers['x-user-email'],
    role: 'student',
    displayName: 'Alice Walker'
  });
  await makeRequest('POST', '/api/students/profile', s1Headers, {
    studentId: student1Uid,
    profile: {
      personalInfo: { fullName: 'Alice Walker', email: s1Headers['x-user-email'] },
      department: 'CSE',
      education: { college: 'Tech University', degree: 'B.Tech', branch: 'CSE', cgpa: 8.5, graduationYear: '2026' },
      placementScores: { overallReadiness: 80, technicalScore: 85, aptitudeScore: 78 }
    }
  });

  await makeRequest('POST', '/api/auth/sync-role', {}, {
    uid: student2Uid,
    email: s2Headers['x-user-email'],
    role: 'student',
    displayName: 'Bob Martinez'
  });
  await makeRequest('POST', '/api/students/profile', s2Headers, {
    studentId: student2Uid,
    profile: {
      personalInfo: { fullName: 'Bob Martinez', email: s2Headers['x-user-email'] },
      department: 'ECE',
      education: { college: 'Tech University', degree: 'B.Tech', branch: 'ECE', cgpa: 6.8, graduationYear: '2026' },
      placementScores: { overallReadiness: 60, technicalScore: 62, aptitudeScore: 58 }
    }
  });

  await makeRequest('POST', '/api/auth/sync-role', {}, {
    uid: student3Uid,
    email: s3Headers['x-user-email'],
    role: 'student',
    displayName: 'Charlie Davis'
  });
  await makeRequest('POST', '/api/students/profile', s3Headers, {
    studentId: student3Uid,
    profile: {
      personalInfo: { fullName: 'Charlie Davis', email: s3Headers['x-user-email'] },
      department: 'ME',
      education: { college: 'Tech University', degree: 'B.Tech', branch: 'ME', cgpa: 9.2, graduationYear: '2026' },
      placementScores: { overallReadiness: 88, technicalScore: 90, aptitudeScore: 85 }
    }
  });

  await makeRequest('POST', '/api/auth/sync-role', {}, {
    uid: student4Uid,
    email: s4Headers['x-user-email'],
    role: 'student',
    displayName: 'Daisy Incomplete'
  });
  await makeRequest('POST', '/api/students/profile', s4Headers, {
    studentId: student4Uid,
    profile: {
      personalInfo: { fullName: 'Daisy Incomplete', email: s4Headers['x-user-email'] },
      education: { college: 'Tech University' }
      // Missing CGPA, department, placementScores
    }
  });

  // 3. Post Drives for Company A and Company B
  console.log('\n--- Step 3: Posting Job Drives ---');
  // Company A posts Job A1: CSE / ECE, CGPA 7.5+, Readiness 70%+, Batch 2026
  const jobA1Res = await makeRequest('POST', '/api/company/drives', compAHeaders, {
    jobRole: 'Cloud Software Engineer',
    packageCTC: '16 LPA',
    minCgpa: 7.5,
    minReadiness: 70,
    batch: '2026',
    eligibleDepartments: ['CSE', 'ECE'],
    driveDate: '2026-11-15',
    status: 'Upcoming'
  });
  assert(jobA1Res.status === 201, 'Company A posts Job A1 successfully');
  const jobA1 = jobA1Res.data.drive;
  assert(jobA1.companyId === companyAUid, 'Job A1 ownership is derived server-side to Company A');

  // Admin approves Job A1
  await makeRequest('POST', `/api/admin/jobs/${jobA1.id}/review`, adminHeaders, {
    status: 'approved',
    reason: 'Approved for campus publishing'
  });

  // Company B posts Job B1: ME only, CGPA 8.0+, Readiness 75%+, Batch 2026
  const jobB1Res = await makeRequest('POST', '/api/company/drives', compBHeaders, {
    jobRole: 'Robotics Control Engineer',
    packageCTC: '18 LPA',
    minCgpa: 8.0,
    minReadiness: 75,
    batch: '2026',
    eligibleDepartments: ['ME'],
    driveDate: '2026-11-20',
    status: 'Upcoming'
  });
  assert(jobB1Res.status === 201, 'Company B posts Job B1 successfully');
  const jobB1 = jobB1Res.data.drive;
  assert(jobB1.companyId === companyBUid, 'Job B1 ownership is derived server-side to Company B');

  // Admin approves Job B1
  await makeRequest('POST', `/api/admin/jobs/${jobB1.id}/review`, adminHeaders, {
    status: 'approved',
    reason: 'Approved for campus publishing'
  });

  // 4. Test Job Listing Isolation
  console.log('\n--- Step 4: Testing Job Listing Isolation ---');
  const compADrivesRes = await makeRequest('GET', '/api/company/drives', compAHeaders);
  assert(compADrivesRes.status === 200, 'Company A fetches its drives');
  const compADriveIds = compADrivesRes.data.drives.map(d => d.id);
  assert(compADriveIds.includes(jobA1.id), 'Company A sees Job A1');
  assert(!compADriveIds.includes(jobB1.id), 'Company A CANNOT see Job B1 in its drives list');

  const compBDrivesRes = await makeRequest('GET', '/api/company/drives', compBHeaders);
  assert(compBDrivesRes.status === 200, 'Company B fetches its drives');
  const compBDriveIds = compBDrivesRes.data.drives.map(d => d.id);
  assert(compBDriveIds.includes(jobB1.id), 'Company B sees Job B1');
  assert(!compBDriveIds.includes(jobA1.id), 'Company B CANNOT see Job A1 in its drives list');

  // 5. Test Cross-Company 403 Forbidden Protections
  console.log('\n--- Step 5: Testing Cross-Company 403 Forbidden Access Protections ---');
  // Company A attempts to view Company B's job candidates
  const crossCandidatesRes = await makeRequest('GET', `/api/company/drives/${jobB1.id}/candidates`, compAHeaders);
  assert(crossCandidatesRes.status === 403, 'Company A accessing Job B1 candidates returns 403 Forbidden');

  // Company A attempts to view Company B's eligible students
  const crossEligibleRes = await makeRequest('GET', `/api/company/drives/${jobB1.id}/eligible-students`, compAHeaders);
  assert(crossEligibleRes.status === 403, 'Company A accessing Job B1 eligible students returns 403 Forbidden');

  // Company A attempts to update Company B's drive
  const crossUpdateRes = await makeRequest('PUT', `/api/company/drives/${jobB1.id}`, compAHeaders, {
    jobRole: 'Hacked Title'
  });
  assert(crossUpdateRes.status === 403, 'Company A updating Job B1 returns 403 Forbidden');

  // Company A attempts to delete Company B's drive
  const crossDeleteRes = await makeRequest('DELETE', `/api/company/drives/${jobB1.id}`, compAHeaders);
  assert(crossDeleteRes.status === 403, 'Company A deleting Job B1 returns 403 Forbidden');

  // 6. Test Eligible Candidates Matching Logic
  console.log('\n--- Step 6: Testing Job Criteria Matching Logic ---');
  // Job A1: CSE/ECE, CGPA >= 7.5, Readiness >= 70%
  const eligibleA1Res = await makeRequest('GET', `/api/company/drives/${jobA1.id}/eligible-students`, compAHeaders);
  assert(eligibleA1Res.status === 200, 'Company A fetches Job A1 eligible students');
  const eligibleA1Uids = eligibleA1Res.data.eligibleStudents.map(s => s.uid);
  assert(eligibleA1Uids.includes(student1Uid), 'Student 1 (CSE, CGPA 8.5, Readiness 80%) is eligible for Job A1');
  assert(!eligibleA1Uids.includes(student2Uid), 'Student 2 (ECE, CGPA 6.8 < 7.5) is NOT eligible for Job A1');
  assert(!eligibleA1Uids.includes(student3Uid), 'Student 3 (ME not in CSE/ECE) is NOT eligible for Job A1');
  assert(!eligibleA1Uids.includes(student4Uid), 'Student 4 (Missing data) is NOT falsely claimed as eligible');

  // Job B1: ME only, CGPA >= 8.0, Readiness >= 75%
  const eligibleB1Res = await makeRequest('GET', `/api/company/drives/${jobB1.id}/eligible-students`, compBHeaders);
  assert(eligibleB1Res.status === 200, 'Company B fetches Job B1 eligible students');
  const eligibleB1Uids = eligibleB1Res.data.eligibleStudents.map(s => s.uid);
  assert(eligibleB1Uids.includes(student3Uid), 'Student 3 (ME, CGPA 9.2, Readiness 88%) is eligible for Job B1');
  assert(!eligibleB1Uids.includes(student1Uid), 'Student 1 (CSE not in ME) is NOT eligible for Job B1');

  // 7. Test Student Application & Officer Nominations Workflow
  console.log('\n--- Step 7: Testing Direct Applications & Nominations Workflow ---');
  const student1Headers = {
    'x-user-role': 'student',
    'x-user-uid': student1Uid,
    'x-user-email': `student1_${timestamp}@gmail.com`
  };

  // Student 1 applies to Job A1
  const appA1Res = await makeRequest('POST', '/api/applications/apply', student1Headers, {
    jobId: jobA1.id,
    coverNote: 'Excited to apply for Cloud Software Engineer'
  });
  assert(appA1Res.status === 201 || appA1Res.status === 200, 'Student 1 applies to Job A1 successfully');
  const appA1 = appA1Res.data.application;

  // Placement Officer nominates Student 3 to Job B1
  const nomB1Res = await makeRequest('POST', '/api/applications/nominate', adminHeaders, {
    jobId: jobB1.id,
    studentIds: [student3Uid],
    officerNotes: 'High aptitude candidate recommended for robotics',
    requiresConsent: false
  });
  assert(nomB1Res.status === 201 || nomB1Res.status === 200, 'Placement Officer nominates Student 3 for Job B1');
  const nomB1 = (nomB1Res.data.nominations && nomB1Res.data.nominations[0]) || nomB1Res.data.nomination;

  // Check Company A candidates view
  const compACandidatesRes = await makeRequest('GET', `/api/company/drives/${jobA1.id}/candidates`, compAHeaders);
  assert(compACandidatesRes.status === 200, 'Company A fetches candidates for Job A1');
  assert(compACandidatesRes.data.directApplicants.some(a => a.id === appA1.id), 'Company A sees Student 1 in direct applicants');
  assert(compACandidatesRes.data.nominations.length === 0, 'Company A sees 0 nominations for Job A1');

  // Check Company B candidates view
  const compBCandidatesRes = await makeRequest('GET', `/api/company/drives/${jobB1.id}/candidates`, compBHeaders);
  assert(compBCandidatesRes.status === 200, 'Company B fetches candidates for Job B1');
  assert(compBCandidatesRes.data.nominations.some(n => n.id === nomB1.id), 'Company B sees Student 3 in officer nominations');

  // Company A attempts to update status on Company B's nomination
  const crossAppUpdateRes = await makeRequest('PUT', `/api/company/applications/${nomB1.id}/status`, compAHeaders, {
    status: 'selected'
  });
  assert(crossAppUpdateRes.status === 403, 'Company A updating Company B application status returns 403 Forbidden');

  // Company A updates status on its own applicant: Shortlist -> Interview -> Selected
  const shortlistRes = await makeRequest('PUT', `/api/company/applications/${appA1.id}/status`, compAHeaders, {
    status: 'shortlisted',
    remarks: 'Profile approved for technical round'
  });
  assert(shortlistRes.status === 200, 'Company A shortlists Student 1');
  assert(shortlistRes.data.application.status.toLowerCase() === 'shortlisted', 'Status updated to shortlisted');

  const interviewRes = await makeRequest('PUT', `/api/company/applications/${appA1.id}/status`, compAHeaders, {
    status: 'interview_scheduled',
    interviewDate: '2026-11-18T10:00:00Z',
    interviewRound: 'Round 1: System Architecture'
  });
  assert(interviewRes.status === 200, 'Company A schedules interview for Student 1');

  const selectRes = await makeRequest('PUT', `/api/company/applications/${appA1.id}/status`, compAHeaders, {
    status: 'selected',
    remarks: 'Offer extended: 16 LPA'
  });
  assert(selectRes.status === 200, 'Company A selects Student 1');
  assert(selectRes.data.application.status.toLowerCase() === 'selected', 'Status updated to selected');

  // 8. Test Overview Endpoint Metrics
  console.log('\n--- Step 8: Testing Company Overview Metrics ---');
  const overviewARes = await makeRequest('GET', '/api/company/overview', compAHeaders);
  assert(overviewARes.status === 200, 'Company A fetches overview metrics');
  const statsA = overviewARes.data.stats;
  assert(statsA.totalJobs >= 1, 'Company A overview reports own jobs');
  assert(statsA.selectedCount >= 1, 'Company A overview reports 1 selected candidate');
  assert(statsA.totalEligibleCandidates >= 1, 'Company A overview reports eligible candidates');

  // 9. Test Pending & Rejected Company Restrictions
  console.log('\n--- Step 9: Testing Pending & Rejected Recruiter Restrictions ---');
  const pendingPostRes = await makeRequest('POST', '/api/company/drives', pendingHeaders, {
    jobRole: 'Unauthorized Pending Job'
  });
  assert(pendingPostRes.status === 403, 'Pending recruiter cannot post recruitment drive (403 Forbidden)');

  const rejectedPostRes = await makeRequest('POST', '/api/company/drives', rejectedHeaders, {
    jobRole: 'Unauthorized Rejected Job'
  });
  assert(rejectedPostRes.status === 403, 'Rejected recruiter cannot post recruitment drive (403 Forbidden)');

  // 10. Test Recruiter Tamper Resistance on Profile Approval Status
  console.log('\n--- Step 10: Testing Recruiter Cannot Self-Approve ---');
  const tamperProfileRes = await makeRequest('PUT', '/api/company/profile', compAHeaders, {
    companyName: 'AlphaTech International',
    approvalStatus: 'escalated_super_admin'
  });
  assert(tamperProfileRes.status === 200, 'Profile updated');
  assert(tamperProfileRes.data.profile.approvalStatus === 'approved', 'approvalStatus escalation ignored by server');

  // 11. Test College-Wide Student Directory Blocking for Recruiters
  console.log('\n--- Step 11: Testing College-Wide Student Directory Access is Blocked ---');
  const blockStudentsRes = await makeRequest('GET', '/api/students', compAHeaders);
  assert(blockStudentsRes.status === 403, 'Recruiter accessing /api/students returns 403 Forbidden');

  console.log('\n================================================================');
  console.log('🎉 ALL RECRUITER PORTAL ISOLATION & SECURITY TESTS PASSED!');
  console.log('================================================================');
}

runTests().catch((err) => {
  console.error('\n💥 Test run failed with error:', err);
  process.exit(1);
});
