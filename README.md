# SigScan - Smart Contract Signature Scanner

## STILL IN IDEATION PHASE

### Core Concept
A tool in VS Code or your favorite text editor/code editor which can go through all the contracts in the `src/` folder for a Foundry/Hardhat project and goes through each function and generates the calldata method hash.

**Example:**
```bash
cast sig "createPair(address, address)" --> 0xc9c65396
cast 4byte 0xc9c65396  --> createPair(address,address)
```

Just they don't have to use cast: this tool would automatically take all the functions every second/minute these functions are introduced in the smart contract and saved in the dir/project. The tool will automatically execute all the function method signatures in a verifiable way.

Inherently it should do by making a `methods.txt` in the root of forge/hardhat project in the format of for all the `.sol` contracts by implementing this (would be amazing to be vigilant before sending any transaction via CLI).

**FOR DEVS:**
```
               Method                       Fn Signature/Method
       - createPair(address, address) -->      0xc9c65396
       - etc etc                      -->     some signature
```

**REQUIREMENT:** 
Cast by foundry / or any other way it should detect if any changes are there in the `contracts/src` folder / irl method updates / appending them methods / updating if any changes are there to be performed.

---

## 🚀 Enhanced Project Structure & Features

### 📁 Project Architecture
```
sigScan/
├── README.md
├── package.json
├── tsconfig.json
├── .gitignore
├── src/
│   ├── extension/                 # VS Code Extension
│   │   ├── extension.ts          # Main extension entry point
│   │   ├── commands/             # Extension commands
│   │   ├── providers/            # Language providers, hover, etc.
│   │   └── views/                # Custom views and panels
│   ├── core/                     # Core functionality
│   │   ├── scanner/              # Contract scanning logic
│   │   ├── parser/               # Solidity parsing
│   │   ├── watcher/              # File system watching
│   │   └── signature/            # Signature generation & validation
│   ├── cli/                      # Command Line Interface
│   │   ├── index.ts              # CLI entry point
│   │   ├── commands/             # CLI commands
│   │   └── utils/                # CLI utilities
│   └── utils/                    # Shared utilities
├── tests/                        # Test files
├── docs/                         # Documentation
├── examples/                     # Example projects
└── dist/                         # Built files
```

### 🔧 Core Features

#### 1. **Project Detection & Support**
- ✅ Auto-detect Foundry projects (`foundry.toml`)
- ✅ Auto-detect Hardhat projects (`hardhat.config.js/ts`)
- ✅ Support multiple contract directories:
  - `src/` (Foundry default)
  - `contracts/` (Hardhat default)
  - `lib/` (Dependencies)
- ✅ Handle nested contract structures

#### 2. **Enhanced Function Analysis**
- ✅ Extract all function signatures
- ✅ Generate method hashes (4-byte selectors)
- ✅ Detect function visibility (public, external, internal, private)
- ✅ Identify view/pure vs state-changing functions
- ✅ Handle function overloading
- ✅ Parse constructor signatures
- ✅ Extract event signatures
- ✅ Extract custom error signatures
- ✅ Support for modifiers

#### 3. **Real-time Monitoring**
- ✅ File system watcher for `.sol` files
- ✅ Incremental updates (only scan changed files)
- ✅ Git integration to track signature changes
- ✅ Configurable scan intervals (seconds/minutes)
- ✅ Backup/restore previous signatures

#### 4. **Output Formats & Storage**
- ✅ `methods.txt` - Human readable format
- ✅ `signatures.json` - Structured data
- ✅ `methods.csv` - Spreadsheet compatible
- ✅ `signatures.md` - Markdown documentation
- ✅ Database storage option (SQLite)

### 🛡️ Security & Verification Features

#### 5. **Signature Verification**
- ✅ Cross-reference with 4byte.directory
- ✅ Detect potential signature collisions
- ✅ Warn about common attack vectors
- ✅ Integration with known vulnerability databases
- ✅ Signature uniqueness validation

#### 6. **Transaction Safety**
- ✅ Pre-transaction signature validation
- ✅ Warning system for unknown signatures
- ✅ Integration with wallet security tools
- ✅ Blacklist/whitelist functionality

### 🎨 Developer Experience

#### 7. **VS Code Extension Features**
- ✅ Hover tooltips showing function signatures
- ✅ Command palette integration
- ✅ Status bar indicators
- ✅ Syntax highlighting for signatures
- ✅ Signature explorer view panel
- ✅ Quick actions (copy signature, search 4byte, etc.)
- ✅ Settings panel for configuration

#### 8. **CLI Tool**
- ✅ Standalone CLI for CI/CD integration
- ✅ Batch processing capabilities
- ✅ Custom filtering options
- ✅ Watch mode for continuous monitoring
- ✅ Export to multiple formats

### 📊 Advanced Features

#### 9. **Analytics & Insights**
- ✅ Function usage statistics
- ✅ Signature collision detection
- ✅ Code complexity metrics
- ✅ Historical signature changes
- ✅ Dependency analysis

#### 10. **Integration Capabilities**
- ✅ GitHub Actions integration
- ✅ CI/CD pipeline support
- ✅ Webhook notifications
- ✅ API endpoints for external tools
- ✅ Plugin architecture for extensibility

### 🔄 Workflow Integration

#### 11. **Development Workflow**
- ✅ Pre-commit hooks
- ✅ Pull request checks
- ✅ Deployment verification
- ✅ Test coverage for signatures
- ✅ Documentation generation

#### 12. **Collaboration Features**
- ✅ Team signature sharing
- ✅ Signature comments/annotations
- ✅ Review system for new signatures
- ✅ Version control integration

---

## 🛠️ Technical Stack

- **Language**: TypeScript/JavaScript
- **VS Code Extension**: VS Code Extension API
- **CLI**: Commander.js / Yargs
- **Parsing**: Solidity AST parser
- **File Watching**: Chokidar
- **Database**: SQLite / JSON files
- **Testing**: Jest / Mocha
- **Build**: Webpack / ESBuild

## 📋 Implementation Phases

### Phase 1: Core Functionality
- Basic contract scanning
- Function signature extraction
- Method hash generation
- File watching
- Basic output formats

### Phase 2: VS Code Extension
- Extension development
- UI components
- Command integration
- Settings management

### Phase 3: Advanced Features
- Security verification
- 4byte.directory integration
- Analytics and insights
- CI/CD integration

### Phase 4: Polish & Distribution
- Documentation
- Testing
- Publishing to VS Code Marketplace
- Community feedback integration