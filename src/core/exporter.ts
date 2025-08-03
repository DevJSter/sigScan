import * as fs from 'fs';
import * as path from 'path';
import { ScanResult, ExportOptions, FunctionSignature, EventSignature, ErrorSignature } from '../types';
import { shouldIncludeFunction, formatTimestamp, getFileExtension } from '../utils/helpers';

export class SignatureExporter {
  /**
   * Export signatures to multiple formats
   */
  public async exportSignatures(scanResult: ScanResult, options: ExportOptions): Promise<void> {
    // Ensure output directory exists
    if (!fs.existsSync(options.outputDir)) {
      fs.mkdirSync(options.outputDir, { recursive: true });
    }

    for (const format of options.formats) {
      await this.exportToFormat(scanResult, options, format);
    }
  }

  /**
   * Export to specific format
   */
  private async exportToFormat(
    scanResult: ScanResult, 
    options: ExportOptions, 
    format: string
  ): Promise<void> {
    const timestamp = formatTimestamp();
    const filename = `signatures_${timestamp}${getFileExtension(format)}`;
    const filePath = path.join(options.outputDir, filename);

    let content = '';

    switch (format) {
      case 'txt':
        content = this.generateTextOutput(scanResult, options);
        break;
      case 'json':
        content = this.generateJsonOutput(scanResult, options);
        break;
      case 'csv':
        content = this.generateCsvOutput(scanResult, options);
        break;
      case 'md':
        content = this.generateMarkdownOutput(scanResult, options);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    fs.writeFileSync(filePath, content, 'utf-8');
  }

  /**
   * Generate text output (methods.txt format)
   */
  private generateTextOutput(scanResult: ScanResult, options: ExportOptions): string {
    const lines: string[] = [];
    
    lines.push('# Smart Contract Signatures');
    lines.push(`# Generated: ${scanResult.scanTime.toISOString()}`);
    lines.push(`# Project: ${scanResult.projectInfo.type} (${scanResult.projectInfo.rootPath})`);
    lines.push(`# Total Contracts: ${scanResult.totalContracts}`);
    lines.push('');

    scanResult.projectInfo.contracts.forEach(contract => {
      lines.push(`## Contract: ${contract.name} (${path.basename(contract.filePath)})`);
      lines.push('');

      // Functions
      const functions = this.filterFunctions(contract.functions, options);
      if (functions.length > 0) {
        lines.push('### Functions:');
        functions.forEach(func => {
          lines.push(`${func.signature.padEnd(40)} --> ${func.selector}`);
        });
        lines.push('');
      }

      // Events
      if (options.includeEvents && contract.events.length > 0) {
        lines.push('### Events:');
        contract.events.forEach(event => {
          lines.push(`${event.signature.padEnd(40)} --> ${event.selector}`);
        });
        lines.push('');
      }

      // Errors
      if (options.includeErrors && contract.errors.length > 0) {
        lines.push('### Errors:');
        contract.errors.forEach(error => {
          lines.push(`${error.signature.padEnd(40)} --> ${error.selector}`);
        });
        lines.push('');
      }
    });

    return lines.join('\n');
  }

  /**
   * Generate JSON output
   */
  private generateJsonOutput(scanResult: ScanResult, options: ExportOptions): string {
    const output = {
      metadata: {
        generatedAt: scanResult.scanTime.toISOString(),
        projectType: scanResult.projectInfo.type,
        projectPath: scanResult.projectInfo.rootPath,
        totalContracts: scanResult.totalContracts,
        totalFunctions: scanResult.totalFunctions,
        totalEvents: scanResult.totalEvents,
        totalErrors: scanResult.totalErrors
      },
      contracts: Array.from(scanResult.projectInfo.contracts.values()).map(contract => ({
        name: contract.name,
        filePath: contract.filePath,
        lastModified: contract.lastModified,
        functions: this.filterFunctions(contract.functions, options),
        events: options.includeEvents ? contract.events : [],
        errors: options.includeErrors ? contract.errors : []
      }))
    };

    return JSON.stringify(output, null, 2);
  }

  /**
   * Generate CSV output
   */
  private generateCsvOutput(scanResult: ScanResult, options: ExportOptions): string {
    const lines: string[] = [];
    
    // Header
    lines.push('Type,Contract,Name,Signature,Selector,Visibility,StateMutability,FilePath');

    scanResult.projectInfo.contracts.forEach(contract => {
      // Functions
      const functions = this.filterFunctions(contract.functions, options);
      functions.forEach(func => {
        lines.push([
          'Function',
          contract.name,
          func.name,
          func.signature,
          func.selector,
          func.visibility,
          func.stateMutability,
          contract.filePath
        ].map(field => `"${field}"`).join(','));
      });

      // Events
      if (options.includeEvents) {
        contract.events.forEach(event => {
          lines.push([
            'Event',
            contract.name,
            event.name,
            event.signature,
            event.selector,
            '',
            '',
            contract.filePath
          ].map(field => `"${field}"`).join(','));
        });
      }

      // Errors
      if (options.includeErrors) {
        contract.errors.forEach(error => {
          lines.push([
            'Error',
            contract.name,
            error.name,
            error.signature,
            error.selector,
            '',
            '',
            contract.filePath
          ].map(field => `"${field}"`).join(','));
        });
      }
    });

    return lines.join('\n');
  }

  /**
   * Generate Markdown output
   */
  private generateMarkdownOutput(scanResult: ScanResult, options: ExportOptions): string {
    const lines: string[] = [];
    
    lines.push('# Smart Contract Signatures');
    lines.push('');
    lines.push(`**Generated:** ${scanResult.scanTime.toISOString()}`);
    lines.push(`**Project Type:** ${scanResult.projectInfo.type}`);
    lines.push(`**Project Path:** ${scanResult.projectInfo.rootPath}`);
    lines.push(`**Total Contracts:** ${scanResult.totalContracts}`);
    lines.push('');

    scanResult.projectInfo.contracts.forEach(contract => {
      lines.push(`## ${contract.name}`);
      lines.push('');
      lines.push(`**File:** \`${path.basename(contract.filePath)}\``);
      lines.push('');

      // Functions
      const functions = this.filterFunctions(contract.functions, options);
      if (functions.length > 0) {
        lines.push('### Functions');
        lines.push('');
        lines.push('| Signature | Selector | Visibility | State Mutability |');
        lines.push('|-----------|----------|------------|-------------------|');
        
        functions.forEach(func => {
          lines.push(`| \`${func.signature}\` | \`${func.selector}\` | ${func.visibility} | ${func.stateMutability} |`);
        });
        lines.push('');
      }

      // Events
      if (options.includeEvents && contract.events.length > 0) {
        lines.push('### Events');
        lines.push('');
        lines.push('| Signature | Selector |');
        lines.push('|-----------|----------|');
        
        contract.events.forEach(event => {
          lines.push(`| \`${event.signature}\` | \`${event.selector}\` |`);
        });
        lines.push('');
      }

      // Errors
      if (options.includeErrors && contract.errors.length > 0) {
        lines.push('### Errors');
        lines.push('');
        lines.push('| Signature | Selector |');
        lines.push('|-----------|----------|');
        
        contract.errors.forEach(error => {
          lines.push(`| \`${error.signature}\` | \`${error.selector}\` |`);
        });
        lines.push('');
      }
    });

    return lines.join('\n');
  }

  /**
   * Filter functions based on options
   */
  private filterFunctions(functions: FunctionSignature[], options: ExportOptions): FunctionSignature[] {
    return functions.filter(func => 
      shouldIncludeFunction(func.visibility, options.includeInternal, options.includePrivate)
    );
  }
}
