import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import {
  Play, CheckSquare, ShieldCheck, Zap, StopCircle,
  Pencil, Trash2,
} from 'lucide-react'
import type { WorkflowNodeData } from '@/types/workflow'
import { NODE_CONFIG } from '@/lib/nodeConfig'
import { useWorkflowStore } from '@/store/workflowStore'

const ICONS = { Play, CheckSquare, ShieldCheck, Zap, StopCircle }

interface BaseNodeProps extends NodeProps<WorkflowNodeData> {
  showSourceHandle?: boolean
  showTargetHandle?: boolean
}

function BaseNode({ id, data, selected, showSourceHandle = true, showTargetHandle = true }: BaseNodeProps) {
  const { selectNode, deleteNode } = useWorkflowStore()
  const cfg = NODE_CONFIG[data.kind]
  const Icon = ICONS[cfg.icon as keyof typeof ICONS]
  const subtitle = getSubtitle(data)

  const selectedShadow = `0 0 0 2px ${cfg.color}, 0 0 32px ${cfg.color}30, 0 8px 32px rgba(0,0,0,0.5)`
  const defaultShadow = '0 2px 8px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.07)'
  const hoverShadow = `0 0 0 1px ${cfg.color}50, 0 0 20px ${cfg.color}18, 0 8px 24px rgba(0,0,0,0.5)`

  return (
    <div
      className="relative group"
      style={{ minWidth: 232, maxWidth: 232 }}
      onClick={() => selectNode(id)}
    >
      {/* Target handle */}
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Top}
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            border: `2px solid ${cfg.color}`,
            background: '#0d0f18',
            top: -5,
          }}
        />
      )}

      {/* Card */}
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-200"
        style={{
          background: 'linear-gradient(160deg, #181c2a 0%, #0f1118 100%)',
          boxShadow: selected ? selectedShadow : defaultShadow,
          border: selected
            ? `1px solid ${cfg.color}60`
            : '1px solid rgba(255,255,255,0.08)',
        }}
        onMouseEnter={e => {
          if (!selected) {
            const el = e.currentTarget as HTMLDivElement
            el.style.boxShadow = hoverShadow
            el.style.borderColor = `${cfg.color}35`
          }
        }}
        onMouseLeave={e => {
          if (!selected) {
            const el = e.currentTarget as HTMLDivElement
            el.style.boxShadow = defaultShadow
            el.style.borderColor = 'rgba(255,255,255,0.08)'
          }
        }}
      >
        {/* Top glow strip */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${cfg.color} 40%, ${cfg.color}80 70%, transparent 100%)`,
            opacity: selected ? 1 : 0.6,
          }}
        />

        {/* Ambient glow behind icon area */}
        <div
          className="absolute top-0 left-0 w-24 h-24 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 20px 20px, ${cfg.color}12 0%, transparent 65%)`,
          }}
        />

        <div className="relative p-4">
          {/* Type badge row */}
          <div className="flex items-center justify-between mb-3">
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
              style={{
                background: `${cfg.color}14`,
                border: `1px solid ${cfg.color}28`,
              }}
            >
              <Icon size={10} style={{ color: cfg.color }} strokeWidth={2.5} />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.1em]"
                style={{ color: cfg.color }}
              >
                {cfg.label}
              </span>
            </div>

            {/* Action buttons */}
            <div
              className={`flex gap-1 transition-all duration-150 ${
                selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              <button
                className="w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-100"
                style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.color = '#7c9fff'
                  el.style.background = 'rgba(91,124,246,0.15)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.color = 'rgba(255,255,255,0.35)'
                  el.style.background = 'transparent'
                }}
                onClick={e => { e.stopPropagation(); selectNode(id) }}
              >
                <Pencil size={10} strokeWidth={2.5} />
              </button>
              <button
                className="w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-100"
                style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.color = '#f87171'
                  el.style.background = 'rgba(239,68,68,0.12)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.color = 'rgba(255,255,255,0.35)'
                  el.style.background = 'transparent'
                }}
                onClick={e => { e.stopPropagation(); deleteNode(id) }}
              >
                <Trash2 size={10} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Main content row */}
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div
              className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${cfg.color}22 0%, ${cfg.color}0a 100%)`,
                border: `1px solid ${cfg.color}30`,
                boxShadow: selected ? `0 0 12px ${cfg.color}30` : 'none',
              }}
            >
              <Icon size={16} style={{ color: cfg.color }} strokeWidth={1.8} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 pt-0.5">
              <p
                className="font-semibold text-sm leading-tight truncate"
                style={{ color: 'rgba(255,255,255,0.92)' }}
              >
                {data.label}
              </p>
              {subtitle && (
                <p
                  className="text-[11px] mt-1 truncate leading-tight"
                  style={{ color: 'rgba(255,255,255,0.38)' }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom accent when selected */}
        {selected && (
          <div
            className="h-[2px]"
            style={{
              background: `linear-gradient(90deg, ${cfg.color}80, ${cfg.color}30, transparent)`,
            }}
          />
        )}
      </div>

      {/* Source handle */}
      {showSourceHandle && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            border: `2px solid ${cfg.color}`,
            background: '#0d0f18',
            bottom: -5,
          }}
        />
      )}
    </div>
  )
}

function getSubtitle(data: WorkflowNodeData): string | null {
  switch (data.kind) {
    case 'task': return data.assignee ? `Assigned → ${data.assignee}` : null
    case 'approval': return data.approverRole ? `Approver: ${data.approverRole}` : null
    case 'automated': return data.actionId ? data.actionId.replace(/_/g, ' ') : 'No action selected'
    case 'start': return data.metadata.length ? `${data.metadata.length} metadata field${data.metadata.length > 1 ? 's' : ''}` : 'Workflow entry'
    case 'end': return data.endMessage || 'Workflow exit'
    default: return null
  }
}

export default memo(BaseNode)
