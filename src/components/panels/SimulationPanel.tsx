import { useState } from 'react'
import {
  Play, X, CheckCircle2, XCircle, Clock, Loader2,
  AlertTriangle, ChevronRight, Terminal, Zap
} from 'lucide-react'
import { useWorkflowStore } from '@/store/workflowStore'
import { simulateWorkflow } from '@/mocks/api'
import type { SimulationResult, SimulationStep, NodeKind } from '@/types/workflow'
import { NODE_CONFIG } from '@/lib/nodeConfig'

interface SimulationPanelProps {
  onClose: () => void
}

const KIND_COLOR: Record<NodeKind, string> = {
  start: '#22c55e',
  task: '#5b7cf6',
  approval: '#f59e0b',
  automated: '#a855f7',
  end: '#ef4444',
}

function StepRow({ step, index, visible }: { step: SimulationStep; index: number; visible: boolean }) {
  const color = KIND_COLOR[step.kind]
  const cfg = NODE_CONFIG[step.kind]
  const isLast = false // handled by parent

  const statusIcon = {
    success: <CheckCircle2 size={12} style={{ color: '#4ade80' }} />,
    error:   <XCircle     size={12} style={{ color: '#f87171' }} />,
    running: <Loader2     size={12} style={{ color: '#7c9fff' }} className="animate-spin" />,
    pending: <Clock       size={12} style={{ color: 'rgba(255,255,255,0.2)' }} />,
    skipped: <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.2)' }} />,
  }[step.status]

  const rowBg = step.status === 'success'
    ? 'rgba(74,222,128,0.04)'
    : step.status === 'error'
    ? 'rgba(248,113,113,0.05)'
    : 'rgba(255,255,255,0.02)'

  const rowBorder = step.status === 'success'
    ? 'rgba(74,222,128,0.12)'
    : step.status === 'error'
    ? 'rgba(248,113,113,0.15)'
    : 'rgba(255,255,255,0.06)'

  return (
    <div
      className="transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        transitionDelay: `${index * 60}ms`,
      }}
    >
      <div
        className="flex gap-3 p-3 rounded-xl"
        style={{ background: rowBg, border: `1px solid ${rowBorder}` }}
      >
        {/* Step number */}
        <div
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
          style={{
            background: `${color}18`,
            border: `1px solid ${color}28`,
          }}
        >
          <span className="text-[9px] font-bold font-mono" style={{ color }}>{index + 1}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {statusIcon}
            <span
              className="text-sm font-semibold truncate"
              style={{ color: 'rgba(255,255,255,0.82)' }}
            >
              {step.nodeLabel}
            </span>
            <span
              className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-widest flex-shrink-0"
              style={{ background: `${color}14`, color }}
            >
              {cfg.label}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>
            {step.message}
          </p>
          {step.status === 'success' && step.duration > 0 && (
            <p className="text-[10px] mt-0.5 font-mono" style={{ color: 'rgba(255,255,255,0.18)' }}>
              {step.duration}ms
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SimulationPanel({ onClose }: SimulationPanelProps) {
  const { serialize } = useWorkflowStore()
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [running, setRunning] = useState(false)
  const [stepsVisible, setStepsVisible] = useState(false)

  const run = async () => {
    setRunning(true)
    setResult(null)
    setStepsVisible(false)
    const workflow = serialize()
    const res = await simulateWorkflow(workflow)
    setResult(res)
    setRunning(false)
    setTimeout(() => setStepsVisible(true), 40)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity"
        style={{ background: 'rgba(4,5,10,0.75)', backdropFilter: 'blur(6px)' }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg flex flex-col animate-fade-in"
        style={{
          maxHeight: '82vh',
          background: 'linear-gradient(160deg, #111420 0%, #0c0e18 100%)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 20,
          boxShadow: '0 0 0 1px rgba(91,124,246,0.08), 0 32px 80px rgba(0,0,0,0.7)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-8 right-8 h-[1px] rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(91,124,246,0.6), transparent)' }}
        />

        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(91,124,246,0.2), rgba(124,91,223,0.1))',
              border: '1px solid rgba(91,124,246,0.3)',
              boxShadow: '0 0 16px rgba(91,124,246,0.2)',
            }}
          >
            <Terminal size={15} className="text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Workflow Simulator
            </p>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Validate structure and trace execution
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">

          {/* Empty state */}
          {!result && !running && (
            <div className="text-center py-10">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: 'rgba(91,124,246,0.08)',
                  border: '1px solid rgba(91,124,246,0.15)',
                }}
              >
                <Zap size={22} style={{ color: 'rgba(91,124,246,0.6)' }} />
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Ready to simulate
              </p>
              <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Validates graph structure, required fields, and traces each step
              </p>
            </div>
          )}

          {/* Validation errors */}
          {result && result.errors.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Issues
              </p>
              {result.errors.map((err, i) => (
                <div
                  key={i}
                  className="flex gap-2.5 p-3 rounded-xl"
                  style={{
                    background: 'rgba(251,191,36,0.06)',
                    border: '1px solid rgba(251,191,36,0.15)',
                  }}
                >
                  <AlertTriangle size={13} style={{ color: '#fbbf24', marginTop: 1, flexShrink: 0 }} />
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {err.message}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Execution steps */}
          {result && result.steps.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  Execution Log
                </p>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={
                    result.success
                      ? { background: 'rgba(74,222,128,0.12)', color: '#4ade80' }
                      : { background: 'rgba(248,113,113,0.12)', color: '#f87171' }
                  }
                >
                  {result.success ? '✓ Passed' : '✗ Failed'}
                </span>
              </div>

              <div className="space-y-1.5">
                {result.steps.map((step, i) => (
                  <StepRow key={step.nodeId} step={step} index={i} visible={stepsVisible} />
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {result?.summary && (
            <div
              className="p-3 rounded-xl text-xs leading-relaxed"
              style={
                result.success
                  ? {
                      background: 'rgba(74,222,128,0.06)',
                      border: '1px solid rgba(74,222,128,0.15)',
                      color: 'rgba(134,239,172,0.8)',
                    }
                  : {
                      background: 'rgba(251,191,36,0.06)',
                      border: '1px solid rgba(251,191,36,0.15)',
                      color: 'rgba(253,224,71,0.7)',
                    }
              }
            >
              {result.summary}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-4 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <button
            onClick={run}
            disabled={running}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-150"
            style={{
              background: running
                ? 'rgba(91,124,246,0.4)'
                : 'linear-gradient(135deg, #5b7cf6 0%, #7c5bdf 100%)',
              boxShadow: running ? 'none' : '0 0 24px rgba(91,124,246,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
              cursor: running ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => {
              if (!running) (e.currentTarget as HTMLButtonElement).style.boxShadow =
                '0 0 36px rgba(91,124,246,0.55), inset 0 1px 0 rgba(255,255,255,0.15)'
            }}
            onMouseLeave={e => {
              if (!running) (e.currentTarget as HTMLButtonElement).style.boxShadow =
                '0 0 24px rgba(91,124,246,0.35), inset 0 1px 0 rgba(255,255,255,0.15)'
            }}
          >
            {running ? (
              <><Loader2 size={15} className="animate-spin" /> Running simulation…</>
            ) : (
              <><Play size={15} /> Run Simulation</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
