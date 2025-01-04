import React from 'react';
import { blockchain } from '../utils/blockchain';

export const Statistics: React.FC = () => {
  return (
    <div className="terminal-window">
      <h2 className="text-xl mb-4">Blockchain Statistics</h2>
      <div className="space-y-2">
        <p>Total Supply: {blockchain.getTotalSupply()} ZRA</p>
        <p>Mined Supply: {blockchain.getMinedSupply().toFixed(2)} ZRA</p>
        <p>Blocks Mined: {blockchain.getBlockCount()}</p>
        <p>Current Difficulty: {blockchain.getCurrentDifficulty()}</p>
        <p>Current Block Reward: {blockchain.getCurrentReward().toFixed(2)} ZRA</p>
      </div>
    </div>
  );
};