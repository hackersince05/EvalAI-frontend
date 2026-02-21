import React, { useState } from 'react';
import './Assessments.css';

// ── Mock data ──────────────────────────────────────────────────────────────
const MOCK_ASSESSMENTS = [
  { id: 'A001', title: 'CS-401 Midterm',    topic: 'Theory of Computation', questions: 5, maxMarks: 100, submissions: 48, status: 'Active'  },
  { id: 'A002', title: 'CS-301 Quiz 2',     topic: 'Data Structures',        questions: 3, maxMarks: 30,  submissions: 0,  status: 'Draft'   },
  { id: 'A003', title: 'CS-201 Final',      topic: 'Algorithms',             questions: 8, maxMarks: 150, submissions: 62, status: 'Closed'  },
  { id: 'A004', title: 'CS-401 Quiz 1',     topic: 'Automata Theory',        questions: 4, maxMarks: 40,  submissions: 51, status: 'Closed'  },
  { id: 'A005', title: 'CS-501 Assignment', topic: 'Machine Learning',       questions: 2, maxMarks: 50,  submissions: 12, status: 'Active'  },
];

const FILTERS = ['All', 'Draft', 'Active', 'Closed'];

const BLANK_FORM = {
  title:        '',
  topic:        '',
  questionText: '',
  maxMarks:     '',
  answerLength: 'medium',
  sampleAnswer: '',
};

// ── Helpers ────────────────────────────────────────────────────────────────
function statusClass(s) {
  return { Active: 'assess-badge-active', Draft: 'assess-badge-draft', Closed: 'assess-badge-closed' }[s] ?? '';
}

// ── Component ──────────────────────────────────────────────────────────────
function Assessments({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [panelOpen, setPanelOpen]       = useState(false);
  const [form, setForm]                 = useState(BLANK_FORM);
  const [toast, setToast]               = useState('');

  const visible = activeFilter === 'All'
    ? MOCK_ASSESSMENTS
    : MOCK_ASSESSMENTS.filter(a => a.status === activeFilter);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === 'All' ? MOCK_ASSESSMENTS.length : MOCK_ASSESSMENTS.filter(a => a.status === f).length;
    return acc;
  }, {});

  const setField = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const openPanel  = () => { setForm(BLANK_FORM); setPanelOpen(true); };
  const closePanel = () => setPanelOpen(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    console.log('Draft saved:', form);
    closePanel();
    showToast('Assessment saved as draft.');
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!form.title || !form.questionText) return;
    console.log('Assessment published:', form);
    closePanel();
    showToast('Assessment published successfully.');
  };

  return (
    <div className="assess-page">

      {/* Topbar */}
      <div className="assess-topbar">
        <div>
          <div className="assess-topbar-title">Assessments</div>
          <div className="assess-topbar-sub">{MOCK_ASSESSMENTS.length} assessments total</div>
        </div>
        <button className="assess-btn-primary" onClick={openPanel}>
          + Create Assessment
        </button>
      </div>

      {/* Filter tabs */}
      <div className="assess-filter-row">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`assess-filter-tab ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
            <span className="assess-filter-count">{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* Assessments table */}
      <div className="assess-table-card">
        <table className="assess-table">
          <thead>
            <tr>
              <th>Assessment</th>
              <th>Topic</th>
              <th>Questions</th>
              <th>Max Marks</th>
              <th>Submissions</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(a => (
              <tr key={a.id}>
                <td>
                  <div className="assess-row-title">{a.title}</div>
                  <div className="assess-row-id">{a.id}</div>
                </td>
                <td className="assess-row-topic">{a.topic}</td>
                <td className="assess-row-num">{a.questions}</td>
                <td className="assess-row-num">{a.maxMarks}</td>
                <td className="assess-row-num">{a.submissions}</td>
                <td>
                  <span className={`assess-badge ${statusClass(a.status)}`}>{a.status}</span>
                </td>
                <td>
                  <div className="assess-row-actions">
                    <button className="assess-action-btn">Edit</button>
                    {a.status === 'Active' && (
                      <button
                        className="assess-action-btn assess-action-grade"
                        onClick={() => onNavigate('grading')}
                      >
                        Grade
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={7} className="assess-empty">
                  No {activeFilter.toLowerCase()} assessments.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Toast */}
      {toast && <div className="assess-toast">{toast}</div>}

      {/* Backdrop */}
      {panelOpen && <div className="assess-backdrop" onClick={closePanel} />}

      {/* Slide-out create panel */}
      <aside className={`assess-panel ${panelOpen ? 'open' : ''}`}>
        <div className="assess-panel-header">
          <div className="assess-panel-title">Create Assessment</div>
          <button className="assess-panel-close" onClick={closePanel}>&#x2715;</button>
        </div>

        <form className="assess-panel-form">

          <div className="assess-field">
            <label className="assess-label">Assessment Title</label>
            <input
              className="assess-input"
              type="text"
              placeholder="e.g. CS-401 Midterm"
              value={form.title}
              onChange={setField('title')}
              required
            />
          </div>

          <div className="assess-field">
            <label className="assess-label">Topic Tag</label>
            <input
              className="assess-input"
              type="text"
              placeholder="e.g. Theory of Computation"
              value={form.topic}
              onChange={setField('topic')}
            />
          </div>

          <div className="assess-field">
            <label className="assess-label">Question Text</label>
            <textarea
              className="assess-textarea assess-textarea-lg"
              placeholder="Enter the full question prompt students will see..."
              value={form.questionText}
              onChange={setField('questionText')}
              required
            />
          </div>

          <div className="assess-field-row">
            <div className="assess-field">
              <label className="assess-label">Max Marks</label>
              <input
                className="assess-input"
                type="number"
                min="1"
                placeholder="e.g. 20"
                value={form.maxMarks}
                onChange={setField('maxMarks')}
              />
            </div>
            <div className="assess-field">
              <label className="assess-label">Expected Answer Length</label>
              <select
                className="assess-select"
                value={form.answerLength}
                onChange={setField('answerLength')}
              >
                <option value="short">Short (1-2 sentences)</option>
                <option value="medium">Medium (1-2 paragraphs)</option>
                <option value="long">Long (essay / extended)</option>
              </select>
            </div>
          </div>

          <div className="assess-field">
            <label className="assess-label">Sample Answer</label>
            <div className="assess-sample-hint">
              This is the reference answer the SBERT model scores student submissions against.
            </div>
            <textarea
              className="assess-textarea assess-textarea-lg"
              placeholder="Enter the model answer here..."
              value={form.sampleAnswer}
              onChange={setField('sampleAnswer')}
            />
          </div>

          <div className="assess-panel-footer">
            <button type="button" className="assess-btn-ghost" onClick={closePanel}>
              Cancel
            </button>
            <button type="button" className="assess-btn-ghost" onClick={handleSaveDraft}>
              Save as Draft
            </button>
            <button type="submit" className="assess-btn-primary" onClick={handlePublish}>
              Publish
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

export default Assessments;
