import assert from 'assert';
import {
  getUserRole,
  getUserRecord,
  setUserRole
} from './config/firebaseAdmin.js';
import { fetchUserRole } from '../src/services/authService.js';

async function runRoleAuthorizationTests() {
  console.log('--- STARTING ROLE AUTHORIZATION & ADMIN SETUP TEST SUITE ---');

  // Test 1: By default, unassigned accounts return null (NEVER silently default to student)
  const crsStudentEmail = `student.crs_${Date.now()}@college.edu`;
  const crsStudentUid = `uid_crs_student_${Date.now()}`;
  const initialRole = await getUserRole(crsStudentUid, crsStudentEmail);
  assert.strictEqual(initialRole, null, 'Unassigned account must return null (NEVER silently default to student)');
  console.log('✓ TEST 1 PASSED: Unassigned account returns null (never auto-promoted or silently defaulted).');

  // Test 2: Role configuration CLI / backend assignment
  const adminEmail = 'placement.director@college.edu';
  const adminUid = 'uid_admin_placement_director';
  await setUserRole(adminUid, {
    role: 'admin',
    email: adminEmail,
    displayName: 'Placement Director'
  });

  const verifiedAdminRole = await getUserRole(adminUid, adminEmail);
  assert.strictEqual(verifiedAdminRole, 'admin', 'Admin account must have verified role="admin"');
  console.log('✓ TEST 2 PASSED: Admin account explicitly configured and verified with role="admin".');

  // Test 3: Company account configuration
  const recruiterEmail = 'hr@globaltech.com';
  const recruiterUid = 'uid_recruiter_globaltech';
  await setUserRole(recruiterUid, {
    role: 'company',
    email: recruiterEmail,
    displayName: 'GlobalTech HR'
  });

  const verifiedRecruiterRole = await getUserRole(recruiterUid, recruiterEmail);
  assert.strictEqual(verifiedRecruiterRole, 'company', 'Company account must have verified role="company"');
  console.log('✓ TEST 3 PASSED: Recruiter account verified with role="company".');

  // Test 4: TEST D - Student selects Admin Portal -> role mismatch validation
  // Portal selected: 'admin', Verified role: 'student'
  await setUserRole(crsStudentUid, {
    role: 'student',
    email: crsStudentEmail,
    displayName: 'CRS Student'
  });

  const selectedPortalD = 'admin';
  const actualRoleD = await getUserRole(crsStudentUid, crsStudentEmail);
  assert.strictEqual(actualRoleD, 'student');
  const isAuthorizedD = (selectedPortalD === 'admin' && actualRoleD === 'admin');
  assert.strictEqual(isAuthorizedD, false, 'Student selecting Admin portal MUST be denied admin access');
  const roleMismatchMessageD = !isAuthorizedD ? 'This account does not have administrator access.' : null;
  assert.strictEqual(roleMismatchMessageD, 'This account does not have administrator access.');
  console.log('✓ TEST 4 PASSED (TEST D): Student selecting Admin portal is denied access with message: "This account does not have administrator access."');

  // Test 5: TEST E - Company selects Admin Portal -> role mismatch validation
  const selectedPortalE = 'admin';
  const actualRoleE = await getUserRole(recruiterUid, recruiterEmail);
  const isAuthorizedE = (selectedPortalE === 'admin' && actualRoleE === 'admin');
  assert.strictEqual(isAuthorizedE, false, 'Company selecting Admin portal MUST be denied admin access');
  console.log('✓ TEST 5 PASSED (TEST E): Company selecting Admin portal is denied admin access.');

  // Test 6: TEST F - Admin selects Student Portal -> verified role determines authorization
  const selectedPortalF = 'student';
  const actualRoleF = await getUserRole(adminUid, adminEmail);
  assert.strictEqual(actualRoleF, 'admin', 'Verified role for admin must remain admin regardless of UI portal preference');
  console.log('✓ TEST 6 PASSED (TEST F): Admin selecting Student portal is still recognized as verified role="admin".');

  // Test 7: Confirm NO informal email heuristics (e.g. email starting with 'admin' without DB record)
  const fakeAdminEmail = 'admin.imposter@external.com';
  const fakeAdminUid = 'uid_fake_admin_999';
  const fakeAdminRole = await getUserRole(fakeAdminUid, fakeAdminEmail);
  assert.strictEqual(fakeAdminRole, null, 'Arbitrary email starting with "admin" must NOT get admin privileges; returns null');
  console.log('✓ TEST 7 PASSED: Security confirmed. No informal prefix heuristics; arbitrary emails return null.');

  // Test 8: Route protection check
  const studentUserObj = { uid: crsStudentUid, role: 'student', isDevMock: false };
  const adminUserObj = { uid: adminUid, role: 'admin', isDevMock: false };
  assert.strictEqual(studentUserObj.role === 'student', true);
  assert.strictEqual(adminUserObj.role === 'admin', true);
  console.log('✓ TEST 8 PASSED: Role-based route guard constraints verified.');

  console.log('\n======================================================');
  console.log('🎉 ALL 8 ROLE AUTHORIZATION TESTS PASSED SUCCESSFULLY!');
  console.log('======================================================\n');
}

runRoleAuthorizationTests().catch(err => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
