import { useState } from 'react';
import './GradingDetail.css';

// ── Full mock evaluation data keyed by submission ID ───────────────────────
const EVAL_DATA = {
  88201: {
    questionTitle: 'Theory of Computation - Midterm Exam',
    question:      'Question 3: Complexity Classes',
    maxPoints:     20,
    prompt:        'Explain the fundamental difference between P and NP complexity classes. Provide an example of a problem for each class and discuss why the P vs NP problem is considered significant in computer science.',
    studentAnswer: 'The class P consists of decision problems that can be solved by a deterministic Turing machine in polynomial time. Essentially, these are problems that computers can solve "efficiently" or "quickly" relative to the input size.\n\nIn contrast, NP (Nondeterministic Polynomial time) includes problems where a solution can be verified in polynomial time, even if finding the solution might take exponential time. An example of a P problem is sorting a list of numbers. An example of an NP problem is the Traveling Salesperson Problem (TSP) or Boolean Satisfiability (SAT).\n\nThe P vs NP problem asks whether every problem whose solution can be quickly verified can also be solved quickly. It is significant because if P = NP, it would revolutionize fields like cryptography, optimization, and AI, essentially making many currently "hard" problems tractable.',
    wordCount:     245,
    sbertScore:    0.89,
    rubricAdherence: 92,
    aiConfidence:  'High',
    plagiarismCheck: 'Pass',
    totalScore:    18,
    group:         'Section B',
    attempts:      '1 of 1',
    rubricCriteria: [
      { name: 'Definition of P & NP', maxScore: 5, score: 5, matchPct: 98, desc: 'Correctly defines both classes with reference to Turing machines.', suggestion: null },
      { name: 'Examples provided',    maxScore: 5, score: 4, matchPct: 85, desc: 'Sorting (P) and TSP/SAT (NP) are valid examples.',           suggestion: 'The distinction for TSP being NP-Hard vs NP-Complete was not explicitly made, though generally acceptable for this level.' },
      { name: 'Significance of P vs NP', maxScore: 10, score: 9, matchPct: 95, desc: 'Excellent discussion of cryptography and tractability implications.', suggestion: null },
    ],
  },
  88202: {
    questionTitle: 'Theory of Computation - Midterm Exam',
    question:      'Question 2: Turing Machines',
    maxPoints:     20,
    prompt:        'Describe the components of a Turing machine and explain how it differs from a finite automaton. Include a brief example of a problem that requires a Turing machine but cannot be decided by a finite automaton.',
    studentAnswer: 'A Turing machine consists of an infinite tape divided into cells, a tape head that can read and write symbols, a finite set of states, and a transition function. Unlike finite automata, a Turing machine can write to the tape and move the head in both directions, giving it greater computational power.\n\nA finite automaton can only accept or reject a string based on a finite memory of states. It cannot count unboundedly. For example, the language {a^n b^n | n >= 1} cannot be decided by a finite automaton but a Turing machine can decide it using the tape to count matching a\'s and b\'s.',
    wordCount:     112,
    sbertScore:    0.71,
    rubricAdherence: 78,
    aiConfidence:  'Medium',
    plagiarismCheck: 'Pass',
    totalScore:    14,
    group:         'Section A',
    attempts:      '1 of 1',
    rubricCriteria: [
      { name: 'Components of TM',       maxScore: 6,  score: 5, matchPct: 82, desc: 'Most components correctly identified; transition function description is brief.', suggestion: 'Could elaborate on the halt state and accept/reject conditions.' },
      { name: 'Comparison to FA',        maxScore: 8,  score: 6, matchPct: 70, desc: 'Key differences noted but could be more detailed.',                              suggestion: 'Two-way tape movement not explicitly mentioned as a differentiating feature.' },
      { name: 'Example problem',         maxScore: 6,  score: 3, matchPct: 60, desc: 'Correct example but explanation is superficial.',                               suggestion: 'A full trace or step-by-step execution of the TM would significantly strengthen this answer.' },
    ],
  },
};

// Fallback data for submissions not in EVAL_DATA
const DEFAULT_EVAL = {
  questionTitle:   'Assessment Evaluation',
  question:        'Question',
  maxPoints:       20,
  prompt:          'Question prompt not available for this submission.',
  studentAnswer:   'Student answer not available.',
  wordCount:       0,
  sbertScore:      0.80,
  rubricAdherence: 80,
  aiConfidence:    'Medium',
  plagiarismCheck: 'Pass',
  totalScore:      16,
  group:           'N/A',
  attempts:        '1 of 1',
  rubricCriteria:  [],
};

