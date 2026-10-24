import assert from 'assert';
import {
  getAllPlacementOfficers,
  addPlacementOfficer,
  removePlacementOfficer,
  getAllPlacementDrives,
  savePlacementDrive,
  deletePlacementDrive
} from './config/firebaseAdmin.js';

async function runOfficerAndDriveTests() {
  console.log('--- STARTING PLACEMENT OFFICER & DRIVE MANAGEMENT TEST SUITE ---');

  // Test 1: Fetch initial officers
  const initialOfficers = await getAllPlacementOfficers();
  assert(initialOfficers.length >= 1, `Expected at least 1 placement officer, found ${initialOfficers.length}`);
  console.log(`✓ TEST 1 PASSED: Retrieved ${initialOfficers.length} existing Placement Officers.`);

  // Test 2: Add a new Placement Officer
  const testEmail = `officer.test_${Date.now()}@placement.edu`;
  const newOfficer = await addPlacementOfficer({
    name: 'Dr. Test Officer',
    email: testEmail,
    designation: 'Assistant Placement Officer',
    department: 'Computer Science & Engineering',
    phone: '+91 98765 43210'
  });

  assert.strictEqual(newOfficer.email, testEmail);
  assert.strictEqual(newOfficer.role, 'admin');
  assert.strictEqual(newOfficer.designation, 'Assistant Placement Officer');
  console.log('✓ TEST 2 PASSED: Successfully added new Placement Officer with admin role.');

  // Test 3: Verify new officer appears in officer list
  const updatedOfficers = await getAllPlacementOfficers();
  assert(updatedOfficers.some(o => o.email === testEmail), 'New officer must appear in officer list');
  console.log('✓ TEST 3 PASSED: Verified new Placement Officer appears in directory.');

  // Test 4: Delete the test officer
  await removePlacementOfficer(newOfficer.uid);
  const afterDeleteOfficers = await getAllPlacementOfficers();
  assert(!afterDeleteOfficers.some(o => o.email === testEmail), 'Deleted officer must no longer exist');
  console.log('✓ TEST 4 PASSED: Placement Officer removal verified.');

  // Test 5: Placement Drives retrieval
  const drives = await getAllPlacementDrives();
  assert(drives.length >= 1, `Expected at least 1 placement drive, found ${drives.length}`);
  console.log(`✓ TEST 5 PASSED: Retrieved ${drives.length} campus recruitment drives.`);

  // Test 6: Save and delete recruitment drive
  const testDriveId = `test_drive_${Date.now()}`;
  const savedDrive = await savePlacementDrive({
    id: testDriveId,
    companyName: 'TestCorp Technologies',
    jobRole: 'Software Engineer',
    packageCTC: '15 LPA',
    eligibleDepartments: ['CSE', 'ECE'],
    minCgpa: 7.5,
    minReadiness: 70
  });

  assert.strictEqual(savedDrive.companyName, 'TestCorp Technologies');
  console.log('✓ TEST 6a PASSED: Recruitment drive created successfully.');

  await deletePlacementDrive(testDriveId);
  const afterDeleteDrives = await getAllPlacementDrives();
  assert(!afterDeleteDrives.some(d => d.id === testDriveId), 'Deleted drive must no longer exist');
  console.log('✓ TEST 6b PASSED: Recruitment drive deletion verified.');

  console.log('\n======================================================');
  console.log('🎉 ALL PLACEMENT OFFICER & DRIVE TESTS PASSED SUCCESSFULLY!');
  console.log('======================================================');
}

runOfficerAndDriveTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
