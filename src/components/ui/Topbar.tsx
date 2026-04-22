import { useState } from 'react'
import {
  Download, Upload, Pencil, Check, X,
  FlaskConical, GitBranch
} from 'lucide-react'
import { useWorkflowStore } from '@/store/workflowStore'
import type { SerializedWorkflow } from '@/types/workflow'

interface TopbarProps {
  onSimulate: () => void
}

export default function Topbar({ onSimulate }: TopbarProps) {
  const { workflowName, setWorkflowName, serialize, importWorkflow, nodes, edges } = useWorkflowStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(workflowName)

  const commitRename = () => {
    if (draft.trim()) setWorkflowName(draft.trim())
    setEditing(false)
  }

  const handleExport = () => {
    const workflow = serialize()
    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${workflow.name.toLowerCase().replace(/\s+/g, '-')}.workflow.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const workflow: SerializedWorkflow = JSON.parse(text)
        importWorkflow(workflow)
      } catch {
        alert('Invalid workflow file')
      }
    }
    input.click()
  }

  return (
    <header
      className="h-14 flex-shrink-0 flex items-center px-4 gap-4"
      style={{
        background: 'rgba(12, 14, 20, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      {/* Brand mark — compact version of sidebar logo */}
      <div className="flex items-center gap-2.5 pr-4" style={{ borderRight: '1px solid rgba(255,255,255,0.08)' }}>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #5b7cf6 0%, #a855f7 100%)',
            boxShadow: '0 0 12px rgba(91,124,246,0.35)',
          }}
        >
          <GitBranch size={13} className="text-white" strokeWidth={2.3} />
        </div>
        <span className="font-display font-bold text-[14px] text-white/90 tracking-tight hidden sm:block">
          Flow<span style={{ color: '#7c9fff' }}>Verse</span>
        </span>
      </div>

      {/* Workflow name editor */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') commitRename()
                if (e.key === 'Escape') setEditing(false)
              }}
              className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-surface-3 border border-accent/50
                focus:outline-none focus:ring-1 focus:ring-accent/30 min-w-0 w-56"
            />
            <button onClick={commitRename} className="w-7 h-7 flex items-center justify-center rounded-lg text-green-400 hover:bg-green-400/10 transition-all">
              <Check size={13} />
            </button>
            <button onClick={() => setEditing(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:bg-surface-3 transition-all">
              <X size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setDraft(workflowName); setEditing(true) }}
            className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-150"
            style={{ background: 'transparent' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          >
            <span className="text-sm font-semibold text-white/70 group-hover:text-white/95 transition-colors">{workflowName}</span>
            <Pencil size={11} className="text-white/20 group-hover:text-white/45 transition-colors" />
          </button>
        )}

        {/* Stats pills */}
        <div className="flex items-center gap-1.5 ml-1">
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-md"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}
          >
            {nodes.length}N · {edges.length}E
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleImport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
          style={{
            color: 'rgba(255,255,255,0.45)',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.color = 'rgba(255,255,255,0.8)'
            el.style.borderColor = 'rgba(255,255,255,0.15)'
            el.style.background = 'rgba(255,255,255,0.06)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.color = 'rgba(255,255,255,0.45)'
            el.style.borderColor = 'rgba(255,255,255,0.08)'
            el.style.background = 'rgba(255,255,255,0.03)'
          }}
        >
          <Upload size={12} />
          Import
        </button>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
          style={{
            color: 'rgba(255,255,255,0.45)',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.color = 'rgba(255,255,255,0.8)'
            el.style.borderColor = 'rgba(255,255,255,0.15)'
            el.style.background = 'rgba(255,255,255,0.06)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.color = 'rgba(255,255,255,0.45)'
            el.style.borderColor = 'rgba(255,255,255,0.08)'
            el.style.background = 'rgba(255,255,255,0.03)'
          }}
        >
          <Download size={12} />
          Export
        </button>

        <div className="w-px h-5 mx-0.5" style={{ background: 'rgba(255,255,255,0.08)' }} />

        <button
          onClick={onSimulate}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-150"
          style={{
            background: 'linear-gradient(135deg, #5b7cf6 0%, #7c5bdf 100%)',
            boxShadow: '0 0 20px rgba(91,124,246,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(91,124,246,0.5), inset 0 1px 0 rgba(255,255,255,0.15)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(91,124,246,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'
          }}
        >
          <FlaskConical size={12} />
          Simulate
        </button>
      </div>
    </header>
  )
}