// ── Helpers ────────────────────────────────────────────────────────────────
function gradeLabel(pct) {
  if (pct >= 90) return 'Excellent';
  if (pct >= 75) return 'Good';
  if (pct >= 60) return 'Satisfactory';
  return 'Needs Improvement';
}

function scoreFill(score) {
  if (score >= 0.85) return '#10b981';
  if (score >= 0.65) return '#f59e0b';
  return '#ef4444';
}

// ── Component ──────────────────────────────────────────────────────────────
function GradingDetail({ submission, onNavigate }) {
  const [overrideMode, setOverrideMode] = useState(false);

  if (!submission) {
    return (
      <div className="gd-page">
        <div className="gd-empty">No submission selected. <button onClick={() => onNavigate('grading')}>Return to queue</button></div>
      </div>
    );
  }

  const eval_  = EVAL_DATA[submission.id] ?? { ...DEFAULT_EVAL, questionTitle: submission.assessment };
  const pct    = Math.round((eval_.totalScore / eval_.maxPoints) * 100);

  return (
    <div className="gd-page">

      {/* Topbar with breadcrumb and actions */}
      <div className="gd-topbar">
        <nav className="gd-breadcrumb">
          <button className="gd-crumb-link" onClick={() => onNavigate('grading')}>
            Grading Queue
          </button>
          <span className="gd-crumb-sep">/</span>
          <span className="gd-crumb-link">{submission.assessment}</span>
          <span className="gd-crumb-sep">/</span>
          <span className="gd-crumb-current">Evaluation #{submission.id}</span>
        </nav>
        <div className="gd-topbar-actions">
          <button className="gd-btn-ghost">Share</button>
          <button className="gd-btn-primary">Finalize Grade</button>
        </div>
      </div>

      {/* Page body */}
      <div className="gd-body">

        {/* Title row */}
        <div className="gd-title-row">
          <div>
            <h1 className="gd-title">{eval_.questionTitle}</h1>
            <div className="gd-meta">
              Submission ID: {submission.id}&nbsp;&bull;&nbsp;Submitted {submission.date}
            </div>
          </div>
          <span className="gd-badge-complete">Automated Grading Complete</span>
        </div>

        {/* 4 metric cards */}
        <div className="gd-metrics-row">
          <div className="gd-metric-card">
            <div className="gd-metric-label">SBERT Similarity Score</div>
            <div className="gd-metric-value" style={{ color: scoreFill(eval_.sbertScore) }}>
              {eval_.sbertScore.toFixed(2)}
            </div>
            <div className="gd-metric-sub">
              {eval_.sbertScore >= 0.85 ? 'Top 10% of class' : eval_.sbertScore >= 0.65 ? 'Above average' : 'Below average'}
            </div>
          </div>

          <div className="gd-metric-card">
            <div className="gd-metric-label">Rubric Adherence</div>
            <div className="gd-metric-value">{eval_.rubricAdherence}%</div>
            <div className="gd-metric-sub">Consistent with previous</div>
          </div>

          <div className="gd-metric-card">
            <div className="gd-metric-label">AI Confidence</div>
            <div className="gd-metric-value gd-metric-dark">{eval_.aiConfidence}</div>
            <div className="gd-metric-sub">
              Model certainty {eval_.aiConfidence === 'High' ? '94%' : eval_.aiConfidence === 'Medium' ? '72%' : '51%'}
            </div>
          </div>

          <div className="gd-metric-card">
            <div className="gd-metric-label">Plagiarism Check</div>
            <div className="gd-metric-value gd-metric-pass">{eval_.plagiarismCheck}</div>
            <div className="gd-metric-sub">0% Originality Issues</div>
          </div>
        </div>

        {/* Main 2-column layout */}
        <div className="gd-main">

          {/* Left: content (70%) */}
          <div className="gd-content">

            {/* Question header */}
            <div className="gd-section-card">
              <div className="gd-section-header">
                <span className="gd-section-label">PROMPT</span>
                <span className="gd-max-pts">Max Points: {eval_.maxPoints}</span>
              </div>
              <div className="gd-question-tag">{eval_.question}</div>
              <p className="gd-prompt-text">{eval_.prompt}</p>
            </div>

            {/* Student answer */}
            <div className="gd-section-card">
              <div className="gd-section-header">
                <span className="gd-section-label">STUDENT ANSWER</span>
                <span className="gd-word-count">Word count: {eval_.wordCount}</span>
              </div>
              <div className="gd-answer-box">
                {eval_.studentAnswer.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* AI Rubric Evaluation */}
            <div className="gd-section-card">
              <div className="gd-section-label" style={{ marginBottom: 16 }}>AI RUBRIC EVALUATION</div>

              {eval_.rubricCriteria.map((c, i) => (
                <div key={i} className="gd-criterion">
                  <div className="gd-criterion-header">
                    <span className="gd-criterion-name">{c.name}</span>
                    <span className="gd-criterion-score">{c.score}/{c.maxScore}</span>
                  </div>
                  <p className="gd-criterion-desc">{c.desc}</p>

                  <div className="gd-match-row">
                    <span className="gd-match-label">Match: {c.matchPct}%</span>
                    <div className="gd-match-track">
                      <div
                        className="gd-match-fill"
                        style={{
                          width: `${c.matchPct}%`,
                          background: c.matchPct >= 85
                            ? 'linear-gradient(90deg,#10b981,#6ee7b7)'
                            : 'linear-gradient(90deg,#667eea,#764ba2)',
                        }}
                      />
                    </div>
                  </div>

                  {c.suggestion && (
                    <div className="gd-suggestion">
                      <span className="gd-suggestion-label">Suggestion: </span>
                      {c.suggestion}
                    </div>
                  )}
                </div>
              ))}

              {eval_.rubricCriteria.length === 0 && (
                <p style={{ color: '#999', fontSize: 14 }}>No rubric criteria available for this submission.</p>
              )}
            </div>
          </div>

          {/* Right: sidebar (30%) */}
          <aside className="gd-sidebar">

            {/* Overall grade */}
            <div className="gd-side-card">
              <div className="gd-grade-header">Overall Grade</div>
              <div className="gd-score-circle-wrap">
                <div className="gd-score-circle">
                  <span className="gd-score-num">{eval_.totalScore}</span>
                  <span className="gd-score-denom">/ {eval_.maxPoints}</span>
                </div>
              </div>
              <div className="gd-grade-label">{gradeLabel(pct)}</div>
              <div className="gd-grade-pct">{pct}% Score</div>
            </div>

            {/* Student info */}
            <div className="gd-side-card">
              {[
                { label: 'Student',  value: submission.student   },
                { label: 'ID',       value: submission.id        },
                { label: 'Group',    value: eval_.group          },
                { label: 'Attempts', value: eval_.attempts       },
              ].map(row => (
                <div key={row.label} className="gd-info-row">
                  <span className="gd-info-label">{row.label}</span>
                  <span className="gd-info-value">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Manual override */}
            <div className="gd-side-card">
              <h3 className="gd-override-title">Manual Override</h3>
              {!overrideMode ? (
                <>
                  <p className="gd-override-desc">
                    The AI score is a recommendation. You can override individual criteria or the final score.
                  </p>
                  <button
                    className="gd-btn-override"
                    onClick={() => setOverrideMode(true)}
                  >
                    Edit Rubric Scores
                  </button>
                </>
              ) : (
                <>
                  <p className="gd-override-desc">Override mode active. Adjust scores below.</p>
                  {eval_.rubricCriteria.map((c, i) => (
                    <div key={i} className="gd-override-row">
                      <label className="gd-override-field-label">{c.name}</label>
                      <input
                        className="gd-override-input"
                        type="number"
                        min="0"
                        max={c.maxScore}
                        defaultValue={c.score}
                      />
                      <span className="gd-override-max">/ {c.maxScore}</span>
                    </div>
                  ))}
                  <div className="gd-override-actions">
                    <button className="gd-btn-ghost-sm" onClick={() => setOverrideMode(false)}>Cancel</button>
                    <button className="gd-btn-primary-sm" onClick={() => setOverrideMode(false)}>Save</button>
                  </div>
                </>
              )}
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}

export default GradingDetail;
