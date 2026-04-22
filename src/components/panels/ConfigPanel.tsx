import { X, Play, CheckSquare, ShieldCheck, Zap, StopCircle, Settings2 } from 'lucide-react'
import { useWorkflowStore } from '@/store/workflowStore'
import { NODE_CONFIG } from '@/lib/nodeConfig'
import {
  StartForm, TaskForm, ApprovalForm, AutomatedForm, EndForm
} from './NodeForms'
import type { WorkflowNodeData } from '@/types/workflow'

const ICONS = { Play, CheckSquare, ShieldCheck, Zap, StopCircle }

export default function ConfigPanel() {
  const { nodes, selectedNodeId, selectNode, updateNodeData } = useWorkflowStore()

  const node = nodes.find(n => n.id === selectedNodeId)
  if (!node) return null

  const data = node.data
  const cfg = NODE_CONFIG[data.kind]
  const Icon = ICONS[cfg.icon as keyof typeof ICONS]

  const patch = (update: Partial<WorkflowNodeData>) => {
    updateNodeData(node.id, update)
  }

  return (
    <aside
      className="w-[300px] flex-shrink-0 flex flex-col animate-slide-in-right"
      style={{
        background: 'rgba(12, 14, 22, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderLeft: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '-12px 0 40px rgba(0,0,0,0.4)',
      }}
    >
      {/* Panel header */}
      <div
        className="px-5 py-4 flex items-center gap-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${cfg.color}22 0%, ${cfg.color}0a 100%)`,
            border: `1px solid ${cfg.color}35`,
            boxShadow: `0 0 12px ${cfg.color}20`,
          }}
        >
          <Icon size={15} style={{ color: cfg.color }} strokeWidth={1.8} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Type badge */}
          <div className="flex items-center gap-1.5 mb-0.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: cfg.color, boxShadow: `0 0 4px ${cfg.color}` }}
            />
            <span
              className="text-[10px] font-bold uppercase tracking-[0.1em]"
              style={{ color: cfg.color }}
            >
              {cfg.label}
            </span>
          </div>
          <p className="text-sm font-semibold leading-tight truncate" style={{ color: 'rgba(255,255,255,0.88)' }}>
            {data.label}
          </p>
        </div>

        <button
          onClick={() => selectNode(null)}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-150 flex-shrink-0"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.color = 'rgba(255,255,255,0.7)'
            el.style.background = 'rgba(255,255,255,0.08)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.color = 'rgba(255,255,255,0.3)'
            el.style.background = 'transparent'
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Section label */}
      <div className="px-5 pt-4 pb-2 flex items-center gap-2">
        <Settings2 size={11} style={{ color: 'rgba(255,255,255,0.2)' }} />
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Configuration
        </span>
      </div>

      {/* Form body */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
        {data.kind === 'start' && <StartForm data={data} onChange={patch} />}
        {data.kind === 'task' && <TaskForm data={data} onChange={patch} />}
        {data.kind === 'approval' && <ApprovalForm data={data} onChange={patch} />}
        {data.kind === 'automated' && <AutomatedForm data={data} onChange={patch} />}
        {data.kind === 'end' && <EndForm data={data} onChange={patch} />}
      </div>

      {/* Footer with node ID */}
      <div
        className="px-5 py-3 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <p className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.15)' }}>
          {node.id}
        </p>
      </div>
    </aside>
  )
}
