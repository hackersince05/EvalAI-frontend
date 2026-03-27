import React from 'react';
import { useUser } from '../UserContext';
import './DashboardPage.css';

// ── SVG Icons ───────────────────────────────────────────────────────────────
const IconBarChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);
const IconClipboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <rect x="5" y="2" width="14" height="20" rx="2"/>
    <line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="12" y2="15"/>
  </svg>
);
const IconHourglass = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M5 2h14M5 22h14M6 2v4l6 6-6 6v4M18 2v4l-6 6 6 6v4"/>
  </svg>
);
const IconQuestion = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconUpload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);
const IconTrendingUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);

// ── Mock data ──────────────────────────────────────────────────────────────
const STATS = [
  {
    label:     'Total Questions',
    value:     '48',
    delta:     '+3 this week',
    deltaType: 'up',
    icon:      <IconQuestion />,
  },
  {
    label:     'Pending Scripts',
    value:     '12',
    delta:     '4 flagged for review',
    deltaType: 'down',
    icon:      <IconHourglass />,
  },
  {
    label:     'Avg. Score',
    value:     '74%',
    delta:     '+2% vs last batch',
    deltaType: 'up',
    icon:      <IconBarChart />,
  },
  {
    label:     'Active Assessments',
    value:     '3',
    delta:     '1 closing this week',
    deltaType: null,
    icon:      <IconClipboard />,
  },
];

const QUEUE_SNAPSHOT = [
  { id: 88201, student: 'Alex Chen',  initials: 'AC', assessment: 'CS-401 Midterm',    score: 0.89, status: 'Auto-graded',  color: '#667eea' },
  { id: 88202, student: 'Jamie Lee',  initials: 'JL', assessment: 'CS-401 Midterm',    score: 0.71, status: 'Needs Review', color: '#f59e0b' },
  { id: 88203, student: 'Sam Osei',   initials: 'SO', assessment: 'CS-301 Quiz 2',     score: 0.55, status: 'Needs Review', color: '#ef4444' },
  { id: 88204, student: 'Priya Nair', initials: 'PN', assessment: 'CS-401 Midterm',    score: 0.93, status: 'Auto-graded',  color: '#10b981' },
  { id: 88205, student: 'Tom Blake',  initials: 'TB', assessment: 'CS-501 Assignment', score: 0.82, status: 'Auto-graded',  color: '#764ba2' },
];

const ACTIVITY = [
  { color: '#667eea', text: 'Alex Chen submitted an answer for CS-401 Midterm',       bold: 'Alex Chen',         time: '2 min ago'  },
  { color: '#10b981', text: '12 scripts auto-graded in CS-301 Quiz 2',                bold: '12 scripts',        time: '18 min ago' },
  { color: '#3b82f6', text: 'New question added to CS-501 Assignment',                bold: 'CS-501 Assignment',  time: '1 hr ago'   },
  { color: '#f59e0b', text: 'Grade overridden for Sam Osei — CS-301 Quiz 2',          bold: 'Sam Osei',           time: '3 hrs ago'  },
  { color: '#667eea', text: '28 students submitted answers to CS-201 Final',           bold: '28 students',        time: 'Yesterday'  },
  { color: '#10b981', text: 'Assessment CS-401 Quiz 1 moved to Closed',               bold: 'CS-401 Quiz 1',      time: 'Yesterday'  },
];

const SCORE_DIST = [
  { label: '90–100%', fill: 'linear-gradient(90deg,#10b981,#6ee7b7)', pct: 28, count: 14 },
  { label: '80–89%',  fill: 'linear-gradient(90deg,#667eea,#764ba2)', pct: 42, count: 21 },
  { label: '70–79%',  fill: 'linear-gradient(90deg,#3b82f6,#60a5fa)', pct: 20, count: 10 },
  { label: '60–69%',  fill: '#f59e0b',                                pct: 6,  count: 3  },
  { label: '< 60%',   fill: '#ef4444',                                pct: 4,  count: 2  },
];

const QUICK_ACTIONS = [
  { icon: <IconPlus />,       label: 'New Assessment', desc: 'Create a question',    page: 'assessments' },
  { icon: <IconUpload />,     label: 'Upload Scripts',  desc: 'Batch submit answers', page: 'grading'     },
  { icon: <IconTrendingUp />, label: 'View Analytics',  desc: 'Scores & trends',     page: 'analytics'   },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function scoreClass(s) {
  if (s >= 0.85) return 'dash-score-high';
  if (s >= 0.65) return 'dash-score-mid';
  return 'dash-score-low';
}

function statusChip(status) {
  const map = {
    'Auto-graded':  'dash-chip-ai',
    'Needs Review': 'dash-chip-pending',
    'Approved':     'dash-chip-reviewed',
    'Flagged':      'dash-chip-flagged',
  };
  return map[status] ?? 'dash-chip-ai';
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

const today = new Date().toLocaleDateString('en-GB', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
});

function ActivityText({ text, bold }) {
  const idx = text.indexOf(bold);
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <strong>{bold}</strong>
      {text.slice(idx + bold.length)}
    </span>
  );
}

