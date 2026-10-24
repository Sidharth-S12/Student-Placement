"""
K-Means Clustering Machine Learning Engine in Python
Performs unsupervised multi-dimensional clustering on student assessment profiles:
[Technical Score, Aptitude Score, Communication Score, Overall Readiness]

Divides students into exactly 8 groups based on assessment strengths & development needs:
1. Technical strong
2. Communication strong
3. Aptitude strong
4. Technical and Aptitude strong
5. Technical and Communication strong
6. Communication and Aptitude strong
7. Technical, Aptitude and Communication strong
8. Weak in technical aptitude and communication
"""

import sys
import json
import math
import time

COHORT_SPECS = [
    {
        "id": "tech_strong",
        "name": "Technical strong",
        "tagline": "High Technical Proficiency • Soft Skills & Aptitude Polish Needed",
        "color": "blue",
        "dotClass": "bg-blue-400",
        "badgeClass": "bg-blue-500/20 text-blue-300 border-blue-500/40",
        "initialCentroid": [85.0, 45.0, 45.0, 58.0],
        "explanation": "Demonstrates standout coding accuracy and algorithm implementation; measured aptitude or communication scores indicate structured polish is needed.",
        "recommendedAction": "Enroll in daily timed aptitude sprints and behavioral STAR-method interview practice.",
        "targetPersona": "Exceptional programmers whose technical acumen outpaces their communication and speed math."
    },
    {
        "id": "comm_strong",
        "name": "Communication strong",
        "tagline": "High Articulation & Soft Skills • Technical Acceleration Needed",
        "color": "teal",
        "dotClass": "bg-teal-400",
        "badgeClass": "bg-teal-500/20 text-teal-300 border-teal-500/40",
        "initialCentroid": [45.0, 45.0, 85.0, 58.0],
        "explanation": "Excels in verbal articulation, interview demeanor, and interpersonal leadership; technical code assessments trail presentation skills.",
        "recommendedAction": "Intensive programming bootcamps focusing on core syntax, data structures, and algorithmic logic.",
        "targetPersona": "Articulate communicators and potential client-facing leads requiring technical upskilling."
    },
    {
        "id": "apt_strong",
        "name": "Aptitude strong",
        "tagline": "High Quantitative Acumen • Hands-On Coding Practice Needed",
        "color": "purple",
        "dotClass": "bg-purple-400",
        "badgeClass": "bg-purple-500/20 text-purple-300 border-purple-500/40",
        "initialCentroid": [45.0, 85.0, 45.0, 58.0],
        "explanation": "Sharp quantitative problem solving, mental math, and logical reasoning; hands-on coding and verbal interview articulation need development.",
        "recommendedAction": "Assign weekly DSA coding sprints, live paired debugging sessions, and GitHub portfolio builds.",
        "targetPersona": "Strong analytical and mathematical minds who need practical programming reinforcement."
    },
    {
        "id": "tech_apt_strong",
        "name": "Technical and Aptitude strong",
        "tagline": "Strong Code & Analytical Acumen • Verbal Articulation Needed",
        "color": "indigo",
        "dotClass": "bg-indigo-400",
        "badgeClass": "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
        "initialCentroid": [85.0, 85.0, 45.0, 72.0],
        "explanation": "Dual standout across technical coding and analytical reasoning tests; verbal communication and behavioral interviews need polish.",
        "recommendedAction": "1-on-1 mock behavioral interviews, group discussion clinics, and executive presentation training.",
        "targetPersona": "High-powered analytical problem solvers and software engineers ready for elite coding rounds."
    },
    {
        "id": "tech_comm_strong",
        "name": "Technical and Communication strong",
        "tagline": "Strong Engineering & Articulation • Aptitude Practice Needed",
        "color": "sky",
        "dotClass": "bg-sky-400",
        "badgeClass": "bg-sky-500/20 text-sky-300 border-sky-500/40",
        "initialCentroid": [85.0, 45.0, 85.0, 72.0],
        "explanation": "High technical coding skill combined with articulate verbal presentation; timed quantitative aptitude tests indicate targeted revision needed.",
        "recommendedAction": "Timed speed aptitude practice series and mental shortcut arithmetic modules.",
        "targetPersona": "Technocrats and potential product engineers with great articulation who need quantitative test prep."
    },
    {
        "id": "comm_apt_strong",
        "name": "Communication and Aptitude strong",
        "tagline": "Strong Logic & Articulation • Hands-On Engineering Polish Needed",
        "color": "amber",
        "dotClass": "bg-amber-400",
        "badgeClass": "bg-amber-500/20 text-amber-300 border-amber-500/40",
        "initialCentroid": [45.0, 85.0, 85.0, 72.0],
        "explanation": "Strong analytical problem solving paired with polished communication; hands-on coding and software development require guidance.",
        "recommendedAction": "Core language syntax bootcamps, project implementation sprints, and technical assessment drills.",
        "targetPersona": "Analytical communicators ideal for techno-functional consulting and product management roles."
    },
    {
        "id": "all_strong",
        "name": "Technical, Aptitude and Communication strong",
        "tagline": "All-Round Elite Day-1 Ready • High Achievers Across All Pillars",
        "color": "emerald",
        "dotClass": "bg-emerald-400",
        "badgeClass": "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        "initialCentroid": [85.0, 85.0, 85.0, 85.0],
        "explanation": "Stellar measured proficiency across coding tests, quantitative aptitude, and AI-evaluated interview articulation.",
        "recommendedAction": "Fast-track for Tier-1 dream company drives, executive mock interviews, and peer mentor roles.",
        "targetPersona": "Comprehensive top-tier placement candidates who clear all rounds with high percentiles."
    },
    {
        "id": "weak_all",
        "name": "Weak in technical aptitude and communication",
        "tagline": "Foundational Remedial Focus Needed Across All Three Pillars",
        "color": "rose",
        "dotClass": "bg-rose-500",
        "badgeClass": "bg-rose-500/20 text-rose-300 border-rose-500/40",
        "initialCentroid": [30.0, 30.0, 30.0, 30.0],
        "explanation": "Measured scores show foundational gaps across programming tests, quantitative reasoning, and verbal communication, needing intensive remedial support.",
        "recommendedAction": "Enroll in structured coding basics bootcamps, daily math reasoning sessions, and confidence-building speech clinics.",
        "targetPersona": "Students requiring comprehensive baseline upskilling and milestone tracking before active placement recruitment."
    }
]

