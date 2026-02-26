import React, { useState } from 'react';
import './StudentAssessments.css';

// ── Mock data ──────────────────────────────────────────────────────────────
const AVAILABLE = [
  {
    id:        'A001',
    title:     'CS-401 Midterm',
    topic:     'Theory of Computation',
    questions: 5,
    maxMarks:  100,
    due:       'Mar 1, 2026',
  },
  {
    id:        'A005',
    title:     'CS-501 Assignment',
    topic:     'Machine Learning',
    questions: 2,
    maxMarks:  50,
    due:       'Mar 5, 2026',
  },
];

const COMPLETED = [
  {
    id:          'A003',
    title:       'CS-201 Final',
    topic:       'Algorithms',
    questions:   8,
    maxMarks:    150,
    score:       123,
    status:      'Graded',
    submittedOn: 'Feb 14, 2026',
  },
  {
    id:          'A002',
    title:       'CS-301 Quiz 2',
    topic:       'Data Structures',
    questions:   3,
    maxMarks:    30,
    score:       22,
    status:      'Graded',
    submittedOn: 'Feb 10, 2026',
  },
  {
    id:          'A004',
    title:       'CS-401 Quiz 1',
    topic:       'Automata Theory',
    questions:   4,
    maxMarks:    40,
    score:       36,
    status:      'Graded',
    submittedOn: 'Jan 28, 2026',
  },
  {
    id:          'A006',
    title:       'CS-301 Quiz 1',
    topic:       'Data Structures',
    questions:   3,
    maxMarks:    30,
    score:       null,
    status:      'Pending Review',
    submittedOn: 'Feb 20, 2026',
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function scoreClass(pct) {
  if (pct >= 85) return 'stu-score-high';
  if (pct >= 65) return 'stu-score-mid';
  return 'stu-score-low';
}

// ── Component ──────────────────────────────────────────────────────────────
function StudentAssessments({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('Available');

  return (
    <div className="stu-assess-page">

      {/* Topbar */}
      <div className="stu-assess-topbar">
        <div className="stu-assess-topbar-left">
          <div className="stu-assess-topbar-title">Assessments</div>
          <div className="stu-assess-topbar-sub">
            {AVAILABLE.length} available · {COMPLETED.length} completed
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="stu-assess-tabs">
        {['Available', 'Completed'].map((tab) => (
          <button
            key={tab}
            className={`stu-assess-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            <span className="stu-assess-tab-count">
              {tab === 'Available' ? AVAILABLE.length : COMPLETED.length}
            </span>
          </button>
        ))}
      </div>

      {/* Available assessments */}
      {activeTab === 'Available' && (
        <div className="stu-assess-list">
          {AVAILABLE.length === 0 ? (
            <div className="stu-assess-empty">No assessments are available right now.</div>
          ) : (
            AVAILABLE.map((a) => (
              <div key={a.id} className="stu-assess-card">
                <div className="stu-assess-card-left">
                  <div className="stu-assess-card-title">{a.title}</div>
                  <div className="stu-assess-card-meta">
                    {a.topic} · {a.questions} question{a.questions !== 1 ? 's' : ''} · {a.maxMarks} marks
                  </div>
                  <div className="stu-assess-card-due">Due: {a.due}</div>
                </div>
                <div className="stu-assess-card-right">
                  <span className="stu-badge stu-badge-active">Active</span>
                  <button
                    className="stu-btn-primary"
                    onClick={() => onNavigate('take-test')}
                  >
                    Start →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Completed assessments */}
      {activeTab === 'Completed' && (
        <div className="stu-assess-list">
          {COMPLETED.length === 0 ? (
            <div className="stu-assess-empty">You haven't completed any assessments yet.</div>
          ) : (
            COMPLETED.map((a) => {
              const pct = a.score !== null ? Math.round((a.score / a.maxMarks) * 100) : null;
              return (
                <div key={a.id} className="stu-assess-card">
                  <div className="stu-assess-card-left">
                    <div className="stu-assess-card-title">{a.title}</div>
                    <div className="stu-assess-card-meta">
                      {a.topic} · {a.questions} question{a.questions !== 1 ? 's' : ''} · {a.maxMarks} marks
                    </div>
                    <div className="stu-assess-card-due">Submitted: {a.submittedOn}</div>
                  </div>
                  <div className="stu-assess-card-right">
                    {pct !== null ? (
                      <div className={`stu-assess-score ${scoreClass(pct)}`}>{pct}%</div>
                    ) : (
                      <span className="stu-badge stu-badge-pending">{a.status}</span>
                    )}
                    {a.status === 'Graded' && (
                      <button
                        className="stu-btn-ghost"
                        onClick={() => onNavigate('results')}
                      >
                        View Results
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
}

export default StudentAssessments;
