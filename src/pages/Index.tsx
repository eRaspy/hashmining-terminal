import React, { useState } from 'react';
import { Mining } from '../components/Mining';
import { Statistics } from '../components/Statistics';
import { Wallet } from '../components/Wallet';

const MOCK_USERNAME = "TestUser"; // In real app, this would come from Telegram

const Index = () => {
  const [activeTab, setActiveTab] = useState('mining');
  const [balance, setBalance] = useState(0);

  return (
    <div className="min-h-screen bg-terminal-bg p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-between border-b border-terminal-text">
          <button
            className={`terminal-tab ${activeTab === 'mining' ? 'active' : ''}`}
            onClick={() => setActiveTab('mining')}
          >
            Mining
          </button>
          <button
            className={`terminal-tab ${activeTab === 'improvements' ? 'active' : ''}`}
            onClick={() => setActiveTab('improvements')}
          >
            Improvements
          </button>
          <button
            className={`terminal-tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
          <button
            className={`terminal-tab ${activeTab === 'statistics' ? 'active' : ''}`}
            onClick={() => setActiveTab('statistics')}
          >
            Statistics
          </button>
          <button
            className={`terminal-tab ${activeTab === 'wallet' ? 'active' : ''}`}
            onClick={() => setActiveTab('wallet')}
          >
            Wallet
          </button>
        </div>

        <div className="terminal-cursor">
          {activeTab === 'mining' && <Mining username={MOCK_USERNAME} />}
          {activeTab === 'improvements' && (
            <div className="terminal-window">
              <h2 className="text-xl mb-4">Improvements</h2>
              <p>Coming soon...</p>
            </div>
          )}
          {activeTab === 'tasks' && (
            <div className="terminal-window">
              <h2 className="text-xl mb-4">Tasks</h2>
              <p>Coming soon...</p>
            </div>
          )}
          {activeTab === 'statistics' && <Statistics />}
          {activeTab === 'wallet' && (
            <Wallet username={MOCK_USERNAME} balance={balance} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;