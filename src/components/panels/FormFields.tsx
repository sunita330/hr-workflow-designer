import React from 'react'
import { Plus, X, ChevronDown } from 'lucide-react'
import { nanoid } from 'nanoid'
import type { KeyValuePair } from '@/types/workflow'

// ─── Shared style constants ──────────────────────────────────────────────────

const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '10px',
  fontSize: '13px',
  color: 'rgba(255,255,255,0.85)',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}

const inputFocusStyle = {
  borderColor: 'rgba(91,124,246,0.55)',
  boxShadow: '0 0 0 3px rgba(91,124,246,0.1)',
}

function useInputFocus() {
  const [focused, setFocused] = React.useState(false)
  return {
    focused,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: (extra?: React.CSSProperties): React.CSSProperties => ({
      ...inputBase,
      ...(focused ? inputFocusStyle : {}),
      ...extra,
    }),
  }
}

// ─── Label ───────────────────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label
      className="flex items-center gap-1 text-xs font-semibold mb-1.5"
      style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.03em' }}
    >
      {children}
      {required && (
        <span style={{ color: '#f87171', fontSize: 9 }}>●</span>
      )}
    </label>
  )
}

// ─── Field ───────────────────────────────────────────────────────────────────

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  required?: boolean
  hint?: string
}

export function Field({ label, required, hint, ...props }: FieldProps) {
  const { style, onFocus, onBlur } = useInputFocus()
  return (
    <div>
      <Label required={required}>{label}</Label>
      <input
        {...props}
        style={style({ caretColor: '#7c9fff' })}
        onFocus={e => { onFocus(); props.onFocus?.(e) }}
        onBlur={e => { onBlur(); props.onBlur?.(e) }}
        className="placeholder:text-white/20 block"
      />
      {hint && (
        <p className="mt-1.5 text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.22)' }}>
          {hint}
        </p>
      )}
    </div>
  )
}

// ─── Textarea ────────────────────────────────────────────────────────────────

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export function TextareaField({ label, ...props }: TextareaFieldProps) {
  const { style, onFocus, onBlur } = useInputFocus()
  return (
    <div>
      <Label>{label}</Label>
      <textarea
        {...props}
        rows={3}
        style={{ ...style(), resize: 'none', caretColor: '#7c9fff' } as React.CSSProperties}
        onFocus={e => { onFocus(); props.onFocus?.(e) }}
        onBlur={e => { onBlur(); props.onBlur?.(e) }}
        className="placeholder:text-white/20 block"
      />
    </div>
  )
}

// ─── Select ──────────────────────────────────────────────────────────────────

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: { value: string; label: string }[]
}

export function SelectField({ label, options, ...props }: SelectFieldProps) {
  const [focused, setFocused] = React.useState(false)
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <select
          {...props}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...inputBase,
            appearance: 'none',
            cursor: 'pointer',
            paddingRight: 32,
            ...(focused ? inputFocusStyle : {}),
          }}
          className="block"
        >
          <option value="">Select…</option>
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        />
      </div>
    </div>
  )
}

// ─── Toggle ──────────────────────────────────────────────────────────────────

interface ToggleProps {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  description?: string
}

export function Toggle({ label, checked, onChange, description }: ToggleProps) {
  return (
    <div
      className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div>
        <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{label}</p>
        {description && (
          <p className="text-[11px] mt-0.5 leading-tight" style={{ color: 'rgba(255,255,255,0.28)' }}>
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative flex-shrink-0 transition-all duration-200"
        style={{
          width: 36,
          height: 20,
          borderRadius: 10,
          background: checked
            ? 'linear-gradient(90deg, #5b7cf6, #7c5bdf)'
            : 'rgba(255,255,255,0.1)',
          border: checked ? '1px solid rgba(91,124,246,0.4)' : '1px solid rgba(255,255,255,0.1)',
          boxShadow: checked ? '0 0 10px rgba(91,124,246,0.3)' : 'none',
        }}
      >
        <span
          className="absolute top-[2px] w-3.5 h-3.5 rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: checked ? 'translateX(17px)' : 'translateX(2px)' }}
        />
      </button>
    </div>
  )
}

// ─── KV Editor ───────────────────────────────────────────────────────────────

interface KVEditorProps {
  label: string
  pairs: KeyValuePair[]
  onChange: (pairs: KeyValuePair[]) => void
}

export function KVEditor({ label, pairs, onChange }: KVEditorProps) {
  const add = () => onChange([...pairs, { id: nanoid(), key: '', value: '' }])
  const remove = (id: string) => onChange(pairs.filter(p => p.id !== id))
  const update = (id: string, field: 'key' | 'value', val: string) =>
    onChange(pairs.map(p => (p.id === id ? { ...p, [field]: val } : p)))

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label>{label}</Label>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 text-[11px] font-semibold transition-colors"
          style={{ color: 'rgba(91,124,246,0.9)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#7c9fff' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(91,124,246,0.9)' }}
        >
          <Plus size={11} strokeWidth={2.5} />
          Add field
        </button>
      </div>

      {pairs.length > 0 && (
        <div className="space-y-1.5">
          {pairs.map(p => (
            <div key={p.id} className="flex gap-1.5 items-center">
              <input
                placeholder="key"
                value={p.key}
                onChange={e => update(p.id, 'key', e.target.value)}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: 8,
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.75)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  outline: 'none',
                }}
                className="placeholder:text-white/15"
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(91,124,246,0.4)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
              />
              <input
                placeholder="value"
                value={p.value}
                onChange={e => update(p.id, 'value', e.target.value)}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: 8,
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.75)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  outline: 'none',
                }}
                className="placeholder:text-white/15"
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(91,124,246,0.4)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
              />
              <button
                type="button"
                onClick={() => remove(p.id)}
                className="w-6 h-6 flex items-center justify-center rounded-lg transition-all flex-shrink-0"
                style={{ color: 'rgba(255,255,255,0.2)' }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.color = '#f87171'
                  el.style.background = 'rgba(239,68,68,0.1)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.color = 'rgba(255,255,255,0.2)'
                  el.style.background = 'transparent'
                }}
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {pairs.length === 0 && (
        <div
          className="text-center py-3 rounded-xl text-[11px]"
          style={{
            color: 'rgba(255,255,255,0.2)',
            border: '1px dashed rgba(255,255,255,0.08)',
          }}
        >
          No fields yet
        </div>
      )}
    </div>
  )
}
