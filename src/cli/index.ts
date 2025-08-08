#!/usr/bin/env node

import { Command } from 'commander';
import * as path from 'path';
import { ProjectScanner } from '../core/scanner';
import { SignatureExporter } from '../core/exporter';
import { FileWatcher } from '../core/watcher';
import { ExportOptions } from '../types';

const program = new Command();

program
  .name('sigscan')
  .description('Smart Contract Signature Scanner for Foundry/Hardhat projects')
  .version('0.1.0');

program
  .command('scan')
  .description('Scan project for contract signatures')
  .option('-p, --path <path>', 'Project path', process.cwd())
  .option('-o, --output <dir>', 'Output directory', 'signatures')
  .option('-f, --formats <formats>', 'Export formats (txt,json,csv,md)', 'txt,json')
  .option('--include-internal', 'Include internal functions', false)
  .option('--include-private', 'Include private functions', false)
  .option('--include-events', 'Include events', true)
  .option('--include-errors', 'Include errors', true)
  .action(async (options) => {
    try {
      const scanner = new ProjectScanner();
      const exporter = new SignatureExporter();

      console.log(`Scanning project: ${options.path}`);
      const scanResult = await scanner.scanProject(options.path);

      console.log(`Found ${scanResult.totalContracts} contracts`);
      console.log(`Total functions: ${scanResult.totalFunctions}`);
      console.log(`Total events: ${scanResult.totalEvents}`);
      console.log(`Total errors: ${scanResult.totalErrors}`);

      const exportOptions: ExportOptions = {
        formats: options.formats.split(',').map((f: string) => f.trim()),
        outputDir: path.resolve(options.output),
        includeInternal: options.includeInternal,
        includePrivate: options.includePrivate,
        includeEvents: options.includeEvents,
        includeErrors: options.includeErrors,
        separateByCategory: true,
        updateExisting: true,
        deduplicateSignatures: true
      };

      await exporter.exportSignatures(scanResult, exportOptions);
      console.log(`Signatures exported to: ${exportOptions.outputDir}`);

    } catch (error) {
      console.error('Error scanning project:', error);
      process.exit(1);
    }
  });

program
  .command('watch')
  .description('Watch project for changes and auto-scan')
  .option('-p, --path <path>', 'Project path', process.cwd())
  .option('-o, --output <dir>', 'Output directory', 'signatures')
  .option('-f, --formats <formats>', 'Export formats (txt,json,csv,md)', 'txt,json')
  .option('--include-internal', 'Include internal functions', false)
  .option('--include-private', 'Include private functions', false)
  .option('--include-events', 'Include events', true)
  .option('--include-errors', 'Include errors', true)
  .action(async (options) => {
    try {
      const scanner = new ProjectScanner();
      const exporter = new SignatureExporter();
      const watcher = new FileWatcher();

      // Initial scan
      console.log(`Initial scan of project: ${options.path}`);
      let scanResult = await scanner.scanProject(options.path);

      const exportOptions: ExportOptions = {
        formats: options.formats.split(',').map((f: string) => f.trim()),
        outputDir: path.resolve(options.output),
        includeInternal: options.includeInternal,
        includePrivate: options.includePrivate,
        includeEvents: options.includeEvents,
        includeErrors: options.includeErrors,
        separateByCategory: true,
        updateExisting: true,
        deduplicateSignatures: true
      };

      await exporter.exportSignatures(scanResult, exportOptions);
      console.log(`Initial export completed: ${exportOptions.outputDir}`);

      // Start watching
      console.log('Watching for changes... (Press Ctrl+C to stop)');
      watcher.startWatching(scanResult.projectInfo);

      watcher.on('fileChanged', async (filePath, contractInfo) => {
        console.log(`File changed: ${filePath}`);
        if (contractInfo) {
          scanResult.projectInfo.contracts.set(filePath, contractInfo);
          scanResult = await scanner.scanProject(options.path);
          await exporter.exportSignatures(scanResult, exportOptions);
          console.log('Signatures updated');
        }
      });

      watcher.on('fileAdded', async (filePath, contractInfo) => {
        console.log(`File added: ${filePath}`);
        if (contractInfo) {
          scanResult.projectInfo.contracts.set(filePath, contractInfo);
          scanResult = await scanner.scanProject(options.path);
          await exporter.exportSignatures(scanResult, exportOptions);
          console.log('Signatures updated');
        }
      });

      watcher.on('fileRemoved', async (filePath) => {
        console.log(`File removed: ${filePath}`);
        scanResult.projectInfo.contracts.delete(filePath);
        scanResult = await scanner.scanProject(options.path);
        await exporter.exportSignatures(scanResult, exportOptions);
        console.log('Signatures updated');
      });

      watcher.on('error', (error) => {
        console.error('Watcher error:', error);
      });

      // Handle graceful shutdown
      process.on('SIGINT', () => {
        console.log('\nStopping watcher...');
        watcher.stopWatching();
        process.exit(0);
      });

    } catch (error) {
      console.error('Error watching project:', error);
      process.exit(1);
    }
  });

program
  .command('info')
  .description('Show project information')
  .option('-p, --path <path>', 'Project path', process.cwd())
  .action(async (options) => {
    try {
      const scanner = new ProjectScanner();
      const scanResult = await scanner.scanProject(options.path);

      console.log('Project Information:');
      console.log(`  Type: ${scanResult.projectInfo.type}`);
      console.log(`  Path: ${scanResult.projectInfo.rootPath}`);
      console.log(`  Contract Directories: ${scanResult.projectInfo.contractDirs.join(', ')}`);
      console.log(`  Total Contracts: ${scanResult.totalContracts}`);
      console.log(`  Total Functions: ${scanResult.totalFunctions}`);
      console.log(`  Total Events: ${scanResult.totalEvents}`);
      console.log(`  Total Errors: ${scanResult.totalErrors}`);

    } catch (error) {
      console.error('Error getting project info:', error);
      process.exit(1);
    }
  });

program.parse();
