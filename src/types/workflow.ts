// ─── Node Types ────────────────────────────────────────────────────────────

export type NodeKind = 'start' | 'task' | 'approval' | 'automated' | 'end'

export interface KeyValuePair {
  id: string
  key: string
  value: string
}

export interface StartNodeData {
  kind: 'start'
  label: string
  metadata: KeyValuePair[]
}

export interface TaskNodeData {
  kind: 'task'
  label: string
  description: string
  assignee: string
  dueDate: string
  customFields: KeyValuePair[]
}

export interface ApprovalNodeData {
  kind: 'approval'
  label: string
  approverRole: string
  autoApproveThreshold: number
}

export interface AutomatedNodeData {
  kind: 'automated'
  label: string
  actionId: string
  actionParams: Record<string, string>
}

export interface EndNodeData {
  kind: 'end'
  label: string
  endMessage: string
  summaryEnabled: boolean
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData

// ─── API Types ─────────────────────────────────────────────────────────────

export interface AutomationAction {
  id: string
  label: string
  params: string[]
}

export interface SimulationStep {
  nodeId: string
  nodeLabel: string
  kind: NodeKind
  status: 'pending' | 'running' | 'success' | 'error' | 'skipped'
  message: string
  duration: number
}

export interface SimulationResult {
  success: boolean
  steps: SimulationStep[]
  errors: ValidationError[]
  summary?: string
}

// ─── Validation ────────────────────────────────────────────────────────────

export interface ValidationError {
  nodeId?: string
  edgeId?: string
  type: 'missing_start' | 'missing_end' | 'disconnected_node' | 'cycle_detected' | 'duplicate_start' | 'invalid_connection' | 'missing_required_field'
  message: string
}

// ─── Workflow Serialization ─────────────────────────────────────────────────

export interface SerializedWorkflow {
  id: string
  name: string
  version: number
  nodes: SerializedNode[]
  edges: SerializedEdge[]
  createdAt: string
}

export interface SerializedNode {
  id: string
  type: NodeKind
  position: { x: number; y: number }
  data: WorkflowNodeData
}

export interface SerializedEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}
