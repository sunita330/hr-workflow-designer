import { type NodeProps } from 'reactflow'
import BaseNode from './BaseNode'
import type { WorkflowNodeData } from '@/types/workflow'

// Each node type is a thin wrapper — all rendering logic lives in BaseNode.
// This separation allows node-type-specific behaviour to be added cleanly.

export const StartNode = (props: NodeProps<WorkflowNodeData>) => (
  <BaseNode {...props} showTargetHandle={false} />
)

export const TaskNode = (props: NodeProps<WorkflowNodeData>) => (
  <BaseNode {...props} />
)

export const ApprovalNode = (props: NodeProps<WorkflowNodeData>) => (
  <BaseNode {...props} />
)

export const AutomatedNode = (props: NodeProps<WorkflowNodeData>) => (
  <BaseNode {...props} />
)

export const EndNode = (props: NodeProps<WorkflowNodeData>) => (
  <BaseNode {...props} showSourceHandle={false} />
)

// Registry consumed by ReactFlow
export const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
}
