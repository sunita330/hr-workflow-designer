import { Play, CheckSquare, ShieldCheck, Zap, StopCircle, GripVertical, GitBranch } from 'lucide-react'
import { NODE_CONFIG } from '@/lib/nodeConfig'
import type { NodeKind } from '@/types/workflow'

const PALETTE_ORDER: NodeKind[] = ['start', 'task', 'approval', 'automated', 'end']

const ICONS = { Play, CheckSquare, ShieldCheck, Zap, StopCircle }

function DraggableNode({ kind }: { kind: NodeKind }) {
  const cfg = NODE_CONFIG[kind]
  const Icon = ICONS[cfg.icon as keyof typeof ICONS]

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/nodeKind', kind)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="group relative flex items-center gap-3 p-3 rounded-xl cursor-grab active:cursor-grabbing select-none
        transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.background = `${cfg.color}0d`
        el.style.borderColor = `${cfg.color}35`
        el.style.boxShadow = `0 4px 16px ${cfg.color}18, 0 1px 3px rgba(0,0,0,0.4)`
        el.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.background = 'rgba(255,255,255,0.025)'
        el.style.borderColor = 'rgba(255,255,255,0.07)'
        el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)'
        el.style.transform = 'translateY(0)'
      }}
    >
      {/* Colored left stripe */}
      <div
        className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: cfg.color }}
      />

      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
        style={{
          background: `${cfg.color}18`,
          border: `1px solid ${cfg.color}30`,
        }}
      >
        <Icon size={14} style={{ color: cfg.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white/75 group-hover:text-white transition-colors duration-150 leading-tight">
          {cfg.label}
        </p>
        <p className="text-[11px] text-white/30 mt-0.5 truncate leading-tight">{cfg.description}</p>
      </div>

      <GripVertical
        size={13}
        className="flex-shrink-0 transition-colors duration-150"
        style={{ color: 'rgba(255,255,255,0.15)' }}
      />
    </div>
  )
}

export default function Sidebar() {
  return (
    <aside
      className="w-64 flex-shrink-0 flex flex-col animate-slide-in-left"
      style={{
        background: 'rgba(14, 16, 24, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Brand header */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 mb-0.5">
          {/* Logo mark */}
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #5b7cf6 0%, #a855f7 100%)',
              boxShadow: '0 0 16px rgba(91,124,246,0.4)',
            }}
          >
            <GitBranch size={15} className="text-white" strokeWidth={2.2} />
          </div>
          <div>
            <p className="font-display font-bold text-white text-[15px] leading-tight tracking-tight">
              Flow<span style={{ color: '#7c9fff' }}>Verse</span>
            </p>
            <p className="text-[10px] text-white/30 leading-tight">HR Workflow Designer</p>
          </div>
        </div>
      </div>

      {/* Version pill */}
      <div className="px-5 pt-3 pb-1">
        <span
          className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{
            background: 'rgba(91,124,246,0.1)',
            border: '1px solid rgba(91,124,246,0.2)',
            color: '#7c9fff',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-soft" />
          v1.0 · Canvas
        </span>
      </div>

      {/* Node palette */}
      <div className="flex-1 overflow-y-auto px-3 pt-4 pb-3">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-3 px-2"
          style={{ color: 'rgba(255,255,255,0.22)' }}
        >
          Node Types
        </p>
        <div className="flex flex-col gap-1.5">
          {PALETTE_ORDER.map(kind => (
            <DraggableNode key={kind} kind={kind} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-4 py-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p className="text-[10px] leading-relaxed text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Drag · Connect · Configure · Simulate
        </p>
      </div>
    </aside>
  )
}
