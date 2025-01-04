import { sha256 } from 'crypto-js';

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

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.reward = 100; // Initial reward
    this.totalSupply = 21000000; // Total ZRA tokens
    this.minedSupply = 0;
    this.blockCount = 0;
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
    return sha256(
      block.index +
      block.previousHash +
      block.timestamp +
      JSON.stringify(block.data) +
      block.nonce
    ).toString();
  }

  public async mineBlock(data: any, miner: string): Promise<Block | null> {
    if (this.minedSupply >= this.totalSupply) {
      console.log("All tokens have been mined!");
      return null;
    }

    const previousBlock = this.getLatestBlock();
    const newBlock: Omit<Block, "hash"> = {
      index: previousBlock.index + 1,
      timestamp: Date.now(),
      data,
      previousHash: previousBlock.hash,
      nonce: 0,
      miner,
    };

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
    
    // Adjust difficulty every 10 blocks based on mining speed
    if (this.blockCount % 10 === 0) {
      this.adjustDifficulty();
    }

    // Reduce reward every 50,000 blocks
    if (this.blockCount % 50000 === 0) {
      this.reduceReward();
    }

    this.minedSupply += this.reward;
    return block;
  }

  private adjustDifficulty() {
    const lastTenBlocks = this.chain.slice(-10);
    const averageTime = lastTenBlocks.reduce((sum, block, index) => {
      if (index === 0) return 0;
      return sum + (block.timestamp - lastTenBlocks[index - 1].timestamp);
    }, 0) / 9;

    // Target block time is 60 seconds
    if (averageTime < 55000) { // Too fast
      this.difficulty++;
    } else if (averageTime > 65000) { // Too slow
      this.difficulty = Math.max(1, this.difficulty - 1);
    }
  }

  private reduceReward() {
    if (this.reward > 10) {
      this.reward = Math.max(10, this.reward * 0.95);
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
}

export const blockchain = new Blockchain();