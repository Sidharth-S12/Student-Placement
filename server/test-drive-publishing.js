import assert from 'assert';

async function runDrivePublishingTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING CAMPUS RECRUITMENT DRIVE PUBLISHING TEST SUITE');
  console.log('================================================================\n');

  const BASE_URL = 'http://localhost:5000';

  // 1. Health check to ensure server is listening
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  assert.strictEqual(healthRes.status, 200, 'Backend API health check must return 200');
  const healthData = await healthRes.json();
  assert.strictEqual(healthData.status, 'online');
  console.log('✓ TEST 1 PASSED: Backend server is online and healthy on port 5000.');

  // 2. Test successful drive creation with user example fields
  const examplePayload = {
    companyName: 'dt',
    jobRole: 'sde',
    packageCTC: '12 LPA',
    driveDate: '03-11-2026',
    minCgpa: 7.0,
    minReadiness: 65,
    eligibleDepartments: ['CSE', 'ECE', 'AI & DS', 'EEE', 'ME', 'CE', 'All'],
    status: 'Upcoming',
    location: 'Campus / Virtual',
    jobDescription: 'aa'
  };

  const createRes = await fetch(`${BASE_URL}/api/admin/drives`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-student-id': 'local_admin_placement_edu'
    },
    body: JSON.stringify(examplePayload)
  });

  assert.strictEqual(createRes.status, 200, 'POST /api/admin/drives must return HTTP 200 OK');
  const contentType = createRes.headers.get('content-type') || '';
  assert.ok(contentType.includes('application/json'), 'Response Content-Type must be application/json');

  const createBody = await createRes.json();
  assert.strictEqual(createBody.success, true, 'Response body must contain success: true');
  assert.ok(createBody.drive, 'Response must return created drive object');
  assert.strictEqual(createBody.drive.companyName, 'dt');
  assert.strictEqual(createBody.drive.jobRole, 'sde');
  assert.strictEqual(createBody.drive.packageCTC, '12 LPA');
  assert.strictEqual(createBody.drive.driveDate, '2026-11-03', 'DD-MM-YYYY date format must be normalized to YYYY-MM-DD');
  assert.strictEqual(createBody.drive.minCgpa, 7);
  assert.strictEqual(createBody.drive.minReadiness, 65);
  assert.deepStrictEqual(createBody.drive.eligibleDepartments, ['All'], 'Department selection including "All" must be normalized to ["All"]');
  assert.strictEqual(createBody.drive.status, 'Upcoming');
  assert.strictEqual(createBody.drive.location, 'Campus / Virtual');
  assert.strictEqual(createBody.drive.jobDescription, 'aa');
  assert.ok(createBody.drive.id, 'Drive must have a generated ID');

  const createdId = createBody.drive.id;
  console.log(`✓ TEST 2 PASSED: Successfully published drive "${createBody.drive.companyName} - ${createBody.drive.jobRole}" (ID: ${createdId}).`);

  // 3. Verify created drive appears in GET /api/admin/drives
  const listRes = await fetch(`${BASE_URL}/api/admin/drives`, {
    headers: {
      'x-student-id': 'local_admin_placement_edu'
    }
  });
  assert.strictEqual(listRes.status, 200);
  const listBody = await listRes.json();
  assert.ok(Array.isArray(listBody.drives), 'drives must be an array');
  const foundDrive = listBody.drives.find(d => d.id === createdId);
  assert.ok(foundDrive, 'Created drive must appear in the drives listing');
  assert.strictEqual(foundDrive.companyName, 'dt');
  console.log('✓ TEST 3 PASSED: Created drive is persisted and retrievable via GET /api/admin/drives.');

  // 4. Test validation errors: Missing company name
  const missingCompanyRes = await fetch(`${BASE_URL}/api/admin/drives`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobRole: 'sde' })
  });
  assert.strictEqual(missingCompanyRes.status, 400);
  const missingCompanyJson = await missingCompanyRes.json();
  assert.strictEqual(missingCompanyJson.error, 'Company name is required.');
  console.log('✓ TEST 4 PASSED: Missing company name returns 400 Bad Request with proper JSON error.');

  // 5. Test validation errors: Missing job role
  const missingRoleRes = await fetch(`${BASE_URL}/api/admin/drives`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyName: 'dt' })
  });
  assert.strictEqual(missingRoleRes.status, 400);
  const missingRoleJson = await missingRoleRes.json();
  assert.strictEqual(missingRoleJson.error, 'Job role / designation is required.');
  console.log('✓ TEST 5 PASSED: Missing job role returns 400 Bad Request with proper JSON error.');

  console.log('\n================================================================');
  console.log('🎉 ALL CAMPUS DRIVE PUBLISHING TESTS PASSED SUCCESSFULLY!');
  console.log('================================================================\n');
}

runDrivePublishingTests().catch(err => {
  console.error('\n❌ Drive publishing test suite failed:', err);
  process.exit(1);
});
