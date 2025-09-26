import React from 'react';
import { MessageSquare, Users } from 'lucide-react';
import './TabNavigation.css';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'MessageSquare':
        return <MessageSquare size={20} />;
      case 'Users':
        return <Users size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="tab-navigation">
      <div className="tab-list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <div className="tab-icon">
              {getIcon(tab.icon)}
            </div>
            <div className="tab-content">
              <span className="tab-label">{tab.label}</span>
              {tab.description && (
                <span className="tab-description">{tab.description}</span>
              )}
            </div>
            {activeTab === tab.id && <div className="tab-indicator" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
