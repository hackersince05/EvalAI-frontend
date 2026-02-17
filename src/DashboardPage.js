import React from 'react';
import './DashboardPage.css';

function DashboardPage() {
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const hour = today.getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      {/* Topbar */}
      <div className="dash-topbar">
        <div className="dash-breadcrumb">
          <span>EvalAI</span>
          <span className="sep">/</span>
          <span>Dashboard</span>
        </div>
        <div className="dash-topbar-actions">
          <div className="dash-notif-btn">
            &#128276;
            <div className="dash-notif-dot"></div>
          </div>
          <button className="dash-btn-ghost">Export Report</button>
          <button className="dash-btn-primary">+ New Assessment</button>
        </div>
      </div>

      {/* Content */}
      <div className="dash-content">
          {/* Welcome */}
          <div className="dash-welcome">
            <div className="dash-welcome-greeting">
              {greeting}, <span style={{ color: '#667eea' }}>Dr. Chen.</span>
            </div>
            <div className="dash-welcome-sub">
              Here's what needs your attention today.
            </div>
            <div className="dash-welcome-date">{dateString}</div>
          </div>

          {/* Stats */}
          <div className="dash-stats-row">
            <div className="dash-stat-card">
              <div className="dash-stat-accent" style={{ background: '#333' }}></div>
              <div className="dash-stat-icon">&#9998;</div>
              <div className="dash-stat-label">Pending Review</div>
              <div className="dash-stat-value">14</div>
              <div className="dash-stat-delta">submissions awaiting your approval</div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-accent" style={{ background: '#667eea' }}></div>
              <div className="dash-stat-icon">&#10004;</div>
              <div className="dash-stat-label">AI Evaluated</div>
              <div className="dash-stat-value">238</div>
              <div className="dash-stat-delta">
                <span className="up">&#8593; 12%</span> from last week
              </div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-accent" style={{ background: '#e65100' }}></div>
              <div className="dash-stat-icon">&#9678;</div>
              <div className="dash-stat-label">Avg. Score</div>
              <div className="dash-stat-value">78.4</div>
              <div className="dash-stat-delta">
                <span className="down">&#8595; 3.2</span> vs last exam
              </div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-accent" style={{ background: '#c33' }}></div>
              <div className="dash-stat-icon">&#9873;</div>
              <div className="dash-stat-label">Flagged</div>
              <div className="dash-stat-value">3</div>
              <div className="dash-stat-delta">require urgent attention</div>
            </div>
          </div>

          {/* Quick Actions + Upcoming Deadlines */}
          <div className="dash-quick-row">
            {/* Quick Actions */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <div className="dash-card-title">Quick Actions</div>
                  <div className="dash-card-subtitle">Jump to your most common tasks</div>
                </div>
              </div>
              <div className="dash-qa-grid">
                <button className="dash-qa-btn">
                  <div className="dash-qa-icon" style={{ background: '#e8f5e9' }}>&#9998;</div>
                  <div>
                    <div className="dash-qa-label">Grade Next</div>
                    <div className="dash-qa-desc">14 in queue</div>
                  </div>
                </button>
                <button className="dash-qa-btn">
                  <div className="dash-qa-icon" style={{ background: '#e3f2fd' }}>&#8862;</div>
                  <div>
                    <div className="dash-qa-label">New Assessment</div>
                    <div className="dash-qa-desc">Create &amp; publish</div>
                  </div>
                </button>
                <button className="dash-qa-btn">
                  <div className="dash-qa-icon" style={{ background: '#fff3e0' }}>&#9776;</div>
                  <div>
                    <div className="dash-qa-label">Add Question</div>
                    <div className="dash-qa-desc">To question bank</div>
                  </div>
                </button>
                <button className="dash-qa-btn">
                  <div className="dash-qa-icon" style={{ background: '#ffebee' }}>&#9873;</div>
                  <div>
                    <div className="dash-qa-label">Review Flagged</div>
                    <div className="dash-qa-desc">3 urgent items</div>
                  </div>
                </button>
                <button className="dash-qa-btn">
                  <div className="dash-qa-icon" style={{ background: '#f0f0f0' }}>&#9678;</div>
                  <div>
                    <div className="dash-qa-label">View Analytics</div>
                    <div className="dash-qa-desc">Term overview</div>
                  </div>
                </button>
                <button className="dash-qa-btn">
                  <div className="dash-qa-icon" style={{ background: '#f0f0f0' }}>&#8693;</div>
                  <div>
                    <div className="dash-qa-label">Export Grades</div>
                    <div className="dash-qa-desc">Download CSV</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <div className="dash-card-title">Upcoming Deadlines</div>
                  <div className="dash-card-subtitle">Next 7 days across all courses</div>
                </div>
                <a className="dash-card-action" href="#calendar">Calendar &rarr;</a>
              </div>

              <div className="dash-deadline-item">
                <div className="dash-deadline-cal">
                  <div className="dash-deadline-cal-top" style={{ background: '#c33' }}>Oct</div>
                  <div className="dash-deadline-cal-day">29</div>
                </div>
                <div className="dash-deadline-info">
                  <div className="dash-deadline-name">Research Methods — Final Essay</div>
                  <div className="dash-deadline-course">PSYC 302 · 29 students enrolled</div>
                </div>
                <div className="dash-deadline-meta">
                  <div className="dash-deadline-time">11:59 PM</div>
                  <div className="dash-deadline-sub" style={{ color: '#c33' }}>5 not submitted</div>
                </div>
                <div className="dash-urgency-pip" style={{ background: '#c33' }}></div>
              </div>

              <div className="dash-deadline-item">
                <div className="dash-deadline-cal">
                  <div className="dash-deadline-cal-top" style={{ background: '#e65100' }}>Oct</div>
                  <div className="dash-deadline-cal-day">31</div>
                </div>
                <div className="dash-deadline-info">
                  <div className="dash-deadline-name">Cognitive Psych — Assignment 3</div>
                  <div className="dash-deadline-course">PSYC 211 · 38 students enrolled</div>
                </div>
                <div className="dash-deadline-meta">
                  <div className="dash-deadline-time">5:00 PM</div>
                  <div className="dash-deadline-sub">38 / 38 submitted</div>
                </div>
                <div className="dash-urgency-pip" style={{ background: '#2e7d32' }}></div>
              </div>

              <div className="dash-deadline-item">
                <div className="dash-deadline-cal">
                  <div className="dash-deadline-cal-top" style={{ background: '#667eea' }}>Nov</div>
                  <div className="dash-deadline-cal-day">1</div>
                </div>
                <div className="dash-deadline-info">
                  <div className="dash-deadline-name">Neuroscience — Lab Report 2</div>
                  <div className="dash-deadline-course">NSCI 101 · 52 students enrolled</div>
                </div>
                <div className="dash-deadline-meta">
                  <div className="dash-deadline-time">9:00 AM</div>
                  <div className="dash-deadline-sub" style={{ color: '#e65100' }}>11 not submitted</div>
                </div>
                <div className="dash-urgency-pip" style={{ background: '#e65100' }}></div>
              </div>

              <div className="dash-deadline-item">
                <div className="dash-deadline-cal">
                  <div className="dash-deadline-cal-top" style={{ background: '#999' }}>Nov</div>
                  <div className="dash-deadline-cal-day">4</div>
                </div>
                <div className="dash-deadline-info">
                  <div className="dash-deadline-name">Developmental Psych — Week 10 Quiz</div>
                  <div className="dash-deadline-course">PSYC 340 · 44 students enrolled</div>
                </div>
                <div className="dash-deadline-meta">
                  <div className="dash-deadline-time">11:59 PM</div>
                  <div className="dash-deadline-sub">Opens Nov 3</div>
                </div>
                <div className="dash-urgency-pip" style={{ background: '#ccc' }}></div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="dash-grid-2">
            {/* Grading Queue */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <div className="dash-card-title">Grading Queue</div>
                  <div className="dash-card-subtitle">Submissions pending final review</div>
                </div>
                <a className="dash-card-action" href="#queue">View all &rarr;</a>
              </div>

              <div className="dash-queue-item">
                <div className="dash-queue-avatar" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>AJ</div>
                <div className="dash-queue-info">
                  <div className="dash-queue-name">
                    Alex Johnson <span className="dash-status-chip dash-chip-ai">AI Scored</span>
                  </div>
                  <div className="dash-queue-meta">Cognitive Psych · Assignment 3: Memory Models · Q4 of 5</div>
                </div>
                <div className="dash-queue-score dash-score-high">92</div>
              </div>

              <div className="dash-queue-item">
                <div className="dash-queue-avatar" style={{ background: 'linear-gradient(135deg, #e65100, #ff8f00)' }}>MR</div>
                <div className="dash-queue-info">
                  <div className="dash-queue-name">
                    Maya Rodriguez <span className="dash-status-chip dash-chip-flagged">Flagged</span>
                  </div>
                  <div className="dash-queue-meta">Cognitive Psych · Assignment 3: Memory Models · Q2 of 5</div>
                </div>
                <div className="dash-queue-score dash-score-mid">64</div>
              </div>

              <div className="dash-queue-item">
                <div className="dash-queue-avatar" style={{ background: 'linear-gradient(135deg, #5c6bc0, #1565c0)' }}>LK</div>
                <div className="dash-queue-info">
                  <div className="dash-queue-name">
                    Liam Kim <span className="dash-status-chip dash-chip-pending">Pending</span>
                  </div>
                  <div className="dash-queue-meta">Intro to Neuroscience · Midterm Exam · Q7 of 8</div>
                </div>
                <div className="dash-queue-score dash-score-high">88</div>
              </div>

              <div className="dash-queue-item">
                <div className="dash-queue-avatar" style={{ background: 'linear-gradient(135deg, #c33, #e57373)' }}>PO</div>
                <div className="dash-queue-info">
                  <div className="dash-queue-name">
                    Priya Okafor <span className="dash-status-chip dash-chip-flagged">Flagged</span>
                  </div>
                  <div className="dash-queue-meta">Research Methods · Final Essay · Q1 of 3</div>
                </div>
                <div className="dash-queue-score dash-score-low">41</div>
              </div>

              <div className="dash-queue-item">
                <div className="dash-queue-avatar" style={{ background: 'linear-gradient(135deg, #7e57c2, #4527a0)' }}>TW</div>
                <div className="dash-queue-info">
                  <div className="dash-queue-name">
                    Tom Walsh <span className="dash-status-chip dash-chip-reviewed">Reviewed</span>
                  </div>
                  <div className="dash-queue-meta">Developmental Psych · Week 9 Quiz · Q3 of 5</div>
                </div>
                <div className="dash-queue-score dash-score-high">95</div>
              </div>

              <div className="dash-queue-item">
                <div className="dash-queue-avatar" style={{ background: 'linear-gradient(135deg, #26a69a, #00695c)' }}>EN</div>
                <div className="dash-queue-info">
                  <div className="dash-queue-name">
                    Elena Novak <span className="dash-status-chip dash-chip-ai">AI Scored</span>
                  </div>
                  <div className="dash-queue-meta">Cognitive Psych · Assignment 3: Memory Models · Q1 of 5</div>
                </div>
                <div className="dash-queue-score dash-score-mid">73</div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <div className="dash-card-title">Recent Activity</div>
                  <div className="dash-card-subtitle">System and evaluation events</div>
                </div>
              </div>

              <div className="dash-activity-item">
                <div className="dash-activity-dot" style={{ background: '#2e7d32' }}></div>
                <div>
                  <div className="dash-activity-text">
                    <strong>AI evaluation complete</strong> for Cognitive Psych · Assignment 3 (38 submissions)
                  </div>
                  <div className="dash-activity-time">2 minutes ago</div>
                </div>
              </div>

              <div className="dash-activity-item">
                <div className="dash-activity-dot" style={{ background: '#c33' }}></div>
                <div>
                  <div className="dash-activity-text">
                    <strong>Priya Okafor</strong>'s submission flagged for low semantic similarity (0.31)
                  </div>
                  <div className="dash-activity-time">14 minutes ago</div>
                </div>
              </div>

              <div className="dash-activity-item">
                <div className="dash-activity-dot" style={{ background: '#667eea' }}></div>
                <div>
                  <div className="dash-activity-text">
                    Grade finalized for <strong>Tom Walsh</strong> — 95/100 · Neuroscience Midterm
                  </div>
                  <div className="dash-activity-time">41 minutes ago</div>
                </div>
              </div>

              <div className="dash-activity-item">
                <div className="dash-activity-dot" style={{ background: '#e65100' }}></div>
                <div>
                  <div className="dash-activity-text">
                    <strong>Research Methods Final Essay</strong> opened for submission by 24 students
                  </div>
                  <div className="dash-activity-time">2 hours ago</div>
                </div>
              </div>

              <div className="dash-activity-item">
                <div className="dash-activity-dot" style={{ background: '#2e7d32' }}></div>
                <div>
                  <div className="dash-activity-text">
                    Rubric updated for <strong>Developmental Psych Week 9 Quiz</strong>
                  </div>
                  <div className="dash-activity-time">Yesterday, 4:22 PM</div>
                </div>
              </div>

              <div className="dash-activity-item">
                <div className="dash-activity-dot" style={{ background: '#667eea' }}></div>
                <div>
                  <div className="dash-activity-text">
                    <strong>Maya Rodriguez</strong>'s flag resolved — score adjusted to 64/100
                  </div>
                  <div className="dash-activity-time">Yesterday, 2:05 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="dash-grid-3">
            {/* Score Distribution */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <div className="dash-card-title">Score Distribution</div>
                  <div className="dash-card-subtitle">Current term · All courses</div>
                </div>
              </div>
              <div style={{ padding: '16px 20px' }}>
                <div className="dash-dist-bar">
                  <div className="dash-dist-label">90–100</div>
                  <div className="dash-dist-track">
                    <div className="dash-dist-fill" style={{ width: '35%', background: '#2e7d32' }}></div>
                  </div>
                  <div className="dash-dist-count">41</div>
                </div>
                <div className="dash-dist-bar">
                  <div className="dash-dist-label">75–89</div>
                  <div className="dash-dist-track">
                    <div className="dash-dist-fill" style={{ width: '55%', background: '#4caf50' }}></div>
                  </div>
                  <div className="dash-dist-count">65</div>
                </div>
                <div className="dash-dist-bar">
                  <div className="dash-dist-label">60–74</div>
                  <div className="dash-dist-track">
                    <div className="dash-dist-fill" style={{ width: '42%', background: '#e65100' }}></div>
                  </div>
                  <div className="dash-dist-count">49</div>
                </div>
                <div className="dash-dist-bar">
                  <div className="dash-dist-label">45–59</div>
                  <div className="dash-dist-track">
                    <div className="dash-dist-fill" style={{ width: '22%', background: '#ff8f00' }}></div>
                  </div>
                  <div className="dash-dist-count">26</div>
                </div>
                <div className="dash-dist-bar">
                  <div className="dash-dist-label">0–44</div>
                  <div className="dash-dist-track">
                    <div className="dash-dist-fill" style={{ width: '12%', background: '#c33' }}></div>
                  </div>
                  <div className="dash-dist-count">14</div>
                </div>
                <div className="dash-dist-footer">
                  <span>195 total submissions</span>
                  <span>Median: <strong>76</strong></span>
                </div>
              </div>
            </div>

            {/* Active Courses */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <div className="dash-card-title">Active Courses</div>
                  <div className="dash-card-subtitle">Avg score this term</div>
                </div>
                <a className="dash-card-action" href="#manage">Manage</a>
              </div>

              <div className="dash-course-item">
                <div className="dash-course-dot" style={{ background: '#333' }}></div>
                <div>
                  <div className="dash-course-name">Cognitive Psychology</div>
                  <div className="dash-course-meta">38 students · 5 assessments</div>
                </div>
                <div className="dash-course-avg dash-score-high">82</div>
              </div>

              <div className="dash-course-item">
                <div className="dash-course-dot" style={{ background: '#667eea' }}></div>
                <div>
                  <div className="dash-course-name">Intro to Neuroscience</div>
                  <div className="dash-course-meta">52 students · 3 assessments</div>
                </div>
                <div className="dash-course-avg dash-score-high">79</div>
              </div>

              <div className="dash-course-item">
                <div className="dash-course-dot" style={{ background: '#e65100' }}></div>
                <div>
                  <div className="dash-course-name">Research Methods</div>
                  <div className="dash-course-meta">29 students · 2 assessments</div>
                </div>
                <div className="dash-course-avg dash-score-mid">71</div>
              </div>

              <div className="dash-course-item">
                <div className="dash-course-dot" style={{ background: '#999' }}></div>
                <div>
                  <div className="dash-course-name">Developmental Psych</div>
                  <div className="dash-course-meta">44 students · 7 assessments</div>
                </div>
                <div className="dash-course-avg dash-score-high">84</div>
              </div>
            </div>

            {/* AI Confidence */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <div className="dash-card-title">AI Confidence</div>
                  <div className="dash-card-subtitle">Evaluation certainty breakdown</div>
                </div>
              </div>
              <div className="dash-confidence-section">
                <div className="dash-confidence-row">
                  <div>
                    <div className="dash-confidence-label">High Confidence</div>
                    <div className="dash-confidence-range">&ge; 0.85 similarity</div>
                  </div>
                  <div>
                    <div className="dash-confidence-value" style={{ color: '#2e7d32' }}>71%</div>
                    <div className="dash-confidence-count">169 submissions</div>
                  </div>
                </div>
                <div className="dash-confidence-row">
                  <div>
                    <div className="dash-confidence-label">Medium Confidence</div>
                    <div className="dash-confidence-range">0.65 – 0.84</div>
                  </div>
                  <div>
                    <div className="dash-confidence-value" style={{ color: '#e65100' }}>21%</div>
                    <div className="dash-confidence-count">50 submissions</div>
                  </div>
                </div>
                <div className="dash-confidence-row" style={{ marginBottom: '20px' }}>
                  <div>
                    <div className="dash-confidence-label">Low Confidence</div>
                    <div className="dash-confidence-range">&lt; 0.65 similarity</div>
                  </div>
                  <div>
                    <div className="dash-confidence-value" style={{ color: '#c33' }}>8%</div>
                    <div className="dash-confidence-count">19 submissions</div>
                  </div>
                </div>
                <div className="dash-confidence-bar">
                  <div
                    className="dash-confidence-bar-segment"
                    style={{ width: '71%', background: '#2e7d32', borderRadius: '99px 0 0 99px' }}
                  ></div>
                  <div
                    className="dash-confidence-bar-segment"
                    style={{ width: '21%', background: '#e65100' }}
                  ></div>
                  <div
                    className="dash-confidence-bar-segment"
                    style={{ width: '8%', background: '#c33', borderRadius: '0 99px 99px 0' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tip Banner */}
          <div className="dash-tip-card">
            <div className="dash-tip-title">3 submissions require your review</div>
            <div className="dash-tip-body">
              Maya Rodriguez and Priya Okafor's submissions have been flagged for low AI confidence
              scores. One additional submission has a semantic similarity below 0.50, suggesting a
              potential mismatch. Review these before finalizing grades.
            </div>
            <div className="dash-tip-actions">
              <button className="dash-btn-white">Review Flagged &rarr;</button>
              <button className="dash-btn-outline-white">Dismiss</button>
            </div>
          </div>
      </div>
    </>
  );
}

export default DashboardPage;
