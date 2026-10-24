/**
 * Placement Readiness Calculation Service
 *
 * Computes the overall Placement Readiness Score combining:
 * 1. Technical Score
 * 2. Aptitude Score (Placeholder / Future Phase)
 * 3. Communication Score (Placeholder / Future Phase)
 */

export function calculateReadinessScore({
  technicalScore = 0,
  aptitudeScore = 0,
  communicationScore = 0,
  weights = { technical: 0.40, aptitude: 0.40, communication: 0.20 }
}) {
  const normTech = Math.max(0, Math.min(100, Number(technicalScore) || 0));
  const normApt = Math.max(0, Math.min(100, Number(aptitudeScore) || 0));
  const normComm = Math.max(0, Math.min(100, Number(communicationScore) || 0));

  // If communication assessment is not yet conducted, weight active tests equally
  if (!normComm) {
    if (normTech > 0 && normApt > 0) {
      return Math.round((normTech * 0.5) + (normApt * 0.5));
    }
    if (normTech > 0) return Math.round(normTech);
    if (normApt > 0) return Math.round(normApt);
    return 0;
  }

  const weightedScore = (normTech * weights.technical) +
                        (normApt * weights.aptitude) +
                        (normComm * weights.communication);

  return Math.round(weightedScore);
}
