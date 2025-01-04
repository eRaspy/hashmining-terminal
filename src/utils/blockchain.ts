import { SHA256 } from 'crypto-js';

export interface Block {
  index: number;
  timestamp: number;
  data: any;
  previousHash: string;
  hash: string;
  nonce: number;
  miner: string;
}

export class Blockchain {
  private chain: Block[];
  private difficulty: number;
  private reward: number;
  private totalSupply: number;
  private minedSupply: number;
  private blockCount: number;
  private activeMiners: Set<string>;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.reward = 100; // Initial reward
    this.totalSupply = 21000000; // Total ZRA tokens
    this.minedSupply = 0;
    this.blockCount = 0;
    this.activeMiners = new Set();
  }

  private createGenesisBlock(): Block {
    return {
      index: 0,
      timestamp: Date.now(),
      data: "Genesis Block",
      previousHash: "0",
      hash: "0",
      nonce: 0,
      miner: "Genesis",
    };
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  public calculateHash(block: Omit<Block, "hash">): string {
    return SHA256(
      block.index +
      block.previousHash +
      block.timestamp +
      JSON.stringify(block.data) +
      block.nonce
    ).toString();
  }

  public addMiner(minerId: string) {
    this.activeMiners.add(minerId);
    console.log(`Miner ${minerId} joined. Total miners: ${this.activeMiners.size}`);
    this.adjustDifficultyByMiners();
  }

  public removeMiner(minerId: string) {
    this.activeMiners.delete(minerId);
    console.log(`Miner ${minerId} left. Total miners: ${this.activeMiners.size}`);
    this.adjustDifficultyByMiners();
  }

  private adjustDifficultyByMiners() {
    // Adjust difficulty based on number of active miners
    const minerCount = this.activeMiners.size;
    if (minerCount <= 5) {
      this.difficulty = 4;
    } else if (minerCount <= 10) {
      this.difficulty = 5;
    } else {
      this.difficulty = Math.min(6 + Math.floor(Math.log2(minerCount - 10)), 8);
    }
    console.log(`Difficulty adjusted to: ${this.difficulty}`);
  }

  public async mineBlock(data: any, miner: string): Promise<Block | null> {
    if (this.minedSupply >= this.totalSupply) {
      console.log("All tokens have been mined!");
      return null;
    }

    this.addMiner(miner);
    console.log(`Starting mining process for miner: ${miner}`);

    const previousBlock = this.getLatestBlock();
    const newBlock: Omit<Block, "hash"> = {
      index: previousBlock.index + 1,
      timestamp: Date.now(),
      data,
      previousHash: previousBlock.hash,
      nonce: 0,
      miner,
    };

    try {
      let hash = this.calculateHash(newBlock);
      while (!hash.startsWith("0".repeat(this.difficulty))) {
        newBlock.nonce++;
        hash = this.calculateHash(newBlock);
        // Add small delay to prevent browser from freezing
        if (newBlock.nonce % 100 === 0) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }

      const block: Block = { ...newBlock, hash };
      this.chain.push(block);
      this.blockCount++;
      
      // Calculate rewards
      const totalReward = this.getCurrentReward();
      const minerReward = totalReward * 0.7; // 70% for the winning miner
      const sharedReward = (totalReward * 0.3) / Math.max(1, this.activeMiners.size - 1); // 30% split among other miners

      // Distribute rewards (in a real implementation, this would update balances)
      console.log(`Miner ${miner} received ${minerReward} ZRA`);
      this.activeMiners.forEach(activeMiner => {
        if (activeMiner !== miner) {
          console.log(`Participant ${activeMiner} received ${sharedReward} ZRA`);
        }
      });

      // Adjust difficulty every 10 blocks
      if (this.blockCount % 10 === 0) {
        this.adjustDifficultyByMiners();
      }

      // Reduce reward every 50,000 blocks
      if (this.blockCount % 50000 === 0) {
        this.reduceReward();
      }

      this.minedSupply += totalReward;
      this.removeMiner(miner);
      return block;

    } catch (error) {
      console.error("Mining error:", error);
      this.removeMiner(miner);
      throw error;
    }
  }

  private reduceReward() {
    if (this.reward > 10) {
      this.reward = Math.max(10, this.reward * 0.95);
      console.log(`Block reward reduced to: ${this.reward} ZRA`);
    }
  }

  public getCurrentDifficulty(): number {
    return this.difficulty;
  }

  public getCurrentReward(): number {
    return this.reward;
  }

  public getMinedSupply(): number {
    return this.minedSupply;
  }

  public getTotalSupply(): number {
    return this.totalSupply;
  }

  public getBlockCount(): number {
    return this.blockCount;
  }

  public getActiveMiners(): number {
    return this.activeMiners.size;
  }
}

export const blockchain = new Blockchain();