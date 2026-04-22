import { useEffect, useState } from 'react'
import type {
  StartNodeData, TaskNodeData, ApprovalNodeData,
  AutomatedNodeData, EndNodeData, AutomationAction
} from '@/types/workflow'
import { Field, TextareaField, SelectField, Toggle, KVEditor } from './FormFields'
import { getAutomations } from '@/mocks/api'

// ─── Start Node Form ─────────────────────────────────────────────────────────

interface StartFormProps {
  data: StartNodeData
  onChange: (patch: Partial<StartNodeData>) => void
}

export function StartForm({ data, onChange }: StartFormProps) {
  return (
    <div className="space-y-4">
      <Field
        label="Workflow Title"
        required
        placeholder="e.g. Employee Onboarding"
        value={data.label}
        onChange={e => onChange({ label: e.target.value })}
      />
      <KVEditor
        label="Metadata"
        pairs={data.metadata}
        onChange={metadata => onChange({ metadata })}
      />
    </div>
  )
}

// ─── Task Node Form ──────────────────────────────────────────────────────────

interface TaskFormProps {
  data: TaskNodeData
  onChange: (patch: Partial<TaskNodeData>) => void
}

export function TaskForm({ data, onChange }: TaskFormProps) {
  return (
    <div className="space-y-4">
      <Field
        label="Task Title"
        required
        placeholder="e.g. Collect Documents"
        value={data.label}
        onChange={e => onChange({ label: e.target.value })}
      />
      <TextareaField
        label="Description"
        placeholder="Describe what needs to be done…"
        value={data.description}
        onChange={e => onChange({ description: e.target.value })}
      />
      <Field
        label="Assignee"
        placeholder="e.g. HR Admin"
        value={data.assignee}
        onChange={e => onChange({ assignee: e.target.value })}
      />
      <Field
        label="Due Date"
        type="date"
        value={data.dueDate}
        onChange={e => onChange({ dueDate: e.target.value })}
      />
      <KVEditor
        label="Custom Fields"
        pairs={data.customFields}
        onChange={customFields => onChange({ customFields })}
      />
    </div>
  )
}

// ─── Approval Node Form ──────────────────────────────────────────────────────

const APPROVER_ROLES = [
  { value: 'Manager', label: 'Manager' },
  { value: 'HRBP', label: 'HR Business Partner' },
  { value: 'Director', label: 'Director' },
  { value: 'VP', label: 'VP / Senior Leadership' },
  { value: 'C-Suite', label: 'C-Suite' },
]

interface ApprovalFormProps {
  data: ApprovalNodeData
  onChange: (patch: Partial<ApprovalNodeData>) => void
}

export function ApprovalForm({ data, onChange }: ApprovalFormProps) {
  return (
    <div className="space-y-4">
      <Field
        label="Approval Step Title"
        required
        placeholder="e.g. Manager Sign-off"
        value={data.label}
        onChange={e => onChange({ label: e.target.value })}
      />
      <SelectField
        label="Approver Role"
        options={APPROVER_ROLES}
        value={data.approverRole}
        onChange={e => onChange({ approverRole: e.target.value })}
      />
      <Field
        label="Auto-approve Threshold (days)"
        type="number"
        min={0}
        placeholder="0 = never auto-approve"
        value={data.autoApproveThreshold}
        onChange={e => onChange({ autoApproveThreshold: Number(e.target.value) })}
        hint="If no action is taken within this many days, the step auto-approves"
      />
    </div>
  )
}

// ─── Automated Step Node Form ────────────────────────────────────────────────

interface AutomatedFormProps {
  data: AutomatedNodeData
  onChange: (patch: Partial<AutomatedNodeData>) => void
}

export function AutomatedForm({ data, onChange }: AutomatedFormProps) {
  const [actions, setActions] = useState<AutomationAction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAutomations().then(a => { setActions(a); setLoading(false) })
  }, [])

  const selectedAction = actions.find(a => a.id === data.actionId)

  const handleActionChange = (actionId: string) => {
    const action = actions.find(a => a.id === actionId)
    const emptyParams: Record<string, string> = {}
    action?.params.forEach(p => { emptyParams[p] = data.actionParams[p] ?? '' })
    onChange({ actionId, actionParams: emptyParams })
  }

  return (
    <div className="space-y-4">
      <Field
        label="Step Title"
        required
        placeholder="e.g. Send Welcome Email"
        value={data.label}
        onChange={e => onChange({ label: e.target.value })}
      />
      <SelectField
        label="Action"
        options={loading ? [] : actions.map(a => ({ value: a.id, label: a.label }))}
        value={data.actionId}
        onChange={e => handleActionChange(e.target.value)}
      />

      {selectedAction && selectedAction.params.length > 0 && (
        <div className="space-y-3 pt-1">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Action Parameters</p>
          {selectedAction.params.map(param => (
            <Field
              key={param}
              label={param}
              placeholder={`{{${param}}}`}
              value={data.actionParams[param] ?? ''}
              onChange={e => onChange({
                actionParams: { ...data.actionParams, [param]: e.target.value }
              })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── End Node Form ───────────────────────────────────────────────────────────

interface EndFormProps {
  data: EndNodeData
  onChange: (patch: Partial<EndNodeData>) => void
}

export function EndForm({ data, onChange }: EndFormProps) {
  return (
    <div className="space-y-4">
      <Field
        label="Node Title"
        required
        placeholder="e.g. Onboarding Complete"
        value={data.label}
        onChange={e => onChange({ label: e.target.value })}
      />
      <TextareaField
        label="Completion Message"
        placeholder="What happens when the workflow ends?"
        value={data.endMessage}
        onChange={e => onChange({ endMessage: e.target.value })}
      />
      <Toggle
        label="Generate Summary"
        description="Produce a workflow execution summary on completion"
        checked={data.summaryEnabled}
        onChange={v => onChange({ summaryEnabled: v })}
      />
    </div>
  )
}
