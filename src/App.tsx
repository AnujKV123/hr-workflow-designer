import { WorkflowCanvas } from './components/Canvas';
import { NodeSidebar } from './components/Sidebar';
import { NodeConfigPanel } from './components/ConfigPanel';
import { SandboxPanel } from './components/Sandbox';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between py-4 px-6">
          <h1 className="text-2xl font-bold text-gray-800">
            HR Workflow Designer
          </h1>
          {/* <div className="text-sm text-gray-500 hidden sm:block">
            Drag nodes from the sidebar to build your workflow
          </div> */}
        </div>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        <NodeSidebar />
        <div className="flex-1 relative min-w-0">
          <WorkflowCanvas />
        </div>
        <NodeConfigPanel />
        <SandboxPanel />
      </main>
    </div>
  )
}

export default App
