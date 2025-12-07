# HR Workflow Designer

A visual workflow builder for designing and validating HR process workflows. Drag and drop nodes to create complex workflows, configure each step, validate the workflow structure, and simulate execution.

![HR Workflow Designer](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue) ![Vite](https://img.shields.io/badge/Vite-6.0-purple) ![Tests](https://img.shields.io/badge/Tests-Vitest-green)

## Features

- **Visual Workflow Builder**: Drag-and-drop interface for creating workflow diagrams
- **Multiple Node Types**: Start, Task, Approval, Automated Step, and End nodes
- **Real-time Validation**: Instant feedback on workflow structure issues
- **Node Configuration**: Detailed configuration panel for each node type
- **Workflow Simulation**: Test workflow execution with mock data
- **Export/Import**: Save and load workflows as JSON files
- **Type Safety**: Full TypeScript implementation with strict mode
- **Comprehensive Testing**: Unit and property-based tests with 100+ test cases

## Tech Stack

### Core Framework
- **React 18.3** - UI framework with hooks and concurrent features
- **TypeScript 5.6** - Type-safe development with strict mode enabled
- **Vite 6.0** - Fast build tool and dev server

### UI & Styling
- **ReactFlow 11.11** - Interactive node-based graph library
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **PostCSS** - CSS processing and optimization

### State Management
- **Zustand 5.0** - Lightweight state management
- **React Hook Form 7.68** - Form state and validation
- **Zod 4.1** - Schema validation

### Testing
- **Vitest 4.0** - Fast unit test runner
- **Testing Library** - React component testing utilities
- **fast-check 4.3** - Property-based testing framework
- **MSW 2.12** - API mocking for tests and development

### Development Tools
- **ESLint** - Code linting
- **jsdom** - DOM implementation for testing

## Architecture

### Component Structure

```
src/
├── components/
│   ├── Canvas/           # Main workflow canvas
│   │   ├── WorkflowCanvas.tsx      # ReactFlow integration
│   │   ├── CanvasControls.tsx      # Zoom, export controls
│   │   └── ValidationOverlay.tsx   # Validation feedback UI
│   ├── Nodes/            # Custom node components
│   │   ├── StartNode.tsx
│   │   ├── TaskNode.tsx
│   │   ├── ApprovalNode.tsx
│   │   ├── AutomatedStepNode.tsx
│   │   └── EndNode.tsx
│   ├── ConfigPanel/      # Node configuration forms
│   ├── Sidebar/          # Node palette
│   ├── Sandbox/          # Workflow simulation
│   ├── FormFields/       # Reusable form components
│   ├── Toast/            # Notification system
│   └── ErrorBoundary/    # Error handling
├── hooks/
│   ├── useWorkflowStore.ts         # Zustand store
│   ├── useWorkflowValidation.ts    # Validation logic
│   └── useAutomations.ts           # API integration
├── services/
│   ├── workflowValidator.ts        # Validation engine
│   └── api.ts                      # API client
├── types/
│   ├── workflow.ts       # Workflow graph types
│   ├── nodes.ts          # Node data types
│   └── api.ts            # API types
├── utils/
│   └── workflowSerializer.ts       # JSON export/import
└── mocks/
    ├── handlers.ts       # MSW request handlers
    └── data/             # Mock data
```

### State Management

The application uses **Zustand** for global state management with a single store:

```typescript
interface WorkflowStore {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNodeId: string | null
  
  // Actions
  addNode, updateNode, deleteNode
  addEdge, deleteEdge
  setSelectedNode
  clearWorkflow, loadWorkflow
}
```

### Data Flow

1. **User Interaction** → Component event handlers
2. **Component** → Zustand store actions
3. **Store Update** → React re-render
4. **Validation** → Real-time feedback
5. **Export/Import** → JSON serialization

### Validation Engine

The workflow validator performs six types of checks:

1. **Missing Start Node** (error) - Workflow must have at least one start
2. **Multiple Start Nodes** (warning) - Only one start recommended
3. **Cycles Detection** (error) - No circular dependencies allowed
4. **End Node Validation** (error) - End nodes cannot have outgoing edges
5. **Disconnected Nodes** (warning) - All nodes should be reachable
6. **Incomplete Paths** (warning) - Non-end nodes should have outgoing edges

## Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hr-workflow-designer

# Install dependencies
npm install
```

## How to Run

### Development Mode

```bash
npm run dev
```

Opens the application at `http://localhost:5173` with hot module replacement.

### Build for Production

```bash
npm run build
```

Creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

### Run Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Linting

```bash
npm run lint
```

## Usage

### Creating a Workflow

1. **Add Nodes**: Drag node types from the left sidebar onto the canvas
2. **Connect Nodes**: Click and drag from one node's handle to another
3. **Configure Nodes**: Click a node to open the configuration panel on the right
4. **Validate**: Check the validation overlay for errors and warnings
5. **Export**: Use the export button to save your workflow as JSON

### Node Types

- **Start Node**: Entry point for the workflow (required)
- **Task Node**: Manual task assignment with assignee and due date
- **Approval Node**: Approval step with role-based approvers
- **Automated Step Node**: Automated action (email, API call, etc.)
- **End Node**: Terminal node marking workflow completion

### Simulation

1. Click the "Sandbox" panel on the right
2. Click "Simulate Workflow" to test execution
3. View the simulation log to see the execution path
4. Check validation results for any issues

## Design Decisions

### Why ReactFlow?

ReactFlow provides a robust foundation for node-based interfaces with built-in features like:
- Pan and zoom
- Node dragging and positioning
- Edge routing
- Minimap
- Keyboard shortcuts

This saved significant development time compared to building from scratch.

### Why Zustand over Redux?

Zustand offers:
- Simpler API with less boilerplate
- No context providers needed
- Better TypeScript inference
- Smaller bundle size (~1KB vs ~3KB)

For this application's scope, Zustand provides all necessary features without Redux's complexity.

### Why MSW for Mocking?

Mock Service Worker intercepts network requests at the service worker level, providing:
- Same mock data in development and tests
- No code changes between mocked and real APIs
- Realistic network behavior
- Easy transition to real backend

### Validation Strategy

Real-time validation provides immediate feedback without requiring explicit "validate" actions. The validator runs on every state change and highlights problematic nodes directly on the canvas.

### Component Architecture

The application follows a feature-based component structure:
- **Presentational components** handle UI rendering
- **Container components** manage state and logic
- **Custom hooks** encapsulate reusable logic
- **Services** handle external interactions

This separation makes components easier to test and maintain.

### TypeScript Strict Mode

Strict mode catches potential bugs at compile time:
- No implicit `any` types
- Strict null checks
- No unused variables
- Exhaustive switch cases

This increases initial development time but significantly reduces runtime errors.

## What We Completed

### Core Features ✅
- Visual workflow canvas with drag-and-drop
- Five node types with custom rendering
- Node configuration panel with form validation
- Real-time workflow validation
- Export/import workflows as JSON
- Workflow simulation with mock backend
- Toast notifications for user feedback
- Error boundary for graceful error handling

### Testing ✅
- 100+ unit tests covering all components
- Property-based tests for validation logic
- Integration tests for hooks and API
- MSW setup for API mocking
- Test coverage for edge cases

### Developer Experience ✅
- TypeScript with strict mode
- ESLint configuration
- Fast HMR with Vite
- Comprehensive type definitions
- Clean component architecture

## What We Would Add With More Time

### Features
- **Undo/Redo**: Command pattern for workflow history
- **Auto-layout**: Automatic node positioning algorithms
- **Templates**: Pre-built workflow templates for common HR processes
- **Collaboration**: Real-time multi-user editing
- **Version Control**: Workflow versioning and diff viewing
- **Advanced Validation**: Custom validation rules per organization
- **Conditional Branching**: Decision nodes with multiple paths
- **Subworkflows**: Nested workflows for complex processes
- **Role-Based Access**: Permissions for viewing/editing workflows
- **Audit Log**: Track all workflow changes

### Technical Improvements
- **Backend Integration**: Replace MSW with real API
- **Database**: Persist workflows to database
- **Authentication**: User login and session management
- **Performance**: Virtual rendering for large workflows (1000+ nodes)
- **Accessibility**: Full ARIA support and keyboard navigation
- **Mobile Support**: Responsive design for tablets
- **Offline Mode**: Service worker for offline editing
- **E2E Tests**: Playwright or Cypress for full user flows
- **Storybook**: Component documentation and visual testing
- **CI/CD**: Automated testing and deployment pipeline

### UX Enhancements
- **Guided Tour**: Onboarding for new users
- **Keyboard Shortcuts**: Power user features
- **Search**: Find nodes by name or type
- **Zoom to Fit**: Auto-zoom to show entire workflow
- **Grid Snapping**: Align nodes to grid
- **Copy/Paste**: Duplicate nodes and subgraphs
- **Multi-select**: Bulk operations on nodes
- **Comments**: Annotations on nodes and edges
- **Dark Mode**: Theme switching
- **Custom Themes**: Branding customization

### Analytics
- **Usage Metrics**: Track workflow creation and execution
- **Performance Monitoring**: Identify bottlenecks
- **Error Tracking**: Sentry or similar for production errors
- **A/B Testing**: Test UX improvements

## Contributing

This is a demonstration project. For production use, consider:
- Adding authentication and authorization
- Implementing a real backend API
- Adding comprehensive E2E tests
- Setting up CI/CD pipelines
- Implementing proper error tracking
- Adding performance monitoring

## License

MIT

---

Built with ❤️ using React, TypeScript, and ReactFlow