def euclidean_distance(v1, v2):
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(v1, v2)))

def extract_vector(student):
    scores = student.get("placementScores") or {}
    
    raw_tech = scores.get("technicalScore")
    if raw_tech is None:
        raw_tech = student.get("latestTechnicalScore")
    
    raw_apt = scores.get("aptitudeScore")
    if raw_apt is None:
        apt_obj = student.get("latestAptitudeAssessment")
        if isinstance(apt_obj, dict):
            raw_apt = apt_obj.get("score")
            
    raw_comm = scores.get("communicationScore")
    if raw_comm is None:
        comm_obj = student.get("latestCommunicationAssessment")
        if isinstance(comm_obj, dict):
            raw_comm = comm_obj.get("score")
            
    raw_readiness = scores.get("overallReadiness")
    
    has_data = (raw_tech is not None) or (raw_apt is not None) or (raw_comm is not None)
    
    tech = float(raw_tech) if raw_tech is not None else (45.0 if has_data else 50.0)
    apt = float(raw_apt) if raw_apt is not None else (45.0 if has_data else 50.0)
    comm = float(raw_comm) if raw_comm is not None else (45.0 if has_data else 50.0)
    
    tech = max(0.0, min(100.0, tech))
    apt = max(0.0, min(100.0, apt))
    comm = max(0.0, min(100.0, comm))
    
    if raw_readiness is not None:
        readiness = max(0.0, min(100.0, float(raw_readiness)))
    else:
        readiness = round((tech + apt + comm) / 3.0, 1)
        
    return [tech, apt, comm, readiness]

