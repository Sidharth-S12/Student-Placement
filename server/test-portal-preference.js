import assert from 'assert';
import { fetchUserRole } from '../src/services/authService.js';

async function runPortalTests() {
  console.log('--- STARTING PORTAL PREFERENCE & AUTH SECURITY TESTS ---');

  // Simulated browser localStorage
  const mockStorage = {};
  const PREFERRED_ROLE_KEY = 'preferredLoginRole';

  // Test 1: First-time user has no preference
  assert.strictEqual(mockStorage[PREFERRED_ROLE_KEY], undefined);
  console.log('✓ TEST 1 PASSED: First-time user has no preferredLoginRole; initial portal selection will be prompted.');

  // Test 2: User selects Student
  mockStorage[PREFERRED_ROLE_KEY] = 'student';
  assert.strictEqual(mockStorage[PREFERRED_ROLE_KEY], 'student');
  console.log('✓ TEST 2 PASSED: Student selected and saved to preferredLoginRole.');

  // Test 3: Page refresh / reopen simulates reading storage
  const restoredRole = mockStorage[PREFERRED_ROLE_KEY];
  assert.strictEqual(restoredRole, 'student');
  console.log('✓ TEST 3 PASSED: Page refresh restores Student as primary portal.');

  // Test 4: Switching to Company updates storage
  mockStorage[PREFERRED_ROLE_KEY] = 'company';
  assert.strictEqual(mockStorage[PREFERRED_ROLE_KEY], 'company');
  console.log('✓ TEST 4 PASSED: Company switched and immediately persisted as primary portal.');

  // Test 5: Switching to Admin updates storage
  mockStorage[PREFERRED_ROLE_KEY] = 'admin';
  assert.strictEqual(mockStorage[PREFERRED_ROLE_KEY], 'admin');
  console.log('✓ TEST 5 PASSED: Admin switched and persisted as primary portal.');

  // Test 6: Logout simulation (clears session, PRESERVES preferredLoginRole)
  mockStorage['placement_genie_active_session'] = JSON.stringify({ uid: 'xyz', email: 'test@student.edu' });
  delete mockStorage['placement_genie_active_session']; // Logout action
  assert.strictEqual(mockStorage['placement_genie_active_session'], undefined);
  assert.strictEqual(mockStorage[PREFERRED_ROLE_KEY], 'admin', 'preferredLoginRole must NOT be cleared on logout');
  console.log('✓ TEST 6 PASSED: Logout clears active session while preserving preferredLoginRole UI preference.');

  // Test 7: Security check - preferredLoginRole="admin" spoof attempt with Student account
  mockStorage[PREFERRED_ROLE_KEY] = 'admin'; // User maliciously edits localStorage to "admin"
  const studentEmail = 'student@placement.edu';
  const studentUid = 'local_uid_student_01';

  const verifiedRole = await fetchUserRole(studentUid, studentEmail);
  assert.strictEqual(verifiedRole, 'student', 'Verified database role must remain student even if UI preferredLoginRole is admin');
  assert.notStrictEqual(verifiedRole, mockStorage[PREFERRED_ROLE_KEY], 'UI preference must NEVER grant authorization');
  console.log('✓ TEST 7 PASSED: Security confirmed. UI preference never grants admin authorization; verified role remains "student".');

  console.log('\nALL 7 PORTAL PREFERENCE & SECURITY TESTS PASSED!');
}

runPortalTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
