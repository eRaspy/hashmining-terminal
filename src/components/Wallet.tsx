import React from 'react';

interface WalletProps {
  username: string;
  balance: number;
}

export const Wallet: React.FC<WalletProps> = ({ username, balance }) => {
  return (
    <div className="terminal-window">
      <h2 className="text-xl mb-4">Wallet</h2>
      <div className="space-y-2">
        <p>Owner: {username}</p>
        <p>Balance: {balance.toFixed(2)} ZRA</p>
        <div className="mt-4 p-4 border border-terminal-text rounded">
          <p className="text-terminal-highlight">Transaction History</p>
          <p className="text-sm mt-2">No transactions yet</p>
        </div>
      </div>
    </div>
  );
};