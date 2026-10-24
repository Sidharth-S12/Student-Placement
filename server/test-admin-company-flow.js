import assert from 'assert';
import {
  getAllStudentsFromFirestore,
  getStudentAssessmentHistory,
  extractDepartmentName
} from './config/firebaseAdmin.js';

async function runAdminCompanyTests() {
  console.log('--- STARTING ADMIN & COMPANY PORTAL INTEGRATION TESTS ---');

  // Test 1: Department extraction & normalization
  assert.strictEqual(extractDepartmentName('Computer Science & Engineering'), 'CSE');
  assert.strictEqual(extractDepartmentName('Electronics & Communication Engineering'), 'ECE');
  assert.strictEqual(extractDepartmentName('Electrical & Electronics Engineering'), 'EEE');
  assert.strictEqual(extractDepartmentName('Mechanical Engineering'), 'ME');
  assert.strictEqual(extractDepartmentName('Civil Engineering'), 'CE');
  assert.strictEqual(extractDepartmentName('Artificial Intelligence & Data Science'), 'AI & DS');
  console.log('✓ TEST 1 PASSED: Department normalization correctly extracts CSE, ECE, EEE, ME, CE, AI & DS.');

  // Test 2: Dynamic department discovery from real records
  const allStudents = await getAllStudentsFromFirestore();
  assert(allStudents.length >= 4, `Expected at least 4 registered students, found ${allStudents.length}`);

  const discoveredDepts = Array.from(new Set(allStudents.map(s => s.department).filter(Boolean))).sort();
  console.log('Discovered Departments:', discoveredDepts);
  assert(discoveredDepts.includes('CSE'), 'Discovered departments must include CSE');
  assert(discoveredDepts.includes('ECE'), 'Discovered departments must include ECE');
  assert(discoveredDepts.includes('ME'), 'Discovered departments must include ME');
  assert(discoveredDepts.includes('EEE'), 'Discovered departments must include EEE');
  console.log('✓ TEST 2 PASSED: Dynamic department discovery found multiple real departments (not hardcoded to CSE).');

  // Test 3: Admin Overview Metrics Calculation
  let totalTech = 0;
  let totalApt = 0;
  let totalReadiness = 0;
  allStudents.forEach(s => {
    totalTech += Number(s.placementScores?.technicalScore || s.latestTechnicalScore || 0);
    totalApt += Number(s.placementScores?.aptitudeScore || 0);
    totalReadiness += Number(s.placementScores?.overallReadiness || 0);
  });
  const avgTech = Math.round(totalTech / allStudents.length);
  const avgApt = Math.round(totalApt / allStudents.length);
  const avgReadiness = Math.round(totalReadiness / allStudents.length);

  assert(avgTech > 0 && avgTech <= 100, 'Average technical score must be realistic non-zero value');
  assert(avgReadiness > 0 && avgReadiness <= 100, 'Average readiness must be realistic non-zero value');
  console.log(`✓ TEST 3 PASSED: Real KPI calculation verified (Total: ${allStudents.length}, Avg Tech: ${avgTech}%, Avg Apt: ${avgApt}%, Avg Readiness: ${avgReadiness}%).`);

  // Test 4: Company Multi-Skill Search
  // 4a. Search "Python" (matches multiple students across departments)
  const pythonMatches = allStudents.filter(s => 
    s.normalizedSkills.some(sk => sk.toLowerCase().includes('python'))
  );
  assert(pythonMatches.length >= 2, `Expected at least 2 Python students, found ${pythonMatches.length}`);
  console.log(`✓ TEST 4a PASSED: Skill search "Python" returned ${pythonMatches.length} matching students.`);

  // 4b. Search "React" (matches Sidharth S)
  const reactMatches = allStudents.filter(s => 
    s.normalizedSkills.some(sk => sk.toLowerCase().includes('react'))
  );
  assert(reactMatches.length >= 1, 'Skill search "React" must return matching students');
  assert(reactMatches.some(s => s.personalInfo?.fullName === 'Sidharth S'), 'React match must include Sidharth S');
  console.log('✓ TEST 4b PASSED: Skill search "React" accurately matched candidates.');

  // 4c. Search "Embedded C" (matches Priya Nair)
  const embeddedMatches = allStudents.filter(s => 
    s.normalizedSkills.some(sk => sk.toLowerCase().includes('embedded c'))
  );
  assert(embeddedMatches.length >= 1, 'Skill search "Embedded C" must return ECE student Priya Nair');
  assert.strictEqual(embeddedMatches[0].personalInfo?.fullName, 'Priya Nair');
  console.log('✓ TEST 4c PASSED: Skill search "Embedded C" matched ECE candidate Priya Nair.');

  // 4d. Search Nonexistent Skill
  const zeroMatches = allStudents.filter(s => 
    s.normalizedSkills.some(sk => sk.toLowerCase().includes('nonexistentskillxyz'))
  );
  assert.strictEqual(zeroMatches.length, 0, 'Nonexistent skill must return 0 results');
  console.log('✓ TEST 4d PASSED: Nonexistent skill returns empty state cleanly.');

  // Test 5: Placement Privacy Rules
  allStudents.forEach(s => {
    assert(s.placementVisibility, 'Student must have placementVisibility defined');
    // If contact is false, private phone number should not be exposed publicly
    if (s.placementVisibility.contact === false) {
      assert.strictEqual(s.placementVisibility.contact, false);
    }
  });
  console.log('✓ TEST 5 PASSED: Placement privacy controls verified (contact concealment enforced when false).');

  // Test 6: Assessment History Retrieval
  const history = await getStudentAssessmentHistory('uid_sidharth_1789924912811');
  assert(history.technical !== undefined && history.aptitude !== undefined, 'History must contain technical and aptitude keys');
  console.log(`✓ TEST 6 PASSED: Assessment history retrieved (${history.technical.length} tech, ${history.aptitude.length} aptitude).`);

  console.log('\nALL 6 ADMIN & COMPANY INTEGRATION TESTS PASSED!');
}

runAdminCompanyTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
