import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { ProjectInfo, ContractInfo, ScanResult } from '../types';
import { SolidityParser } from './parser';

export class ProjectScanner {
  private parser: SolidityParser;

  constructor() {
    this.parser = new SolidityParser();
  }

  /**
   * Detect project type and scan for contracts
   */
  public async scanProject(rootPath: string): Promise<ScanResult> {
    const projectInfo = this.detectProjectType(rootPath);
    const contracts = new Map<string, ContractInfo>();

    // Scan all contract directories
    for (const contractDir of projectInfo.contractDirs) {
      const fullPath = path.join(rootPath, contractDir);
      if (fs.existsSync(fullPath)) {
        const contractFiles = await this.findSolidityFiles(fullPath);
        
        for (const filePath of contractFiles) {
          const contractInfo = this.parser.parseFile(filePath);
          if (contractInfo) {
            contracts.set(filePath, contractInfo);
          }
        }
      }
    }

    projectInfo.contracts = contracts;

    // Calculate statistics
    let totalFunctions = 0;
    let totalEvents = 0;
    let totalErrors = 0;

    contracts.forEach(contract => {
      totalFunctions += contract.functions.length;
      totalEvents += contract.events.length;
      totalErrors += contract.errors.length;
    });

    return {
      projectInfo,
      totalContracts: contracts.size,
      totalFunctions,
      totalEvents,
      totalErrors,
      scanTime: new Date()
    };
  }

  /**
   * Detect if project is Foundry, Hardhat, or unknown
   */
  private detectProjectType(rootPath: string): ProjectInfo {
    const foundryConfig = path.join(rootPath, 'foundry.toml');
    const hardhatConfigJs = path.join(rootPath, 'hardhat.config.js');
    const hardhatConfigTs = path.join(rootPath, 'hardhat.config.ts');

    let type: 'foundry' | 'hardhat' | 'unknown' = 'unknown';
    let contractDirs: string[] = [];

    if (fs.existsSync(foundryConfig)) {
      type = 'foundry';
      contractDirs = ['src', 'lib'];
    } else if (fs.existsSync(hardhatConfigJs) || fs.existsSync(hardhatConfigTs)) {
      type = 'hardhat';
      contractDirs = ['contracts'];
    } else {
      // Default fallback
      contractDirs = ['src', 'contracts'];
    }

    return {
      type,
      rootPath,
      contractDirs,
      contracts: new Map()
    };
  }

  /**
   * Find all Solidity files in a directory
   */
  private async findSolidityFiles(dirPath: string): Promise<string[]> {
    const pattern = path.join(dirPath, '**/*.sol');
    return new Promise((resolve, reject) => {
      glob(pattern, (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
  }

  /**
   * Check if a file has been modified since last scan
   */
  public hasFileChanged(filePath: string, lastModified: Date): boolean {
    try {
      const stats = fs.statSync(filePath);
      return stats.mtime > lastModified;
    } catch {
      return true; // File doesn't exist or error, consider it changed
    }
  }

  /**
   * Scan only changed files
   */
  public async scanChangedFiles(
    projectInfo: ProjectInfo, 
    lastScanTime: Date
  ): Promise<{ changed: ContractInfo[], removed: string[] }> {
    const changed: ContractInfo[] = [];
    const removed: string[] = [];

    // Check existing contracts for changes
    for (const [filePath, contractInfo] of projectInfo.contracts) {
      if (!fs.existsSync(filePath)) {
        removed.push(filePath);
        continue;
      }

      if (this.hasFileChanged(filePath, lastScanTime)) {
        const updatedContract = this.parser.parseFile(filePath);
        if (updatedContract) {
          changed.push(updatedContract);
          projectInfo.contracts.set(filePath, updatedContract);
        }
      }
    }

    // Check for new files
    for (const contractDir of projectInfo.contractDirs) {
      const fullPath = path.join(projectInfo.rootPath, contractDir);
      if (fs.existsSync(fullPath)) {
        const contractFiles = await this.findSolidityFiles(fullPath);
        
        for (const filePath of contractFiles) {
          if (!projectInfo.contracts.has(filePath)) {
            const newContract = this.parser.parseFile(filePath);
            if (newContract) {
              changed.push(newContract);
              projectInfo.contracts.set(filePath, newContract);
            }
          }
        }
      }
    }

    // Remove deleted files from project
    removed.forEach(filePath => {
      projectInfo.contracts.delete(filePath);
    });

    return { changed, removed };
  }
}
