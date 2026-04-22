import { create } from 'zustand'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from 'reactflow'
import { nanoid } from 'nanoid'
import type { WorkflowNodeData, SerializedWorkflow } from '@/types/workflow'

export type WorkflowNode = Node<WorkflowNodeData>
export type WorkflowEdge = Edge

interface WorkflowState {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNodeId: string | null
  workflowName: string

  // Actions
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  addNode: (kind: WorkflowNodeData['kind'], position: { x: number; y: number }) => void
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void
  deleteNode: (nodeId: string) => void
  deleteEdge: (edgeId: string) => void
  selectNode: (nodeId: string | null) => void
  setWorkflowName: (name: string) => void
  serialize: () => SerializedWorkflow
  importWorkflow: (workflow: SerializedWorkflow) => void
}

const defaultDataForKind = (kind: WorkflowNodeData['kind']): WorkflowNodeData => {
  switch (kind) {
    case 'start':
      return { kind, label: 'Start', metadata: [] }
    case 'task':
      return { kind, label: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] }
    case 'approval':
      return { kind, label: 'Approval', approverRole: 'Manager', autoApproveThreshold: 0 }
    case 'automated':
      return { kind, label: 'Automated Step', actionId: '', actionParams: {} }
    case 'end':
      return { kind, label: 'End', endMessage: 'Workflow complete', summaryEnabled: true }
  }
}

const INITIAL_NODES: WorkflowNode[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 260, y: 120 },
    data: { kind: 'start', label: 'Employee Onboarding', metadata: [{ id: nanoid(), key: 'department', value: 'Engineering' }] },
  },
  {
    id: 'task-1',
    type: 'task',
    position: { x: 260, y: 280 },
    data: { kind: 'task', label: 'Collect Documents', description: 'Gather ID, contract, tax forms', assignee: 'HR Admin', dueDate: '2024-01-15', customFields: [] },
  },
  {
    id: 'approval-1',
    type: 'approval',
    position: { x: 260, y: 460 },
    data: { kind: 'approval', label: 'Manager Sign-off', approverRole: 'Manager', autoApproveThreshold: 0 },
  },
  {
    id: 'auto-1',
    type: 'automated',
    position: { x: 260, y: 640 },
    data: { kind: 'automated', label: 'Send Welcome Email', actionId: 'send_email', actionParams: { to: '{{employee.email}}', subject: 'Welcome aboard!' } },
  },
  {
    id: 'end-1',
    type: 'end',
    position: { x: 260, y: 820 },
    data: { kind: 'end', label: 'Onboarding Complete', endMessage: 'Employee successfully onboarded', summaryEnabled: true },
  },
]

const INITIAL_EDGES: WorkflowEdge[] = [
  { id: 'e1', source: 'start-1', target: 'task-1', type: 'smoothstep', animated: true },
  { id: 'e2', source: 'task-1', target: 'approval-1', type: 'smoothstep', animated: true },
  { id: 'e3', source: 'approval-1', target: 'auto-1', type: 'smoothstep', animated: true },
  { id: 'e4', source: 'auto-1', target: 'end-1', type: 'smoothstep', animated: true },
]

export const useWorkflowStore = create<WorkflowState>()(
  (set, get) => ({
    nodes: INITIAL_NODES,
    edges: INITIAL_EDGES,
    selectedNodeId: null,
    workflowName: 'Employee Onboarding',

    onNodesChange: (changes) =>
      set(s => ({ nodes: applyNodeChanges(changes, s.nodes) as WorkflowNode[] })),

    onEdgesChange: (changes) =>
      set(s => ({ edges: applyEdgeChanges(changes, s.edges) })),

    onConnect: (connection) =>
      set(s => ({
        edges: addEdge(
          { ...connection, type: 'smoothstep', animated: true, id: nanoid() },
          s.edges
        ),
      })),

    addNode: (kind, position) => {
      const id = `${kind}-${nanoid(6)}`
      const newNode: WorkflowNode = {
        id,
        type: kind,
        position,
        data: defaultDataForKind(kind),
      }
      set(s => ({ nodes: [...s.nodes, newNode], selectedNodeId: id }))
    },

    updateNodeData: (nodeId, data) =>
      set(s => ({
        nodes: s.nodes.map(n =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...data } as WorkflowNodeData } : n
        ),
      })),

    deleteNode: (nodeId) =>
      set(s => ({
        nodes: s.nodes.filter(n => n.id !== nodeId),
        edges: s.edges.filter(e => e.source !== nodeId && e.target !== nodeId),
        selectedNodeId: s.selectedNodeId === nodeId ? null : s.selectedNodeId,
      })),

    deleteEdge: (edgeId) =>
      set(s => ({ edges: s.edges.filter(e => e.id !== edgeId) })),

    selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

    setWorkflowName: (name) => set({ workflowName: name }),

    serialize: () => {
      const { nodes, edges, workflowName } = get()
      return {
        id: nanoid(),
        name: workflowName,
        version: 1,
        nodes: nodes.map(n => ({
          id: n.id,
          type: n.type as WorkflowNodeData['kind'],
          position: n.position,
          data: n.data,
        })),
        edges: edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
          sourceHandle: e.sourceHandle ?? undefined,
          targetHandle: e.targetHandle ?? undefined,
        })),
        createdAt: new Date().toISOString(),
      }
    },

    importWorkflow: (workflow) => {
      const nodes: WorkflowNode[] = workflow.nodes.map(n => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data,
      }))
      const edges: WorkflowEdge[] = workflow.edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'smoothstep',
        animated: true,
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
      }))
      set({ nodes, edges, workflowName: workflow.name, selectedNodeId: null })
    },
  })
)
