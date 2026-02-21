import { useState } from 'react';
import './GradingQueue.css';

// ── Mock data ──────────────────────────────────────────────────────────────
const SUBMISSIONS = [
  { id: 88201, student: 'Alex Chen',  initials: 'AC', color: '#667eea', assessment: 'CS-401 Midterm',    question: 'P vs NP Problem',         score: 0.89, confidence: 'High',   status: 'Auto-graded', date: 'Oct 14, 2024' },
  { id: 88202, student: 'Jamie Lee',  initials: 'JL', color: '#f59e0b', assessment: 'CS-401 Midterm',    question: 'Turing Machines',           score: 0.71, confidence: 'Medium', status: 'Needs Review', date: 'Oct 14, 2024' },
  { id: 88203, student: 'Sam Osei',   initials: 'SO', color: '#ef4444', assessment: 'CS-301 Quiz 2',     question: 'Binary Search Trees',       score: 0.55, confidence: 'Low',    status: 'Needs Review', date: 'Oct 13, 2024' },
  { id: 88204, student: 'Priya Nair', initials: 'PN', color: '#10b981', assessment: 'CS-401 Midterm',    question: 'Context-Free Grammars',     score: 0.93, confidence: 'High',   status: 'Auto-graded', date: 'Oct 14, 2024' },
  { id: 88205, student: 'Tom Blake',  initials: 'TB', color: '#764ba2', assessment: 'CS-501 Assignment', question: 'Neural Network Basics',     score: 0.82, confidence: 'High',   status: 'Auto-graded', date: 'Oct 12, 2024' },
  { id: 88206, student: 'Mei Zhang',  initials: 'MZ', color: '#3b82f6', assessment: 'CS-301 Quiz 2',     question: 'Hash Table Collisions',     score: 0.68, confidence: 'Medium', status: 'Needs Review', date: 'Oct 13, 2024' },
  { id: 88207, student: 'Luis Vega',  initials: 'LV', color: '#6366f1', assessment: 'CS-401 Midterm',    question: 'Pumping Lemma',             score: 0.77, confidence: 'Medium', status: 'Auto-graded', date: 'Oct 14, 2024' },
  { id: 88208, student: 'Sara Kim',   initials: 'SK', color: '#0ea5e9', assessment: 'CS-501 Assignment', question: 'Gradient Descent',          score: 0.91, confidence: 'High',   status: 'Approved',    date: 'Oct 11, 2024' },
];

const FILTERS = [
  { key: 'All',          label: 'All' },
  { key: 'Needs Review', label: 'Needs Review' },
  { key: 'Auto-graded',  label: 'Auto-graded' },
  { key: 'Approved',     label: 'Approved' },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function scoreClass(s) {
  if (s >= 0.85) return 'gq-score-high';
  if (s >= 0.65) return 'gq-score-mid';
  return 'gq-score-low';
}

function statusClass(s) {
  return {
    'Auto-graded':  'gq-chip-ai',
    'Needs Review': 'gq-chip-review',
    'Approved':     'gq-chip-approved',
  }[s] ?? '';
}

function confidenceClass(c) {
  return { High: 'gq-conf-high', Medium: 'gq-conf-mid', Low: 'gq-conf-low' }[c] ?? '';
}

// ── Component ──────────────────────────────────────────────────────────────
function GradingQueue({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const visible = activeFilter === 'All'
    ? SUBMISSIONS
    : SUBMISSIONS.filter(s => s.status === activeFilter);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f.key] = f.key === 'All' ? SUBMISSIONS.length : SUBMISSIONS.filter(s => s.status === f.key).length;
    return acc;
  }, {});

  const reviewed  = SUBMISSIONS.filter(s => s.status === 'Approved').length;
  const total     = SUBMISSIONS.length;

  return (
    <div className="gq-page">

      {/* Topbar */}
      <div className="gq-topbar">
        <div>
          <div className="gq-topbar-title">Grading Queue</div>
          <div className="gq-topbar-sub">
            {reviewed} of {total} reviewed
            <span className="gq-progress-inline">
              <span
                className="gq-progress-inline-fill"
                style={{ width: `${Math.round((reviewed / total) * 100)}%` }}
              />
            </span>
          </div>
        </div>
        <button className="gq-btn-outline">
          Bulk Approve High Confidence
        </button>
      </div>

      {/* Filter chips */}
      <div className="gq-filter-row">
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`gq-filter-tab ${activeFilter === f.key ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}
            <span className="gq-filter-count">{counts[f.key]}</span>
          </button>
        ))}
      </div>

      {/* Submissions table */}
      <div className="gq-table-card">
        <table className="gq-table">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Student</th>
              <th>Assessment</th>
              <th>SBERT Score</th>
              <th>Confidence</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(sub => (
              <tr
                key={sub.id}
                className="gq-row"
                onClick={() => onNavigate('grading-detail', sub)}
              >
                <td className="gq-cell-id">#{sub.id}</td>
                <td>
                  <div className="gq-student">
                    <div className="gq-avatar" style={{ background: sub.color }}>
                      {sub.initials}
                    </div>
                    <div>
                      <div className="gq-student-name">{sub.student}</div>
                      <div className="gq-student-q">{sub.question}</div>
                    </div>
                  </div>
                </td>
                <td className="gq-cell-assess">{sub.assessment}</td>
                <td>
                  <div className={`gq-score ${scoreClass(sub.score)}`}>
                    {sub.score.toFixed(2)}
                  </div>
                  <div className="gq-score-bar-track">
                    <div
                      className="gq-score-bar-fill"
                      style={{ width: `${sub.score * 100}%`, background: sub.score >= 0.85 ? '#10b981' : sub.score >= 0.65 ? '#f59e0b' : '#ef4444' }}
                    />
                  </div>
                </td>
                <td>
                  <span className={`gq-conf-badge ${confidenceClass(sub.confidence)}`}>
                    {sub.confidence}
                  </span>
                </td>
                <td>
                  <span className={`gq-status-chip ${statusClass(sub.status)}`}>
                    {sub.status}
                  </span>
                </td>
                <td className="gq-cell-date">{sub.date}</td>
                <td>
                  <button
                    className="gq-review-btn"
                    onClick={(e) => { e.stopPropagation(); onNavigate('grading-detail', sub); }}
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GradingQueue;
