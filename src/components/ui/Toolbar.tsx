import { useState, useRef } from 'react'
import {
  Play, Download, Upload, Pencil, Check, X,
  Workflow, AlertTriangle
} from 'lucide-react'
import { useWorkflowStore } from '@/store/workflowStore'
import type { SerializedWorkflow } from '@/types/workflow'

interface ToolbarProps {
  onSimulate: () => void
}

export default function Toolbar({ onSimulate }: ToolbarProps) {
  const { workflowName, setWorkflowName, serialize, importWorkflow, nodes, edges } = useWorkflowStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(workflowName)
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const commitName = () => {
    if (draft.trim()) setWorkflowName(draft.trim())
    setEditing(false)
  }

  const exportWorkflow = () => {
    const data = serialize()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${workflowName.toLowerCase().replace(/\s+/g, '-')}.workflow.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const json = JSON.parse(ev.target?.result as string) as SerializedWorkflow
        if (!json.nodes || !json.edges) throw new Error('Invalid workflow format')
        importWorkflow(json)
        setImportError(null)
      } catch {
        setImportError('Invalid workflow file')
        setTimeout(() => setImportError(null), 3000)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const nodeCount = nodes.length
  const edgeCount = edges.length

  return (
    <header className="h-14 bg-surface-1 border-b border-border flex items-center px-4 gap-4 flex-shrink-0">
      {/* Logo mark */}
      <div className="flex items-center gap-2 pr-4 border-r border-border">
        <div className="w-6 h-6 rounded-md bg-accent/20 border border-accent/30 flex items-center justify-center">
          <Workflow size={12} className="text-accent" />
        </div>
      </div>

      {/* Workflow name editor */}
      <div className="flex items-center gap-2 flex-1">
        {editing ? (
          <div className="flex items-center gap-1.5">
            <input
              autoFocus
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') commitName()
                if (e.key === 'Escape') { setEditing(false); setDraft(workflowName) }
              }}
              className="bg-surface-3 border border-accent/40 rounded-lg px-3 py-1.5 text-sm text-white
                focus:outline-none focus:ring-1 focus:ring-accent/30 font-display font-semibold w-64"
            />
            <button onClick={commitName} className="w-7 h-7 rounded-lg bg-accent/20 hover:bg-accent/30 flex items-center justify-center text-accent transition-colors">
              <Check size={13} />
            </button>
            <button onClick={() => { setEditing(false); setDraft(workflowName) }} className="w-7 h-7 rounded-lg hover:bg-surface-3 flex items-center justify-center text-white/40 transition-colors">
              <X size={13} />
            </button>
          </div>
        ) : (
          <button
            className="flex items-center gap-2 group"
            onClick={() => { setDraft(workflowName); setEditing(true) }}
          >
            <span className="font-display font-semibold text-white text-sm">{workflowName}</span>
            <Pencil size={11} className="text-white/20 group-hover:text-accent transition-colors" />
          </button>
        )}

        {/* Stats chips */}
        <div className="flex items-center gap-1.5 ml-2">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-3 text-white/30 border border-border font-mono">
            {nodeCount} nodes
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-3 text-white/30 border border-border font-mono">
            {edgeCount} edges
          </span>
        </div>

        {importError && (
          <div className="flex items-center gap-1.5 ml-2 text-red-400 text-xs animate-fade-in">
            <AlertTriangle size={12} /> {importError}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/50
            hover:text-white/80 hover:bg-surface-3 border border-transparent hover:border-border
            transition-all duration-150"
        >
          <Upload size={13} />
          <span className="hidden sm:inline">Import</span>
        </button>

        <button
          onClick={exportWorkflow}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/50
            hover:text-white/80 hover:bg-surface-3 border border-transparent hover:border-border
            transition-all duration-150"
        >
          <Download size={13} />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button
          onClick={onSimulate}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold text-white
            bg-accent hover:bg-accent-hover transition-all duration-150 shadow-glow"
        >
          <Play size={13} />
          Simulate
        </button>
      </div>
    </header>
  )
}
