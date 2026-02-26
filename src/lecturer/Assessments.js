import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../UserContext';
import './Assessments.css';

const FILTERS = ['All', 'Draft', 'Active', 'Closed'];

// A single blank question entry used when adding a new question
const BLANK_QUESTION = {
  text:         '',
  marks:        '',
  answerLength: 'medium',
  sampleAnswer: '',
};

const BLANK_FORM = {
  title:     '',
  topic:     '',
  questions: [{ ...BLANK_QUESTION }],
};

// ── Helpers ────────────────────────────────────────────────────────────────
function statusClass(s) {
  return { Active: 'assess-badge-active', Draft: 'assess-badge-draft', Closed: 'assess-badge-closed' }[s] ?? '';
}

// ── Component ──────────────────────────────────────────────────────────────
function Assessments({ onNavigate }) {
  const { user } = useUser();

  const [assessments,  setAssessments]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [fetchError,   setFetchError]   = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [panelOpen,    setPanelOpen]    = useState(false);
  const [form,         setForm]         = useState(BLANK_FORM);
  const [saving,       setSaving]       = useState(false);
  const [toast,        setToast]        = useState('');

  // ── Fetch assessments from Supabase ───────────────────────────────────────
  const fetchAssessments = useCallback(async () => {
    setLoading(true);
    setFetchError('');

    const { data, error } = await supabase
      .from('assessments')
      .select(`
        id,
        title,
        topic,
        status,
        created_at,
        questions ( id, marks )
      `)
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      setFetchError('Failed to load assessments.');
      setLoading(false);
      return;
    }

    // Derive question count and total marks from the nested questions array.
    // submissions will be wired up once the submissions table exists.
    const transformed = data.map(a => ({
      id:          a.id,
      title:       a.title,
      topic:       a.topic,
      status:      a.status,
      questions:   a.questions.length,
      maxMarks:    a.questions.reduce((sum, q) => sum + (q.marks || 0), 0),
      submissions: 0,
    }));

    setAssessments(transformed);
    setLoading(false);
  }, [user.id]);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  // ── Derived display values ────────────────────────────────────────────────
  const visible = activeFilter === 'All'
    ? assessments
    : assessments.filter(a => a.status === activeFilter);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === 'All' ? assessments.length : assessments.filter(a => a.status === f).length;
    return acc;
  }, {});

  // Auto-calculate total marks across all questions in the form
  const totalMarks = form.questions.reduce((sum, q) => sum + (parseInt(q.marks, 10) || 0), 0);

  // ── Form helpers ──────────────────────────────────────────────────────────
  const setTopField = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const setQuestionField = (idx, key) => (e) => {
    setForm(prev => {
      const questions = prev.questions.map((q, i) =>
        i === idx ? { ...q, [key]: e.target.value } : q
      );
      return { ...prev, questions };
    });
  };

  const addQuestion = () => {
    setForm(prev => ({ ...prev, questions: [...prev.questions, { ...BLANK_QUESTION }] }));
  };

  const removeQuestion = (idx) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx),
    }));
  };

  // ── Panel open / close ────────────────────────────────────────────────────
  const openPanel  = () => { setForm(BLANK_FORM); setPanelOpen(true); };
  const closePanel = () => { if (!saving) setPanelOpen(false); };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // ── Write to Supabase ─────────────────────────────────────────────────────
  const saveAssessment = async (status) => {
    setSaving(true);
    try {
      // Step 1: insert the assessment row
      const { data: assessment, error: aErr } = await supabase
        .from('assessments')
        .insert({ title: form.title, topic: form.topic, status, created_by: user.id })
        .select()
        .single();

      if (aErr) throw aErr;

      // Step 2: insert all questions linked to the new assessment
      const { error: qErr } = await supabase
        .from('questions')
        .insert(
          form.questions.map((q, i) => ({
            assessment_id: assessment.id,
            order_index:   i,
            text:          q.text,
            marks:         parseInt(q.marks, 10) || 0,
            answer_length: q.answerLength,
            sample_answer: q.sampleAnswer,
          }))
        );

      if (qErr) throw qErr;

      closePanel();
      showToast(status === 'Draft'
        ? 'Assessment saved as draft.'
        : 'Assessment published successfully.'
      );
      fetchAssessments();   // refresh the table
    } catch (err) {
      showToast('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    saveAssessment('Draft');
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!form.title.trim() || form.questions.some(q => !q.text.trim())) return;
    saveAssessment('Active');
  };

  return (
    <div className="assess-page">

      {/* Topbar */}
      <div className="assess-topbar">
        <div>
          <div className="assess-topbar-title">Assessments</div>
          <div className="assess-topbar-sub">
            {loading ? 'Loading…' : `${assessments.length} assessment${assessments.length !== 1 ? 's' : ''} total`}
          </div>
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
        {fetchError ? (
          <div className="assess-empty" style={{ color: '#c33' }}>{fetchError}</div>
        ) : (
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="assess-empty">Loading assessments…</td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={7} className="assess-empty">
                    {activeFilter === 'All'
                      ? 'No assessments yet. Click "+ Create Assessment" to get started.'
                      : `No ${activeFilter.toLowerCase()} assessments.`}
                  </td>
                </tr>
              ) : (
                visible.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div className="assess-row-title">{a.title}</div>
                      <div className="assess-row-id">{a.id.slice(0, 8)}…</div>
                    </td>
                    <td className="assess-row-topic">{a.topic || '—'}</td>
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
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Toast */}
      {toast && <div className="assess-toast">{toast}</div>}

      {/* Backdrop */}
      {panelOpen && <div className="assess-backdrop" onClick={closePanel} />}

      {/* Slide-out create panel */}
      <aside className={`assess-panel ${panelOpen ? 'open' : ''}`}>
        <div className="assess-panel-header">
          <div className="assess-panel-title">Create Assessment</div>
          <button className="assess-panel-close" onClick={closePanel} disabled={saving}>&#x2715;</button>
        </div>

        <form className="assess-panel-form">

          {/* ── Assessment-level fields ── */}
          <div className="assess-field">
            <label className="assess-label">Assessment Title</label>
            <input
              className="assess-input"
              type="text"
              placeholder="e.g. CS-401 Midterm"
              value={form.title}
              onChange={setTopField('title')}
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
              onChange={setTopField('topic')}
            />
          </div>

          {/* ── Questions section ── */}
          <div className="assess-q-section">
            <div className="assess-q-section-header">
              <span>Questions ({form.questions.length})</span>
              {totalMarks > 0 && (
                <span className="assess-q-total">Total: {totalMarks} marks</span>
              )}
            </div>

            {form.questions.map((q, idx) => (
              <div key={idx} className="assess-q-card">
                <div className="assess-q-card-header">
                  <span className="assess-q-card-num">Question {idx + 1}</span>
                  {form.questions.length > 1 && (
                    <button
                      type="button"
                      className="assess-q-remove-btn"
                      onClick={() => removeQuestion(idx)}
                      title="Remove question"
                    >
                      &#x2715;
                    </button>
                  )}
                </div>

                <div className="assess-field">
                  <label className="assess-label">Question Text</label>
                  <textarea
                    className="assess-textarea assess-textarea-lg"
                    placeholder="Enter the question prompt students will see..."
                    value={q.text}
                    onChange={setQuestionField(idx, 'text')}
                    required
                  />
                </div>

                <div className="assess-field-row">
                  <div className="assess-field">
                    <label className="assess-label">Marks</label>
                    <input
                      className="assess-input"
                      type="number"
                      min="1"
                      placeholder="e.g. 20"
                      value={q.marks}
                      onChange={setQuestionField(idx, 'marks')}
                    />
                  </div>
                  <div className="assess-field">
                    <label className="assess-label">Expected Length</label>
                    <select
                      className="assess-select"
                      value={q.answerLength}
                      onChange={setQuestionField(idx, 'answerLength')}
                    >
                      <option value="short">Short (1–2 sentences)</option>
                      <option value="medium">Medium (1–2 paragraphs)</option>
                      <option value="long">Long (essay / extended)</option>
                    </select>
                  </div>
                </div>

                <div className="assess-field">
                  <label className="assess-label">Sample Answer</label>
                  <div className="assess-sample-hint">
                    Reference answer the SBERT model scores submissions against.
                  </div>
                  <textarea
                    className="assess-textarea assess-textarea-lg"
                    placeholder="Enter the model answer here..."
                    value={q.sampleAnswer}
                    onChange={setQuestionField(idx, 'sampleAnswer')}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              className="assess-add-q-btn"
              onClick={addQuestion}
            >
              + Add Question
            </button>
          </div>

          <div className="assess-panel-footer">
            <button type="button" className="assess-btn-ghost" onClick={closePanel} disabled={saving}>
              Cancel
            </button>
            <button type="button" className="assess-btn-ghost" onClick={handleSaveDraft} disabled={saving}>
              {saving ? 'Saving…' : 'Save as Draft'}
            </button>
            <button type="submit" className="assess-btn-primary" onClick={handlePublish} disabled={saving}>
              {saving ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

export default Assessments;
