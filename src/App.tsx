import { useState } from 'react'
import { ReactFlowProvider } from 'reactflow'
import Sidebar from '@/components/sidebar/Sidebar'
import WorkflowCanvas from '@/components/canvas/WorkflowCanvas'
import ConfigPanel from '@/components/panels/ConfigPanel'
import SimulationPanel from '@/components/panels/SimulationPanel'
import Topbar from '@/components/ui/Topbar'
import { useWorkflowStore } from '@/store/workflowStore'

export default function App() {
  const [showSimulation, setShowSimulation] = useState(false)
  const selectedNodeId = useWorkflowStore(s => s.selectedNodeId)

  return (
    <ReactFlowProvider>
      <div
        className="h-screen w-screen flex flex-col overflow-hidden font-sans"
        style={{ background: '#080a10' }}
      >
        <Topbar onSimulate={() => setShowSimulation(true)} />

        <div className="flex flex-1 min-h-0">
          <Sidebar />

          {/* Canvas */}
          <main className="flex-1 relative min-w-0 min-h-0">
            <WorkflowCanvas />
          </main>

          {/* Config panel slides in from right */}
          {selectedNodeId && <ConfigPanel />}
        </div>

        {showSimulation && (
          <SimulationPanel onClose={() => setShowSimulation(false)} />
        )}
      </div>
    </ReactFlowProvider>
  )
}
