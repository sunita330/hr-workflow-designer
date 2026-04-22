import { useCallback, useRef } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type ReactFlowInstance,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { nodeTypes } from '@/components/nodes'
import { useWorkflowStore } from '@/store/workflowStore'
import type { NodeKind, WorkflowNodeData } from '@/types/workflow'

const SNAP_GRID: [number, number] = [20, 20]

interface CanvasProps {
  onDropNodeKind?: (kind: NodeKind, position: { x: number; y: number }) => void
}

export default function WorkflowCanvas({ onDropNodeKind }: CanvasProps) {
  const {
    nodes, edges,
    onNodesChange, onEdgesChange, onConnect,
    selectNode, addNode,
  } = useWorkflowStore()

  const rfInstance = useRef<ReactFlowInstance | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const kind = e.dataTransfer.getData('application/nodeKind') as NodeKind
    if (!kind || !rfInstance.current || !wrapperRef.current) return

    const bounds = wrapperRef.current.getBoundingClientRect()
    const position = rfInstance.current.project({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    })
    addNode(kind, position)
  }, [addNode])

  return (
    <div ref={wrapperRef} className="w-full h-full" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={inst => { rfInstance.current = inst }}
        onNodeClick={(_, node) => selectNode(node.id)}
        onPaneClick={() => selectNode(null)}
        snapToGrid
        snapGrid={SNAP_GRID}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        deleteKeyCode="Delete"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#5b7cf640', strokeWidth: 2 },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#ffffff0a"
        />
        <Controls
          className="!bg-surface-2 !border-border !rounded-xl overflow-hidden"
          showInteractive={false}
        />
        <MiniMap
          nodeColor={(node) => {
            const kind = (node.data as WorkflowNodeData).kind
            const colors: Record<string, string> = {
              start: '#22c55e',
              task: '#5b7cf6',
              approval: '#f59e0b',
              automated: '#a855f7',
              end: '#ef4444',
            }
            return colors[kind] ?? '#5b7cf6'
          }}
          maskColor="rgba(6,8,16,0.88)"
          nodeStrokeWidth={0}
          style={{ border: 'none' }}
        />
      </ReactFlow>
    </div>
  )
}
