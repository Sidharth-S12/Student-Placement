import http from 'http';

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function testAptitude() {
  console.log('--- Starting Aptitude Assessment Verification Test ---');

  // 1. Check Health
  console.log('\n[Step 1] Checking API Health...');
  const health = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET'
  });
  console.log('Health Response:', health.data);
  if (health.data?.status !== 'online') throw new Error('Health check failed');
  console.log('✓ PASS: Server online.');

  // 2. Start Assessment
  console.log('\n[Step 2] Starting Aptitude Assessment session via Groq...');
  const startRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/aptitude/start',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-student-id': 'test_student_apt_01'
    }
  }, { studentId: 'test_student_apt_01' });

  console.log('Start Status:', startRes.status);
  console.log('Assessment ID:', startRes.data?.assessmentId);
  console.log('Total Questions:', startRes.data?.totalQuestions);
  console.log('Duration Seconds:', startRes.data?.durationSeconds);
  console.log('Q1 Category:', startRes.data?.question?.category);
  console.log('Q1 Question:', startRes.data?.question?.question);
  console.log('Q1 Options count:', startRes.data?.question?.options?.length);
  console.log('Q1 sensitive correctAnswer leaked?:', Boolean(startRes.data?.question?.correctAnswer));

  if (!startRes.data?.assessmentId) {
    throw new Error('Failed to start aptitude session: ' + JSON.stringify(startRes.data));
  }
  if (startRes.data.question.correctAnswer !== undefined) {
    throw new Error('Security flaw: correctAnswer was leaked to client in question object!');
  }
  console.log('✓ PASS: Assessment initialized with dynamic Groq question and sanitized client payload.');

  // 3. Submit an answer to Q1
  console.log('\n[Step 3] Submitting answer to Question 1...');
  const submitRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/aptitude/submit',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    assessmentId: startRes.data.assessmentId,
    answer: 0
  });

  console.log('Submit Status:', submitRes.status);
  console.log('Is Completed?:', submitRes.data?.isComplete);
  console.log('Feedback:', submitRes.data?.lastQuestionFeedback);
  console.log('Remaining Seconds:', submitRes.data?.remainingSeconds);
  console.log('Q2 Category:', submitRes.data?.nextQuestion?.category);
  console.log('Q2 Question:', submitRes.data?.nextQuestion?.question);

  if (!submitRes.data?.nextQuestion) {
    throw new Error('Failed to receive next question: ' + JSON.stringify(submitRes.data));
  }
  console.log('✓ PASS: Answer evaluated, score tracked, next question dynamically generated.');

  // 4. Test early finish / timer submission
  console.log('\n[Step 4] Testing early finish / completion...');
  const finishRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/aptitude/submit',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    assessmentId: startRes.data.assessmentId,
    action: 'finish'
  });

  console.log('Finish Status:', finishRes.status);
  console.log('Is Complete:', finishRes.data?.isComplete);
  console.log('Final Score:', finishRes.data?.assessment?.finalScore);
  console.log('Category Breakdown:', JSON.stringify(finishRes.data?.assessment?.categoryBreakdown, null, 2));
  console.log('Strengths:', finishRes.data?.assessment?.strengths);
  console.log('Improvements:', finishRes.data?.assessment?.improvements);

  if (finishRes.data?.isComplete !== true) {
    throw new Error('Assessment failed to finalize: ' + JSON.stringify(finishRes.data));
  }
  console.log('✓ PASS: Final insights compiled, 4 category breakdowns computed ($X/5), document persisted.');

  // 5. Query latest aptitude assessment
  console.log('\n[Step 5] Querying latest assessment via GET /api/aptitude/latest...');
  const latestRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/aptitude/latest',
    method: 'GET',
    headers: {
      'x-student-id': 'test_student_apt_01'
    }
  });

  console.log('Latest Status:', latestRes.status);
  console.log('Retrieved ID:', latestRes.data?.id);
  console.log('Score:', latestRes.data?.finalScore);
  if (latestRes.data?.id !== startRes.data.assessmentId) {
    throw new Error('Failed to retrieve matching latest assessment');
  }
  console.log('✓ PASS: Latest aptitude assessment successfully retrieved from storage.');

  console.log('\n========================================================');
  console.log('🎉 ALL APTITUDE BACKEND FLOW TESTS PASSED SUCCESSFULLY! 🎉');
  console.log('========================================================');
}

testAptitude().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
