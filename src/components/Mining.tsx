import React, { useState, useEffect } from 'react';
import { blockchain } from '../utils/blockchain';

interface MiningProps {
  username: string;
}

export const Mining: React.FC<MiningProps> = ({ username }) => {
  const [isMining, setIsMining] = useState(false);
  const [balance, setBalance] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [recentBlocks, setRecentBlocks] = useState<any[]>([]);

  const startMining = async () => {
    if (isMining || energy <= 0) return;
    
    setIsMining(true);
    console.log("Starting mining process...");
    
    try {
      const block = await blockchain.mineBlock({ miner: username }, username);
      if (block) {
        setBalance(prev => prev + blockchain.getCurrentReward());
        setRecentBlocks(prev => [block, ...prev].slice(0, 5));
        console.log("Block mined!", block);
      }
    } catch (error) {
      console.error("Mining error:", error);
    } finally {
      setIsMining(false);
      setEnergy(prev => Math.max(0, prev - 10));
    }
  };

  useEffect(() => {
    const energyRecovery = setInterval(() => {
      setEnergy(prev => Math.min(100, prev + 1));
    }, 10000);

    return () => clearInterval(energyRecovery);
  }, []);

  return (
    <div className="terminal-window">
      <div className="mb-6">
        <h2 className="text-xl mb-4">Profile</h2>
        <p>Username: {username}</p>
        <p>Balance: {balance.toFixed(2)} ZRA</p>
        <p>Energy: {energy}%</p>
        <p>Status: {isMining ? "Mining..." : "Idle"}</p>
      </div>

      <button
        className="terminal-button mb-6"
        onClick={startMining}
        disabled={isMining || energy <= 0}
      >
        {isMining ? "Mining..." : "Start Mining"}
      </button>

      <div>
        <h3 className="text-lg mb-2">Recent Blocks</h3>
        {recentBlocks.map((block, index) => (
          <div key={index} className="mb-2 text-sm">
            <p>Block #{block.index}</p>
            <p>Miner: {block.miner}</p>
            <p>Hash: {block.hash.substring(0, 20)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};