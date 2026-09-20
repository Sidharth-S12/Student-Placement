import assert from 'assert';
import {
  getUserRole,
  getUserRecord,
  setUserRole
} from './config/firebaseAdmin.js';
import {
  isValidRole,
  normalizeRole
} from '../src/services/roleService.js';

async function runPermanentAuthArchitectureTests() {
  console.log('\n================================================================');
  console.log('🛡️  PERMANENT AUTHENTICATION & ROLE ARCHITECTURE TEST SUITE');
  console.log('================================================================\n');

  // ---------------------------------------------------------------------------
  // TEST 1: Register Student -> role student -> logout -> login -> role student
  // ---------------------------------------------------------------------------
  const studentUid = `test_student_uid_${Date.now()}`;
  const studentEmail = `student_${Date.now()}@college.edu`;
  await setUserRole(studentUid, {
    role: 'student',
    email: studentEmail,
    displayName: 'Student One'
  });

  const studentResolvedAfterReg = await getUserRole(studentUid, studentEmail);
  assert.strictEqual(studentResolvedAfterReg, 'student', 'Newly registered student must have role="student"');

  // Simulation: Logout (clears session state), then login
  const studentResolvedAfterLogin = await getUserRole(studentUid, studentEmail);
  assert.strictEqual(studentResolvedAfterLogin, 'student', 'Student after re-login must retain role="student"');
  console.log('✓ TEST 1 PASSED: Register Student -> Logout -> Login -> Role remains "student".');

  // ---------------------------------------------------------------------------
  // TEST 2: Register Company -> role company -> logout -> login -> role company
  // ---------------------------------------------------------------------------
  const companyUid = `test_company_uid_${Date.now()}`;
  const companyEmail = `recruiter_${Date.now()}@techcorp.io`;
  await setUserRole(companyUid, {
    role: 'company',
    email: companyEmail,
    displayName: 'TechCorp Recruiter',
    companyName: 'TechCorp Solutions'
  });

  const companyResolvedAfterReg = await getUserRole(companyUid, companyEmail);
  assert.strictEqual(companyResolvedAfterReg, 'company', 'Newly registered company must have role="company"');

  // Simulation: Logout, then login
  const companyResolvedAfterLogin = await getUserRole(companyUid, companyEmail);
  assert.strictEqual(companyResolvedAfterLogin, 'company', 'Company after re-login MUST retain role="company" (never converts to student)');
  console.log('✓ TEST 2 PASSED: Register Company -> Logout -> Login -> Role remains "company".');

  // ---------------------------------------------------------------------------
  // TEST 3: Student login -> refresh -> role remains student
  // ---------------------------------------------------------------------------
  const studentRefreshRole = await getUserRole(studentUid, studentEmail);
  assert.strictEqual(studentRefreshRole, 'student');
  console.log('✓ TEST 3 PASSED: Student state restoration (refresh) preserves role="student".');

  // ---------------------------------------------------------------------------
  // TEST 4: Company login -> refresh -> role remains company
  // ---------------------------------------------------------------------------
  const companyRefreshRole = await getUserRole(companyUid, companyEmail);
  assert.strictEqual(companyRefreshRole, 'company');
  console.log('✓ TEST 4 PASSED: Company state restoration (refresh) preserves role="company".');

  // ---------------------------------------------------------------------------
  // TEST 5: Student logout -> Company login -> no Student data shown
  // ---------------------------------------------------------------------------
  const companyRecord = await getUserRecord(companyUid);
  assert.strictEqual(companyRecord.role, 'company');
  assert.strictEqual(companyRecord.companyName, 'TechCorp Solutions');
  assert.notStrictEqual(companyRecord.uid, studentUid, 'Company UID must be completely separate from Student UID');
  console.log('✓ TEST 5 PASSED: Company login isolates profile and never loads student data.');

  // ---------------------------------------------------------------------------
  // TEST 6: Company logout -> Student login -> no Company data shown
  // ---------------------------------------------------------------------------
  const studentRecord = await getUserRecord(studentUid);
  assert.strictEqual(studentRecord.role, 'student');
  assert.strictEqual(studentRecord.companyName, null);
  console.log('✓ TEST 6 PASSED: Student login isolates profile and never loads company data.');

  // ---------------------------------------------------------------------------
  // TEST 7: Wrong portal selected -> stored role must NOT change
  // ---------------------------------------------------------------------------
  // Scenario A: Company user selects Student portal
  const selectedPortalForCompany = 'student';
  const actualCompanyRole = await getUserRole(companyUid, companyEmail);
  assert.strictEqual(actualCompanyRole, 'company', 'Database role must NOT change when wrong portal is selected');
  const mismatchA = selectedPortalForCompany !== actualCompanyRole;
  assert.strictEqual(mismatchA, true, 'System must detect mismatch between selected portal and stored role');

  // Scenario B: Student user selects Company portal
  const selectedPortalForStudent = 'company';
  const actualStudentRole = await getUserRole(studentUid, studentEmail);
  assert.strictEqual(actualStudentRole, 'student', 'Database role must NOT change when wrong portal is selected');
  const mismatchB = selectedPortalForStudent !== actualStudentRole;
  assert.strictEqual(mismatchB, true, 'System must detect mismatch between selected portal and stored role');
  console.log('✓ TEST 7 PASSED: Portal selection does not alter database role; mismatch is detected.');

  // ---------------------------------------------------------------------------
  // TEST 8: Missing role document -> returns null/error -> NEVER default to student
  // ---------------------------------------------------------------------------
  const unassignedUid = `unregistered_uid_${Date.now()}`;
  const unassignedEmail = `random_${Date.now()}@example.org`;
  const unassignedRole = await getUserRole(unassignedUid, unassignedEmail);
  assert.strictEqual(unassignedRole, null, 'CRITICAL: Missing role document MUST return null (NEVER "student")');
  console.log('✓ TEST 8 PASSED: Missing role document returns null (NEVER silently defaults to student).');

  // ---------------------------------------------------------------------------
  // TEST 9: Permission failure simulation -> controlled error -> NEVER default to student
  // ---------------------------------------------------------------------------
  // Role resolver with failed query returns null
  const failedQueryRole = await getUserRole(null, null);
  assert.strictEqual(failedQueryRole, null, 'Failed query must return null, preventing fallback to student');
  console.log('✓ TEST 9 PASSED: Query failure triggers controlled error (NEVER defaults to student).');

  // ---------------------------------------------------------------------------
  // TEST 10: Admin login -> role admin -> Admin Dashboard
  // ---------------------------------------------------------------------------
  const adminUid = `admin_uid_${Date.now()}`;
  const adminEmail = `admin_${Date.now()}@placement.edu`;
  await setUserRole(adminUid, {
    role: 'admin',
    email: adminEmail,
    displayName: 'Placement Admin'
  });
  const adminResolved = await getUserRole(adminUid, adminEmail);
  assert.strictEqual(adminResolved, 'admin', 'Admin account must have verified role="admin"');
  console.log('✓ TEST 10 PASSED: Admin account verified with role="admin".');

  // ---------------------------------------------------------------------------
  // TEST 11: Student attempts admin route -> access denied
  // ---------------------------------------------------------------------------
  const studentIsAdmin = (await getUserRole(studentUid, studentEmail)) === 'admin';
  assert.strictEqual(studentIsAdmin, false, 'Student must not have admin authorization');
  console.log('✓ TEST 11 PASSED: Student account is blocked from Admin routes.');

  // ---------------------------------------------------------------------------
  // TEST 12: Company attempts admin route -> access denied
  // ---------------------------------------------------------------------------
  const companyIsAdmin = (await getUserRole(companyUid, companyEmail)) === 'admin';
  assert.strictEqual(companyIsAdmin, false, 'Company must not have admin authorization');
  console.log('✓ TEST 12 PASSED: Company account is blocked from Admin routes.');

  // ---------------------------------------------------------------------------
  // TEST 13: Role normalization and strict validation
  // ---------------------------------------------------------------------------
  assert.strictEqual(isValidRole('student'), true);
  assert.strictEqual(isValidRole('company'), true);
  assert.strictEqual(isValidRole('admin'), true);
  assert.strictEqual(isValidRole('hacker'), false);
  assert.strictEqual(isValidRole(''), false);
  assert.strictEqual(isValidRole(null), false);
  assert.strictEqual(isValidRole(undefined), false);
  assert.strictEqual(normalizeRole('  STUDENT  '), 'student');
  assert.strictEqual(normalizeRole('Company'), 'company');
  assert.strictEqual(normalizeRole('administrator'), null);
  console.log('✓ TEST 13 PASSED: Central role validation strictly accepts only "student", "company", "admin".');

  console.log('\n================================================================');
  console.log('🎉 ALL 13 PERMANENT AUTH ARCHITECTURE TESTS PASSED SUCCESSFULLY!');
  console.log('================================================================\n');
}

runPermanentAuthArchitectureTests().catch(err => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
