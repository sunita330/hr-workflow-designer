import type { NodeKind } from '@/types/workflow'

export const NODE_CONFIG: Record<
  NodeKind,
  { label: string; color: string; bg: string; icon: string; description: string }
> = {
  start: {
    label: 'Start',
    color: '#22c55e',
    bg: '#22c55e18',
    icon: 'Play',
    description: 'Workflow entry point',
  },
  task: {
    label: 'Task',
    color: '#5b7cf6',
    bg: '#5b7cf618',
    icon: 'CheckSquare',
    description: 'Human task assignment',
  },
  approval: {
    label: 'Approval',
    color: '#f59e0b',
    bg: '#f59e0b18',
    icon: 'ShieldCheck',
    description: 'Approval gate',
  },
  automated: {
    label: 'Automated',
    color: '#a855f7',
    bg: '#a855f718',
    icon: 'Zap',
    description: 'System-triggered action',
  },
  end: {
    label: 'End',
    color: '#ef4444',
    bg: '#ef444418',
    icon: 'StopCircle',
    description: 'Workflow completion',
  },
}
