import React from 'react';
import './Assessments.css';

function Dashboard() {
  return (
    <>
      {/* Header */}
      <header className="top-header">
        <div className="breadcrumb">
          <span>Assessments / Cognitive Psych /</span>
          <strong>Assignment 3: Memory Models</strong>
        </div>
        <div className="header-right">
          <span className="last-saved">Last saved 2m ago</span>
          <button className="nav-button previous">Previous</button>
          <button className="nav-button next">Next Submission</button>
        </div>
      </header>

      <div className="content-wrapper">
          {/* Left Section - Submission */}
          <section className="submission-section">
            <div className="completion-badge">AI Evaluation Complete</div>
            <h1 className="submission-title">Student Submission: Alex Johnson</h1>
            <p className="submission-meta">Submitted Oct 24, 2024 at 14:30 PM • ID: #88219</p>

            <div className="action-buttons">
              <button className="btn btn-flag">Flag for Review</button>
              <button className="btn btn-finalize">Finalize Grade</button>
            </div>

            {/* Question */}
            <div className="question-section">
              <div className="question-header">
                <span className="question-number">QUESTION 4 OF 5</span>
                <span className="question-tag">Theory</span>
              </div>
              <h3 className="question-text">
                Explain the difference between Episodic and Semantic memory using original examples.
              </h3>

              <div className="reference-answer">
                <p className="reference-label">Reference Answer (Hidden from Student)</p>
                <p className="reference-text">
                  Episodic memory involves personal experiences tagged with time/place context (autobiographical). Semantic memory involves factual knowledge independent of context. Key distinction: "Remembering" vs "Knowing"
                </p>
              </div>
            </div>

            {/* Student Response */}
            <div className="student-response-section">
              <h3 className="response-title">Student Response</h3>
              <p className="response-text">
                Episodic memory refers to the ability to recall specific events from one's own life, like a mental time travel. It is subjective and context-dependent. For example, I remember specifically eating pancakes for breakfast this morning at 8 AM in my kitchen.
              </p>
              <p className="response-text">
                On the other hand, Semantic memory is about general knowledge of the world that isn't tied to a specific experience of learning it. It's like an encyclopedia. For instance, I know that Paris is the capital of France, but I don't remember the moment I learned that fact. The main difference is that episodic is about "remembering" an event, while semantic is just "knowing" a fact.
              </p>
            </div>
          </section>

          {/* Right Section - Scoring */}
          <aside className="scoring-section">
            <div className="score-card">
              <h3>AI Suggested Score</h3>
              <div className="score-display">
                <div className="score-number">92</div>
                <div className="score-total">/100</div>
              </div>
              <div className="confidence-bar">
                <div className="confidence-fill"></div>
                <p className="confidence-text">High Confidence (0.94)</p>
              </div>
            </div>

            <div className="metrics-card">
              <div className="metric">
                <div className="metric-header">
                  <label>Conceptual Accuracy</label>
                  <span className="metric-score">10/10</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '100%'}}></div>
                </div>
                <p className="metric-note">Correctly defined both terms.</p>
              </div>

              <div className="metric">
                <div className="metric-header">
                  <label>Examples Provided</label>
                  <span className="metric-score">9/10</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '90%'}}></div>
                </div>
                <p className="metric-note">Valid original examples used.</p>
              </div>

              <div className="metric">
                <div className="metric-header">
                  <label>Differentiation</label>
                  <span className="metric-score">8.5/10</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '85%'}}></div>
                </div>
                <p className="metric-note">Clear distinction made.</p>
              </div>
            </div>

            <div className="semantic-analysis">
              <h4>Semantic Analysis</h4>
              <div className="similarity-metric">
                <p className="metric-label">Similarity Vector</p>
                <div className="vector-bar">
                  <div className="vector-fill" style={{width: '68%'}}></div>
                </div>
                <p className="metric-value">0.68</p>
              </div>
              <div className="key-concepts">
                <p className="concepts-label">Key Concepts Detected:</p>
                <div className="concept-tags">
                  <span className="tag">Context-dependent</span>
                  <span className="tag">Subjective</span>
                  <span className="tag">Encyclopedia</span>
                  <span className="tag">Time travel</span>
                </div>
              </div>
            </div>

            <div className="feedback-section">
              <h4>Feedback</h4>
              <p className="feedback-editable">Excellent work distinguishing between the two memory types. Your example of pancakes for episodic memory was particularly strong as it included specific temporal context. The analogy to an encyclopedia for semantic memory is insightful.</p>
              <p className="feedback-note">Editable</p>
            </div>
          </aside>
        </div>
    </>
  );
}

export default Dashboard;
