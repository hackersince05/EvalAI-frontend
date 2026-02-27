import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import './GradingDetail.css';

// ── Circular progress ring ─────────────────────────────────────────────────
function CircularProgress({ value, max, size = 104, strokeWidth = 9 }) {
  const radius        = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct           = max > 0 ? Math.min(value / max, 1) : 0;
  const offset        = circumference * (1 - pct);
  const color         = pct >= 0.75 ? '#10b981' : pct >= 0.5 ? '#f59e0b' : '#ef4444';

  return (
    // Rotate so the arc starts at 12 o'clock instead of 3 o'clock
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {/* Track */}
      <circle cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="#e0e0e0" strokeWidth={strokeWidth} />
      {/* Progress arc */}
      <circle cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────
function gradeLabel(pct) {
  if (pct === null) return 'Not Graded';
  if (pct >= 90) return 'Excellent';
  if (pct >= 75) return 'Good';
  if (pct >= 60) return 'Satisfactory';
  return 'Needs Improvement';
}

function wordCount(text) {
  return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

// ── Component ──────────────────────────────────────────────────────────────
function GradingDetail({ submission, onNavigate }) {
  const [answers,      setAnswers]      = useState([]);
  const [overrides,    setOverrides]    = useState({});  // { [answerId]: string }
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [overrideMode, setOverrideMode] = useState(false);
  const [toast,        setToast]        = useState('');
  const [status,       setStatus]       = useState(submission?.status ?? '');

  // ── Fetch answers (with question details) for this submission ─────────────
  const fetchAnswers = useCallback(async () => {
    if (!submission) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('answers')
      .select(`
        id,
        answer_text,
        ai_score,
        marks_awarded,
        questions ( id, text, marks, sample_answer, order_index )
      `)
      .eq('submission_id', submission.id);

    if (error || !data) {
      setLoading(false);
      return;
    }

    // Sort by the question's original order_index
    const sorted = [...data].sort(
      (a, b) => (a.questions?.order_index ?? 0) - (b.questions?.order_index ?? 0)
    );

    setAnswers(sorted);

    // Pre-fill overrides with any existing marks_awarded values
    const init = {};
    sorted.forEach(a => {
      init[a.id] = a.marks_awarded !== null ? String(a.marks_awarded) : '';
    });
    setOverrides(init);
    setLoading(false);
  }, [submission]);

  useEffect(() => {
    fetchAnswers();
    setStatus(submission?.status ?? '');
  }, [fetchAnswers, submission]);

  // ── Save grades to DB ─────────────────────────────────────────────────────
  const handleSaveGrades = async () => {
    setSaving(true);
    try {
      // Update marks_awarded for each answer that has a value
      for (const answer of answers) {
        const val = parseInt(overrides[answer.id], 10);
        if (!isNaN(val)) {
          const { error } = await supabase
            .from('answers')
            .update({ marks_awarded: val })
            .eq('id', answer.id);
          if (error) throw error;
        }
      }

      // Mark submission as Graded
      const { error: sErr } = await supabase
        .from('submissions')
        .update({ status: 'Graded' })
        .eq('id', submission.id);
      if (sErr) throw sErr;

      setStatus('Graded');
      setOverrideMode(false);
      showToast('Grades saved successfully.');
      await fetchAnswers(); // refresh marks_awarded in state
    } catch (err) {
      showToast('Failed to save grades. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // ── Guard ─────────────────────────────────────────────────────────────────
  if (!submission) {
    return (
      <div className="gd-page">
        <div className="gd-empty">
          No submission selected.{' '}
          <button onClick={() => onNavigate('grading')}>Return to queue</button>
        </div>
      </div>
    );
  }

  // ── Derived totals ────────────────────────────────────────────────────────
  const totalMarks   = answers.reduce((sum, a) => sum + (a.questions?.marks ?? 0), 0);
  const awardedMarks = answers.reduce((sum, a) => sum + (a.marks_awarded ?? 0), 0);
  const pct          = status === 'Graded' && totalMarks > 0
    ? Math.round((awardedMarks / totalMarks) * 100)
    : null;

  return (
    <div className="gd-page">

      {/* Topbar */}
      <div className="gd-topbar">
        <nav className="gd-breadcrumb">
          <button className="gd-crumb-link" onClick={() => onNavigate('grading')}>
            Grading Queue
          </button>
          <span className="gd-crumb-sep">/</span>
          <span className="gd-crumb-link">{submission.assessmentTitle}</span>
          <span className="gd-crumb-sep">/</span>
          <span className="gd-crumb-current">{submission.studentName}</span>
        </nav>
        <div className="gd-topbar-actions">
          {!overrideMode && status !== 'Graded' && (
            <button className="gd-btn-primary" onClick={() => setOverrideMode(true)}>
              Grade Submission
            </button>
          )}
          {!overrideMode && status === 'Graded' && (
            <button className="gd-btn-ghost" onClick={() => setOverrideMode(true)}>
              Edit Grades
            </button>
          )}
        </div>
      </div>

      {/* Page body */}
      <div className="gd-body">

        {/* Title row */}
        <div className="gd-title-row">
          <div>
            <h1 className="gd-title">{submission.assessmentTitle}</h1>
            <div className="gd-meta">
              {submission.studentName}&nbsp;&bull;&nbsp;Submitted {submission.date}
            </div>
          </div>
          <span className={`gd-badge-complete ${status !== 'Graded' ? 'gd-badge-pending' : ''}`}>
            {status === 'Graded' ? 'Graded' : 'Pending Review'}
          </span>
        </div>

        {/* Metric cards */}
        <div className="gd-metrics-row">
          <div className="gd-metric-card">
            <div className="gd-metric-label">Questions</div>
            <div className="gd-metric-value gd-metric-dark">
              {loading ? '—' : answers.length}
            </div>
            <div className="gd-metric-sub">in this submission</div>
          </div>

          <div className="gd-metric-card">
            <div className="gd-metric-label">Total Marks</div>
            <div className="gd-metric-value gd-metric-dark">
              {loading ? '—' : totalMarks}
            </div>
            <div className="gd-metric-sub">available</div>
          </div>

          <div className="gd-metric-card">
            <div className="gd-metric-label">Marks Awarded</div>
            <div
              className="gd-metric-value"
              style={{
                color: pct !== null
                  ? (pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444')
                  : '#999',
              }}
            >
              {status === 'Graded' ? awardedMarks : '—'}
            </div>
            <div className="gd-metric-sub">
              {pct !== null ? `${pct}% score` : 'not yet graded'}
            </div>
          </div>

          <div className="gd-metric-card">
            <div className="gd-metric-label">Status</div>
            <div className={`gd-metric-value ${status === 'Graded' ? 'gd-metric-pass' : 'gd-metric-dark'}`}>
              {status === 'Graded' ? 'Graded' : 'Pending'}
            </div>
            <div className="gd-metric-sub">submission status</div>
          </div>
        </div>

        {/* Main 2-column layout */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#aaa', fontSize: 14 }}>
            Loading answers…
          </div>
        ) : (
          <div className="gd-main">

            {/* Left: one card per question */}
            <div className="gd-content">
              {answers.length === 0 ? (
                <div className="gd-section-card" style={{ textAlign: 'center', color: '#aaa', fontSize: 14 }}>
                  No answers found for this submission.
                </div>
              ) : (
                answers.map((a, idx) => (
                  <div key={a.id}>

                    {/* Question prompt */}
                    <div className="gd-section-card">
                      <div className="gd-section-header">
                        <span className="gd-section-label">Question {idx + 1}</span>
                        <span className="gd-max-pts">Max: {a.questions?.marks ?? 0} marks</span>
                      </div>
                      <p className="gd-prompt-text">{a.questions?.text ?? '—'}</p>

                      {/* Reference answer */}
                      {a.questions?.sample_answer && (
                        <div className="gd-sample-answer-box">
                          <div className="gd-sample-answer-label">Reference Answer</div>
                          <p className="gd-sample-answer-text">{a.questions.sample_answer}</p>
                        </div>
                      )}
                    </div>

                    {/* Student answer */}
                    <div className="gd-section-card">
                      <div className="gd-section-header">
                        <span className="gd-section-label">Student Answer</span>
                        <span className="gd-word-count">
                          Word count: {wordCount(a.answer_text)}
                        </span>
                      </div>
                      <div className="gd-answer-box">
                        {a.answer_text
                          ? a.answer_text.split('\n\n').map((para, i) => <p key={i}>{para}</p>)
                          : <p style={{ color: '#aaa' }}>No answer submitted.</p>
                        }
                      </div>
                      {a.marks_awarded !== null && (
                        <div className="gd-awarded-badge">
                          Awarded: {a.marks_awarded} / {a.questions?.marks ?? 0} marks
                        </div>
                      )}
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Right: grade sidebar */}
            <aside className="gd-sidebar">

              {/* Overall grade */}
              <div className="gd-side-card">
                <div className="gd-grade-header">Overall Grade</div>
                <div className="gd-score-circle-wrap">
                  <div className="gd-score-ring">
                    <CircularProgress
                      value={status === 'Graded' ? awardedMarks : 0}
                      max={totalMarks > 0 ? totalMarks : 1}
                    />
                    <div className="gd-score-overlay">
                      {status === 'Graded' ? (
                        <>
                          <span className="gd-score-num">{awardedMarks}</span>
                          <span className="gd-score-denom">/{totalMarks}</span>
                        </>
                      ) : (
                        <span className="gd-score-pending">—</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="gd-grade-label">{gradeLabel(pct)}</div>
                {pct !== null && <div className="gd-grade-pct">{pct}% Score</div>}
              </div>

              {/* Submission info */}
              <div className="gd-side-card">
                {[
                  { label: 'Student',    value: submission.studentName    },
                  { label: 'Assessment', value: submission.assessmentTitle },
                  { label: 'Status',     value: status                    },
                  { label: 'Submitted',  value: submission.date           },
                ].map(row => (
                  <div key={row.label} className="gd-info-row">
                    <span className="gd-info-label">{row.label}</span>
                    <span className="gd-info-value">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Manual grading */}
              <div className="gd-side-card">
                <h3 className="gd-override-title">Manual Grading</h3>
                {!overrideMode ? (
                  <>
                    <p className="gd-override-desc">
                      {status === 'Graded'
                        ? 'Grades have been saved. Click "Edit Grades" in the toolbar to make changes.'
                        : 'Review the answers and enter marks for each question.'}
                    </p>
                    {status !== 'Graded' && (
                      <button className="gd-btn-override" onClick={() => setOverrideMode(true)}>
                        Enter Grades
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <p className="gd-override-desc">Enter marks for each question below.</p>
                    {answers.map((a, idx) => (
                      <div key={a.id} className="gd-override-row">
                        <label className="gd-override-field-label">Q{idx + 1}</label>
                        <input
                          className="gd-override-input"
                          type="number"
                          min="0"
                          max={a.questions?.marks ?? 0}
                          value={overrides[a.id] ?? ''}
                          onChange={(e) =>
                            setOverrides(prev => ({ ...prev, [a.id]: e.target.value }))
                          }
                        />
                        <span className="gd-override-max">/ {a.questions?.marks ?? 0}</span>
                      </div>
                    ))}
                    <div className="gd-override-actions">
                      <button
                        className="gd-btn-ghost-sm"
                        onClick={() => setOverrideMode(false)}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        className="gd-btn-primary-sm"
                        onClick={handleSaveGrades}
                        disabled={saving}
                      >
                        {saving ? 'Saving…' : 'Save Grades'}
                      </button>
                    </div>
                  </>
                )}
              </div>

            </aside>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && <div className="gd-toast">{toast}</div>}

    </div>
  );
}

export default GradingDetail;
