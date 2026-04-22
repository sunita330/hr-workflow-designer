import { useState } from 'react'
import {
  Play, Download, Upload, Pencil, Check, X,
  Workflow,
} from 'lucide-react'
import { useWorkflowStore } from '@/store/workflowStore'
import type { SerializedWorkflow } from '@/types/workflow'

interface HeaderProps {
  onSimulate: () => void
}

export default function Header({ onSimulate }: HeaderProps) {
  const { workflowName, setWorkflowName, serialize, importWorkflow, nodes, edges } = useWorkflowStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(workflowName)

  const commitRename = () => {
    if (draft.trim()) setWorkflowName(draft.trim())
    else setDraft(workflowName)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitRename()
    if (e.key === 'Escape') { setDraft(workflowName); setEditing(false) }
  }

  const handleExport = () => {
    const workflow = serialize()
    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${workflowName.replace(/\s+/g, '_').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const workflow = JSON.parse(ev.target?.result as string) as SerializedWorkflow
          importWorkflow(workflow)
        } catch {
          alert('Invalid workflow JSON file')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <header className="h-14 flex-shrink-0 bg-surface-1 border-b border-border flex items-center px-4 gap-4">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-2">
        <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
          <Workflow size={14} className="text-accent" />
        </div>
      </div>

      {/* Breadcrumb / workflow name */}
      <div className="flex items-center gap-2 flex-1">
        <span className="text-white/20 text-sm">/</span>
        {editing ? (
          <div className="flex items-center gap-1.5">
            <input
              autoFocus
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-surface-3 border border-accent/40 rounded-lg px-2.5 py-1 text-sm text-white
                focus:outline-none focus:border-accent/70 font-medium min-w-0 w-48"
            />
            <button onClick={commitRename} className="w-6 h-6 flex items-center justify-center text-green-400 hover:bg-green-400/10 rounded-md">
              <Check size={12} />
            </button>
            <button onClick={() => { setDraft(workflowName); setEditing(false) }} className="w-6 h-6 flex items-center justify-center text-white/30 hover:bg-surface-3 rounded-md">
              <X size={12} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setDraft(workflowName); setEditing(true) }}
            className="flex items-center gap-2 group"
          >
            <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
              {workflowName}
            </span>
            <Pencil size={11} className="text-white/20 group-hover:text-white/50 transition-colors" />
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="hidden md:flex items-center gap-4 text-xs text-white/25 font-mono">
        <span>{nodes.length} nodes</span>
        <span>{edges.length} edges</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleImport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white/80
            border border-border hover:border-border-strong hover:bg-surface-3 transition-all"
        >
          <Upload size={12} />
          <span className="hidden sm:inline">Import</span>
        </button>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white/80
            border border-border hover:border-border-strong hover:bg-surface-3 transition-all"
        >
          <Download size={12} />
          <span className="hidden sm:inline">Export</span>
        </button>
        <button
          onClick={onSimulate}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium
            bg-accent hover:bg-accent-hover text-white transition-all shadow-glow
            hover:shadow-[0_0_20px_rgba(91,124,246,0.35)]"
        >
          <Play size={12} />
          Simulate
        </button>
      </div>
    </header>
  )
}
