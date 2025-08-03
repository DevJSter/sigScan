export interface FunctionSignature {
  name: string;
  signature: string;
  selector: string;
  visibility: 'public' | 'external' | 'internal' | 'private';
  stateMutability: 'pure' | 'view' | 'nonpayable' | 'payable';
  inputs: Parameter[];
  outputs: Parameter[];
  contractName: string;
  filePath: string;
}

export interface Parameter {
  name: string;
  type: string;
  indexed?: boolean;
}

export interface EventSignature {
  name: string;
  signature: string;
  selector: string;
  inputs: Parameter[];
  contractName: string;
  filePath: string;
}

export interface ErrorSignature {
  name: string;
  signature: string;
  selector: string;
  inputs: Parameter[];
  contractName: string;
  filePath: string;
}

export interface ContractInfo {
  name: string;
  filePath: string;
  functions: FunctionSignature[];
  events: EventSignature[];
  errors: ErrorSignature[];
  lastModified: Date;
}

export interface ProjectInfo {
  type: 'foundry' | 'hardhat' | 'unknown';
  rootPath: string;
  contractDirs: string[];
  contracts: Map<string, ContractInfo>;
}

export interface ScanResult {
  projectInfo: ProjectInfo;
  totalContracts: number;
  totalFunctions: number;
  totalEvents: number;
  totalErrors: number;
  scanTime: Date;
}

export interface ExportOptions {
  formats: ('txt' | 'json' | 'csv' | 'md')[];
  outputDir: string;
  includeInternal: boolean;
  includePrivate: boolean;
  includeEvents: boolean;
  includeErrors: boolean;
}
