import type {
  AutomationAction,
  SerializedWorkflow,
  SimulationResult,
  SimulationStep,
  ValidationError,
  NodeKind,
} from '@/types/workflow'

// ─── Simulated network delay ────────────────────────────────────────────────

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

// ─── Mock Data ──────────────────────────────────────────────────────────────

const AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'create_ticket', label: 'Create JIRA Ticket', params: ['project', 'summary', 'priority'] },
  { id: 'slack_notify', label: 'Send Slack Message', params: ['channel', 'message'] },
  { id: 'update_hris', label: 'Update HRIS Record', params: ['employeeId', 'field', 'value'] },
  { id: 'schedule_meeting', label: 'Schedule Meeting', params: ['attendees', 'title', 'duration'] },
  { id: 'trigger_webhook', label: 'Trigger Webhook', params: ['url', 'payload'] },
]

// ─── GET /automations ───────────────────────────────────────────────────────

export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(300)
  return structuredClone(AUTOMATIONS)
}

// ─── POST /simulate ─────────────────────────────────────────────────────────

export async function simulateWorkflow(
  workflow: SerializedWorkflow
): Promise<SimulationResult> {
  await delay(800)

  const errors = validateWorkflow(workflow)
  if (errors.some(e => e.type !== 'missing_required_field')) {
    return { success: false, steps: [], errors }
  }

  const nodeMap = new Map(workflow.nodes.map(n => [n.id, n]))
  const ordered = topologicalSort(workflow)

  if (ordered === null) {
    return {
      success: false,
      steps: [],
      errors: [{ type: 'cycle_detected', message: 'Workflow contains a cycle' }],
    }
  }

  const steps: SimulationStep[] = ordered.map((nodeId, idx) => {
    const node = nodeMap.get(nodeId)!
    const kind = node.type as NodeKind
    const label = (node.data as { label: string }).label || nodeId
    const hasFieldErrors = errors.some(e => e.nodeId === nodeId)

    return {
      nodeId,
      nodeLabel: label,
      kind,
      status: hasFieldErrors ? 'error' : 'success',
      message: getStepMessage(kind, label, hasFieldErrors),
      duration: 200 + Math.floor(Math.random() * 800),
    }
  })

  const lastStep = steps[steps.length - 1]
  const allSuccess = steps.every(s => s.status === 'success')

  return {
    success: allSuccess,
    steps,
    errors,
    summary: allSuccess
      ? `Workflow executed successfully across ${steps.length} steps`
      : `Workflow completed with ${errors.length} issue(s)`,
  }
}

// ─── Validation ─────────────────────────────────────────────────────────────

function validateWorkflow(workflow: SerializedWorkflow): ValidationError[] {
  const errors: ValidationError[] = []
  const { nodes, edges } = workflow

  const startNodes = nodes.filter(n => n.type === 'start')
  const endNodes = nodes.filter(n => n.type === 'end')

  if (startNodes.length === 0) {
    errors.push({ type: 'missing_start', message: 'Workflow must have a Start node' })
  }
  if (startNodes.length > 1) {
    errors.push({ type: 'duplicate_start', message: 'Workflow can only have one Start node' })
  }
  if (endNodes.length === 0) {
    errors.push({ type: 'missing_end', message: 'Workflow must have an End node' })
  }

  const connectedIds = new Set<string>()
  edges.forEach(e => { connectedIds.add(e.source); connectedIds.add(e.target) })
  nodes.forEach(n => {
    if (nodes.length > 1 && !connectedIds.has(n.id)) {
      errors.push({
        nodeId: n.id,
        type: 'disconnected_node',
        message: `Node "${(n.data as { label: string }).label}" is not connected`,
      })
    }
  })

  // Validate required fields per node type
  nodes.forEach(node => {
    const d = node.data as Record<string, unknown>
    if (!d.label || (d.label as string).trim() === '') {
      errors.push({
        nodeId: node.id,
        type: 'missing_required_field',
        message: `Node is missing a title`,
      })
    }
    if (node.type === 'task' && !d.assignee) {
      errors.push({
        nodeId: node.id,
        type: 'missing_required_field',
        message: `Task "${d.label}" is missing an assignee`,
      })
    }
  })

  return errors
}

// ─── Topological Sort ────────────────────────────────────────────────────────

function topologicalSort(workflow: SerializedWorkflow): string[] | null {
  const { nodes, edges } = workflow
  const adj = new Map<string, string[]>()
  const inDeg = new Map<string, number>()

  nodes.forEach(n => { adj.set(n.id, []); inDeg.set(n.id, 0) })
  edges.forEach(e => {
    adj.get(e.source)?.push(e.target)
    inDeg.set(e.target, (inDeg.get(e.target) ?? 0) + 1)
  })

  const queue = [...inDeg.entries()].filter(([, d]) => d === 0).map(([id]) => id)
  const result: string[] = []

  while (queue.length) {
    const curr = queue.shift()!
    result.push(curr)
    for (const next of adj.get(curr) ?? []) {
      const deg = (inDeg.get(next) ?? 1) - 1
      inDeg.set(next, deg)
      if (deg === 0) queue.push(next)
    }
  }

  return result.length === nodes.length ? result : null
}

function getStepMessage(kind: NodeKind, label: string, hasError: boolean): string {
  if (hasError) return `Configuration issue detected in "${label}"`
  const messages: Record<NodeKind, string> = {
    start: `Workflow triggered: ${label}`,
    task: `Task assigned: ${label}`,
    approval: `Approval requested: ${label}`,
    automated: `Automation executed: ${label}`,
    end: `Workflow completed: ${label}`,
  }
  return messages[kind]
}
