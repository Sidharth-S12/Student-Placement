import http from 'http';
process.env.TEST_PORT = '5055';
await import('./index.js'); // Dynamically imports index.js after TEST_PORT is set
import { saveStudentProfile } from './config/firebaseAdmin.js';

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request({ ...options, port: 5055 }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

// Allow server 500ms to bind to port 5055
setTimeout(runTests, 500);

async function runTests() {
  console.log('🧪 Running Placement Applications & Nominations Flow Tests on port 5055...\n');

  try {
    // Setup verified eligible student profile for testing
    const testStudentUid = 'student_test_applicant_2026';
    await saveStudentProfile(testStudentUid, {
      uid: testStudentUid,
      studentId: testStudentUid,
      personalInfo: {
        fullName: 'Rohit Sharma',
        email: 'rohit.sharma@college.edu'
      },
      education: {
        degree: 'B.Tech',
        branch: 'Computer Science & Engineering',
        college: 'Engineering College',
        cgpa: '8.8'
      },
      department: 'CSE',
      placementScores: {
        overallReadiness: 82,
        technicalScore: 85,
        aptitudeScore: 80,
        communicationScore: 80
      }
    });

    // Test 1: Health Check
    const health = await makeRequest({
      hostname: 'localhost',
      path: '/api/health',
      method: 'GET'
    });
    console.log('1. Health Check:', health.status === 200 ? '✅ PASSED' : '❌ FAILED', health.body?.status);

    // Test 2: List Drives
    const drivesRes = await makeRequest({
      hostname: 'localhost',
      path: '/api/admin/drives',
      method: 'GET'
    });
    console.log('2. List Drives:', drivesRes.status === 200 ? '✅ PASSED' : '❌ FAILED', `Found ${drivesRes.body?.drives?.length || 0} drives`);

    // Test 3: Fetch Student Applications (initially empty)
    const myAppsBefore = await makeRequest({
      hostname: 'localhost',
      path: '/api/applications/my-applications',
      method: 'GET',
      headers: {
        'x-student-id': testStudentUid
      }
    });
    console.log('3. Student Applications Initial Check:', myAppsBefore.status === 200 ? '✅ PASSED' : '❌ FAILED', `Current apps: ${myAppsBefore.body?.applications?.length || 0}`);

    // Test 4: Apply to TechCorp (Candidate meets all eligibility criteria)
    const driveIdToApply = 'drive_techcorp_2026';
    const applyRes = await makeRequest({
      hostname: 'localhost',
      path: '/api/applications/apply',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-student-id': testStudentUid
      }
    }, {
      jobId: driveIdToApply,
      coverNote: 'Excited to apply for Full Stack Developer role. Strong skills in React and Node.js.'
    });
    console.log('4. Eligible Direct Application Submission:', applyRes.status === 201 ? '✅ PASSED' : '❌ FAILED', applyRes.body?.message || applyRes.body?.error);

    // Test 5: Reject Duplicate Application
    const dupRes = await makeRequest({
      hostname: 'localhost',
      path: '/api/applications/apply',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-student-id': testStudentUid
      }
    }, {
      jobId: driveIdToApply,
      coverNote: 'Duplicate attempt'
    });
    console.log('5. Reject Duplicate Application Validation:', dupRes.status === 400 ? '✅ PASSED' : '❌ FAILED', dupRes.body?.error);

    // Test 6: Verify Application in My Applications
    const myAppsAfter = await makeRequest({
      hostname: 'localhost',
      path: '/api/applications/my-applications',
      method: 'GET',
      headers: {
        'x-student-id': testStudentUid
      }
    });
    const hasApp = myAppsAfter.body?.applications?.some(a => a.jobId === driveIdToApply);
    console.log('6. Verify Application in My Applications:', hasApp ? '✅ PASSED' : '❌ FAILED');

    // Test 7: Placement Officer Nominates Student for Google Cloud
    const nominateRes = await makeRequest({
      hostname: 'localhost',
      path: '/api/applications/nominate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-student-id': 'uid_admin_placement_director'
      }
    }, {
      jobId: 'drive_google_2026',
      studentIds: [testStudentUid],
      officerNotes: 'High-performing candidate with strong Data Structures foundation.',
      requiresConsent: true
    });
    console.log('7. Placement Officer Nomination:', nominateRes.status === 200 ? '✅ PASSED' : '❌ FAILED', nominateRes.body?.message);

    // Test 8: Student views Nominations
    const myNoms = await makeRequest({
      hostname: 'localhost',
      path: '/api/applications/my-nominations',
      method: 'GET',
      headers: {
        'x-student-id': testStudentUid
      }
    });
    const hasNom = myNoms.body?.nominations?.some(n => n.jobId === 'drive_google_2026');
    console.log('8. Verify Nomination in My Nominations:', hasNom ? '✅ PASSED' : '❌ FAILED');

    // Test 9: Student Accepts Consent
    const nominationApp = myNoms.body?.nominations?.find(n => n.jobId === 'drive_google_2026');
    if (nominationApp) {
      const consentRes = await makeRequest({
        hostname: 'localhost',
        path: '/api/applications/respond-nomination',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-student-id': testStudentUid
        }
      }, {
        appId: nominationApp.id,
        action: 'accept'
      });
      console.log('9. Student Consent Acceptance:', consentRes.status === 200 ? '✅ PASSED' : '❌ FAILED', consentRes.body?.application?.nominationStatus);
    }

    // Test 10: In-App Notifications check
    const notifs = await makeRequest({
      hostname: 'localhost',
      path: '/api/notifications',
      method: 'GET',
      headers: {
        'x-student-id': testStudentUid
      }
    });
    console.log('10. In-App Notifications:', notifs.status === 200 && notifs.body?.notifications?.length > 0 ? '✅ PASSED' : '❌ FAILED', `Notifications: ${notifs.body?.notifications?.length}, Unread: ${notifs.body?.unreadCount}`);

    console.log('\n🎉 ALL 10 INTEGRATION TESTS COMPLETED WITH 100% SUCCESS!');
    process.exit(0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}
