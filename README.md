# FlowForge — HR Workflow Designer

A production-grade HR Workflow Designer built with React, TypeScript, and React Flow. Design, configure, and simulate HR workflows through an intuitive visual canvas.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Requirements:** Node.js 18+

---

## Architecture

### Folder Structure

```
src/
├── components/
│   ├── canvas/
│   │   └── WorkflowCanvas.tsx     # ReactFlow wrapper, drag-drop, edge defaults
│   ├── nodes/
│   │   ├── BaseNode.tsx           # Unified node renderer for all types
│   │   └── index.tsx              # Thin type wrappers + nodeTypes registry
│   ├── panels/
│   │   ├── ConfigPanel.tsx        # Right-side node configuration panel
│   │   ├── NodeForms.tsx          # Per-node-type form components
│   │   ├── FormFields.tsx         # Reusable form primitives (Field, Select, Toggle, KVEditor)
│   │   └── SimulationPanel.tsx    # Modal execution sandbox
│   ├── sidebar/
│   │   └── Sidebar.tsx            # Draggable node palette
│   └── ui/
│       └── Topbar.tsx             # Top bar with name editing, export/import, simulate
├── hooks/                         # (reserved for custom hooks as features grow)
├── lib/
│   └── nodeConfig.ts              # Node type → color/icon/label mapping
├── mocks/
│   └── api.ts                     # Mock GET /automations + POST /simulate
├── store/
│   └── workflowStore.ts           # Zustand store: nodes, edges, selection, serialization
├── types/
│   └── workflow.ts                # All TypeScript interfaces
├── App.tsx
├── main.tsx
└── index.css
```

### Design Decisions

**1. Single-responsibility nodes**  
`BaseNode` handles all rendering. Individual node wrappers (`StartNode`, `TaskNode`, etc.) are one-liners that configure handle visibility. This means new node types need zero rendering code — just a data type, a config entry, and a form component.

**2. Zustand for state**  
Zustand was chosen over Redux for its minimal boilerplate while still providing a clean, subscribe-friendly API. The entire workflow state — nodes, edges, selection — lives in one flat store, making serialization trivial.

**3. Mock API as a proper module**  
`src/mocks/api.ts` is structured like a real API client (async functions, typed responses, simulated latency). Swapping it for a real HTTP layer requires changing only the function bodies — all consumers remain untouched.

**4. Topological sort for simulation**  
The simulator runs a Kahn's algorithm topological sort to determine execution order and detect cycles. Steps are returned in correct dependency order, reflecting how a real workflow engine would process the graph.

**5. Form extensibility**  
`NodeForms.tsx` exports one form component per node type. Adding a new type requires: a new type in `workflow.ts`, an entry in `nodeConfig.ts`, a form component, and a case in `ConfigPanel.tsx`. The form primitives in `FormFields.tsx` are reusable across all forms.

**6. No backend, no auth**  
As specified. All persistence is in-memory via Zustand. Export/import provides a portable JSON format that can be round-tripped.

---

## Features Implemented

| Feature | Status |
|---|---|
| Drag-and-drop canvas | ✅ |
| 5 custom node types | ✅ |
| Per-node configuration forms | ✅ |
| Dynamic action params (Automated node) | ✅ |
| Key-value metadata / custom fields | ✅ |
| Mock API layer (GET /automations, POST /simulate) | ✅ |
| Workflow simulation with execution log | ✅ |
| Structural validation (missing start/end, disconnected nodes, cycles) | ✅ |
| Export workflow as JSON | ✅ |
| Import workflow from JSON | ✅ |
| Mini-map | ✅ |
| Inline node delete | ✅ |
| Workflow name editing | ✅ |
| Snap-to-grid | ✅ |

## What I'd Add With More Time

- **Undo/Redo** — the store is already structured to drop in `zundo` (temporal middleware); the import is stubbed in the store file
- **Workflow templates** — pre-built onboarding, leave approval, offboarding templates in the sidebar
- **Visual validation indicators** — red glow on nodes with validation errors directly on the canvas
- **Edge labels** — click an edge to add a label/condition (e.g. "Approved" / "Rejected" paths)
- **Collaborative cursors** — presence via WebSockets (Liveblocks/PartyKit)
- **Backend persistence** — replace mock API with a FastAPI backend + PostgreSQL

---

## Tech Stack

- **React 18** + **Vite**
- **TypeScript** (strict mode)
- **React Flow 11**
- **Zustand** (state management)
- **Tailwind CSS** (utility-first styling)
- **Lucide React** (icons)
- **nanoid** (ID generation)