// ── Component ──────────────────────────────────────────────────────────────
function DashboardPage({ onNavigate }) {
  const { user } = useUser();
  const firstName = user?.fullName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'there';
  const pendingCount = QUEUE_SNAPSHOT.filter(i => i.status === 'Needs Review').length;

  return (
    <div>
      {/* Sticky topbar */}
      <div className="dash-topbar">
        <div className="dash-breadcrumb">
          <span>Home</span>
          <span className="sep">/</span>
          <span>Dashboard</span>
        </div>
        <div className="dash-topbar-actions">
          <button className="dash-notif-btn" title="Notifications">
            <IconBell />
            <span className="dash-notif-dot" />
          </button>
          <button className="dash-btn-primary" onClick={() => onNavigate('grading')}>
            Start Grading
          </button>
        </div>
      </div>

      {/* Page body */}
      <div className="dash-content">

        {/* Welcome */}
        <div className="dash-welcome">
          <div className="dash-welcome-greeting">Good {greeting()}, {firstName}</div>
          <div className="dash-welcome-sub">Here's what's happening across your assessments today.</div>
          <div className="dash-welcome-date">{today}</div>
        </div>

        {/* Stat cards */}
        <div className="dash-stats-row">
          {STATS.map((s) => (
            <div key={s.label} className="dash-stat-card">
              <div className="dash-stat-accent" />
              <div className="dash-stat-icon">{s.icon}</div>
              <div className="dash-stat-label">{s.label}</div>
              <div className="dash-stat-value">{s.value}</div>
              <div className="dash-stat-delta">
                {s.deltaType === 'up'   && <span className="up">↑ </span>}
                {s.deltaType === 'down' && <span className="down">↓ </span>}
                {s.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Main 2-column grid */}
        <div className="dash-grid-2">

          {/* Grading Queue snapshot */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div>
                <div className="dash-card-title">Grading Queue</div>
                <div className="dash-card-subtitle">Scripts awaiting review</div>
              </div>
              <a
                className="dash-card-action"
                href="#grading"
                onClick={(e) => { e.preventDefault(); onNavigate('grading'); }}
              >
                View all →
              </a>
            </div>

            {QUEUE_SNAPSHOT.map((item) => (
              <div
                key={item.id}
                className="dash-queue-item"
                onClick={() => onNavigate('grading')}
              >
                <div className="dash-queue-avatar" style={{ background: item.color }}>
                  {item.initials}
                </div>
                <div className="dash-queue-info">
                  <div className="dash-queue-name">{item.student}</div>
                  <div className="dash-queue-meta">{item.assessment} · #{item.id}</div>
                </div>
                <div className={`dash-queue-score ${scoreClass(item.score)}`}>
                  {item.score.toFixed(2)}
                </div>
                <span className={`dash-status-chip ${statusChip(item.status)}`}>
                  {item.status}
                </span>
              </div>
            ))}

            <div style={{ padding: '14px 20px', borderTop: '1px solid #e0e0e0' }}>
              <button
                className="dash-btn-primary"
                style={{ width: '100%' }}
                onClick={() => onNavigate('grading')}
              >
                Start Grading ({pendingCount} pending)
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-title">Recent Activity</div>
            </div>
            {ACTIVITY.map((item, idx) => (
              <div key={idx} className="dash-activity-item">
                <div className="dash-activity-dot" style={{ background: item.color }} />
                <div>
                  <div className="dash-activity-text">
                    <ActivityText text={item.text} bold={item.bold} />
                  </div>
                  <div className="dash-activity-time">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="dash-grid-3">

          {/* Score distribution — spans 2 columns */}
          <div className="dash-card" style={{ gridColumn: 'span 2' }}>
            <div className="dash-card-header">
              <div>
                <div className="dash-card-title">Score Distribution</div>
                <div className="dash-card-subtitle">CS-401 Midterm · 50 submissions</div>
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              {SCORE_DIST.map((bar) => (
                <div key={bar.label} className="dash-dist-bar">
                  <div className="dash-dist-label">{bar.label}</div>
                  <div className="dash-dist-track">
                    <div
                      className="dash-dist-fill"
                      style={{ width: `${bar.pct}%`, background: bar.fill }}
                    />
                  </div>
                  <div className="dash-dist-count">{bar.count}</div>
                </div>
              ))}
              <div className="dash-dist-footer">
                <span>Class average: <strong>76%</strong></span>
                <span>Highest: <strong>98%</strong></span>
                <span>Lowest: <strong>44%</strong></span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-title">Quick Actions</div>
            </div>
            <div className="dash-qa-grid">
              {QUICK_ACTIONS.map((qa) => (
                <button
                  key={qa.label}
                  className="dash-qa-btn"
                  onClick={() => onNavigate(qa.page)}
                >
                  <div className="dash-qa-icon" style={{ background: '#f0f0f0' }}>
                    {qa.icon}
                  </div>
                  <div>
                    <div className="dash-qa-label">{qa.label}</div>
                    <div className="dash-qa-desc">{qa.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tip banner */}
        <div className="dash-tip-card">
          <div className="dash-tip-title">Tip — Bulk Approve High-Confidence Scripts</div>
          <div className="dash-tip-body">
            EvalAI flagged <strong>34 scripts</strong> with an SBERT confidence score above 0.90.
            You can bulk-approve these in the Grading Queue to save time while keeping manual
            control over borderline submissions.
          </div>
          <div className="dash-tip-actions">
            <button className="dash-btn-white" onClick={() => onNavigate('grading')}>
              Go to Grading Queue
            </button>
            <button className="dash-btn-outline-white">Dismiss</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;
