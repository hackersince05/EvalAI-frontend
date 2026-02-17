import React from 'react';
import './Sidebar.css';

function Sidebar({ currentPage, onNavigate }) {
  const navItems = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'assessments', label: 'Assessments' },
    { key: 'grading', label: 'Grading Queue' },
    { key: 'rubrics', label: 'Rubrics' },
    { key: 'analytics', label: 'Analytics' },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <div className="logo-box">EvalAI</div>
      </div>
      <nav className="sidebar-menu">
        <div className="menu-label">MENU</div>
        <ul>
          {navItems.map((item) => (
            <li key={item.key} className={currentPage === item.key ? 'active' : ''}>
              <a
                href={`#${item.key}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.key);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <div className="settings-section">
          <a
            href="#settings"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('settings');
            }}
          >
            Settings
          </a>
        </div>
        <div className="user-profile">
          <div className="user-avatar">SC</div>
          <div className="user-info">
            <p className="user-name">Dr. Sarah Chen</p>
            <p className="user-role">Instructor</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