def run_kmeans(students, max_iterations=50):
    k = len(COHORT_SPECS) # 7 clusters
    
    if not students:
        return {
            "clusters": [
                {
                    **spec,
                    "clusterIndex": idx,
                    "students": [],
                    "count": 0,
                    "percentage": 0,
                    "centroid": {
                        "technical": spec["initialCentroid"][0],
                        "aptitude": spec["initialCentroid"][1],
                        "communication": spec["initialCentroid"][2],
                        "readiness": spec["initialCentroid"][3]
                    },
                    "avgScores": {
                        "technical": int(spec["initialCentroid"][0]),
                        "aptitude": int(spec["initialCentroid"][1]),
                        "communication": int(spec["initialCentroid"][2]),
                        "readiness": int(spec["initialCentroid"][3])
                    }
                }
                for idx, spec in enumerate(COHORT_SPECS)
            ],
            "totalStudents": 0,
            "inertia": 0,
            "iterationsRun": 0,
            "engine": "python_kmeans_ml",
            "engineLabel": "Python 3 Machine Learning Engine (K=8)",
            "calculatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "k": k
        }

    vectors = [extract_vector(s) for s in students]
    centroids = [list(spec["initialCentroid"]) for spec in COHORT_SPECS]
    assignments = [0] * len(students)
    iterations_run = 0

    for it in range(max_iterations):
        iterations_run = it + 1
        changed = False

        # Assignment Step (Distance on [Tech, Apt, Comm, Readiness])
        for i, vec in enumerate(vectors):
            best_dist = float("inf")
            best_c = 0
            for c in range(k):
                d = euclidean_distance(vec, centroids[c])
                if d < best_dist:
                    best_dist = d
                    best_c = c

            if assignments[i] != best_c:
                assignments[i] = best_c
                changed = True

        if not changed and it > 0:
            break

        # Centroid Update Step
        new_centroids = [[0.0, 0.0, 0.0, 0.0] for _ in range(k)]
        counts = [0] * k

        for i, vec in enumerate(vectors):
            c = assignments[i]
            counts[c] += 1
            for d in range(4):
                new_centroids[c][d] += vec[d]

        for c in range(k):
            if counts[c] > 0:
                for d in range(4):
                    new_centroids[c][d] = round(new_centroids[c][d] / counts[c], 1)
            else:
                new_centroids[c] = centroids[c]

        centroids = new_centroids

    # Compute Inertia (Sum of squared Euclidean distances)
    total_inertia = 0.0
    for i, vec in enumerate(vectors):
        c = assignments[i]
        d = euclidean_distance(vec, centroids[c])
        total_inertia += d * d

    # Build cluster response objects
    clusters_output = []
    total_count = len(students)

    for c_idx, spec in enumerate(COHORT_SPECS):
        c_students = [students[i] for i, a in enumerate(assignments) if a == c_idx]
        count = len(c_students)
        percentage = round((count / total_count * 100)) if total_count > 0 else 0

        sum_tech = sum(extract_vector(s)[0] for s in c_students) if count > 0 else 0
        sum_apt = sum(extract_vector(s)[1] for s in c_students) if count > 0 else 0
        sum_comm = sum(extract_vector(s)[2] for s in c_students) if count > 0 else 0
        sum_readiness = sum(extract_vector(s)[3] for s in c_students) if count > 0 else 0

        avg_scores = {
            "technical": round(sum_tech / count) if count > 0 else int(centroids[c_idx][0]),
            "aptitude": round(sum_apt / count) if count > 0 else int(centroids[c_idx][1]),
            "communication": round(sum_comm / count) if count > 0 else int(centroids[c_idx][2]),
            "readiness": round(sum_readiness / count) if count > 0 else int(centroids[c_idx][3])
        }

        clusters_output.append({
            "id": spec["id"],
            "name": spec["name"],
            "tagline": spec["tagline"],
            "color": spec["color"],
            "dotClass": spec["dotClass"],
            "badgeClass": spec["badgeClass"],
            "explanation": spec["explanation"],
            "recommendedAction": spec["recommendedAction"],
            "targetPersona": spec["targetPersona"],
            "clusterIndex": c_idx,
            "students": c_students,
            "count": count,
            "percentage": percentage,
            "centroid": {
                "technical": centroids[c_idx][0],
                "aptitude": centroids[c_idx][1],
                "communication": centroids[c_idx][2],
                "readiness": centroids[c_idx][3]
            },
            "avgScores": avg_scores
        })

    return {
        "clusters": clusters_output,
        "totalStudents": total_count,
        "inertia": round(total_inertia, 1),
        "iterationsRun": iterations_run,
        "engine": "python_kmeans_ml",
        "engineLabel": "Python 3 Machine Learning Engine (K=8)",
        "calculatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "k": k,
        "isLimitedDataset": False,
        "datasetExplanation": None,
        "disclaimer": "Students are partitioned by Python K-Means into 8 strength & development clusters across Technical, Aptitude, and Communication assessments."
    }

def main():
    try:
        input_data = sys.stdin.read().strip()
        if input_data:
            payload = json.loads(input_data)
            students = payload.get("students", payload) if isinstance(payload, dict) else payload
        else:
            students = []
            
        result = run_kmeans(students)
        print(json.dumps(result))
    except Exception as e:
        sys.stderr.write(f"Error in python kmeans: {str(e)}\n")
        print(json.dumps({"error": str(e), "clusters": []}))
        sys.exit(1)

if __name__ == "__main__":
    main()
