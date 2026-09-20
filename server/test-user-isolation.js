import {
  getStudentProfile,
  saveStudentProfile,
  migrateLegacyStudentAccount,
  getLatestAssessmentForStudent,
  saveAssessmentToFirestore
} from './config/firebaseAdmin.js';
import assert from 'assert';

async function runTests() {
  console.log('--- STARTING USER DATA ISOLATION & UID INTEGRATION TESTS ---');

  // Test 1: User A profile creation and isolation
  const uidA = `test_user_a_${Date.now()}`;
  const profileA = {
    uid: uidA,
    studentId: uidA,
    personalInfo: {
      fullName: 'Alice Johnson',
      email: 'alice@college.edu',
      summary: 'Aspiring Cloud Architect'
    },
    placementScores: {
      technicalScore: 85,
      overallReadiness: 88
    },
    technicalSkills: {
      programmingLanguages: [{ name: 'Go', level: 'Advanced' }]
    }
  };

  await saveStudentProfile(uidA, profileA);
  const fetchedA = await getStudentProfile(uidA);
  assert.strictEqual(fetchedA.personalInfo.fullName, 'Alice Johnson');
  assert.strictEqual(fetchedA.personalInfo.email, 'alice@college.edu');
  assert.strictEqual(fetchedA.uid, uidA);
  console.log('✓ TEST 1 PASSED: User A profile created and retrieved strictly by UID.');

  // Test 2: User B profile creation - MUST NOT mix with User A or Aarav Sharma
  const uidB = `test_user_b_${Date.now()}`;
  const fetchedBInitial = await getStudentProfile(uidB);
  assert.strictEqual(fetchedBInitial, null, 'Unregistered User B must not return any profile, especially not Aarav or Alice');

  const profileB = {
    uid: uidB,
    studentId: uidB,
    personalInfo: {
      fullName: 'Bob Smith',
      email: 'bob@college.edu',
      summary: 'Data Scientist'
    },
    placementScores: {
      technicalScore: 65,
      overallReadiness: 70
    },
    technicalSkills: {
      programmingLanguages: [{ name: 'Python', level: 'Intermediate' }]
    }
  };
  await saveStudentProfile(uidB, profileB);

  const fetchedB = await getStudentProfile(uidB);
  assert.strictEqual(fetchedB.personalInfo.fullName, 'Bob Smith');
  assert.strictEqual(fetchedB.personalInfo.email, 'bob@college.edu');
  assert.notStrictEqual(fetchedB.personalInfo.fullName, fetchedA.personalInfo.fullName);
  console.log('✓ TEST 2 PASSED: User B profile is completely isolated from User A and demo user.');

  // Test 3: Assessment data isolation by UID
  const assessIdA = `assess_a_${Date.now()}`;
  await saveAssessmentToFirestore(assessIdA, {
    assessmentId: assessIdA,
    studentId: uidA,
    technicalScore: 95,
    status: 'Completed',
    completedAt: new Date().toISOString()
  });

  const assessIdB = `assess_b_${Date.now()}`;
  await saveAssessmentToFirestore(assessIdB, {
    assessmentId: assessIdB,
    studentId: uidB,
    technicalScore: 60,
    status: 'Completed',
    completedAt: new Date().toISOString()
  });

  const latestA = await getLatestAssessmentForStudent(uidA);
  assert.strictEqual(latestA.technicalScore, 95);
  assert.strictEqual(latestA.studentId, uidA);

  const latestB = await getLatestAssessmentForStudent(uidB);
  assert.strictEqual(latestB.technicalScore, 60);
  assert.strictEqual(latestB.studentId, uidB);
  console.log('✓ TEST 3 PASSED: Assessment results are strictly isolated by authenticated UID.');

  // Test 4: Legacy Sidharth S migration test
  // Legacy account crsid542@gmail.com should migrate ONLY when requested for that specific email
  const uidSidharth = `uid_sidharth_${Date.now()}`;
  const migrated = await migrateLegacyStudentAccount('crsid542@gmail.com', uidSidharth, 'Sidharth S');
  assert(migrated, 'Legacy Sidharth S migration should succeed');
  assert.strictEqual(migrated.personalInfo.email, 'crsid542@gmail.com');
  assert.strictEqual(migrated.personalInfo.fullName, 'Sidharth S');
  assert.strictEqual(migrated.uid, uidSidharth);
  assert.strictEqual(migrated.latestTechnicalScore, 40); // Preserved historical score!
  console.log('✓ TEST 4 PASSED: Legacy Sidharth S record safely migrated and tied to new authenticated UID.');

  // Test 5: Verify another user (e.g. uidB) is NEVER affected by Sidharth's migrated data
  const checkB = await getStudentProfile(uidB);
  assert.strictEqual(checkB.personalInfo.fullName, 'Bob Smith');
  assert.strictEqual(checkB.personalInfo.email, 'bob@college.edu');
  assert.strictEqual(checkB.placementScores.technicalScore, 65);
  console.log('✓ TEST 5 PASSED: Other users are completely unaffected by legacy migration.');

  console.log('ALL USER DATA ISOLATION TESTS PASSED SUCCESSFULLY! (5/5)');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
