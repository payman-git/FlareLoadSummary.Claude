import { useState } from 'react'
import ProjectInfo from './components/ProjectInfo.jsx'
import PlantUnits from './components/PlantUnits.jsx'
import ReliefCases from './components/ReliefCases.jsx'
import Summary from './components/Summary.jsx'
import { exportExcel, exportPDF } from './utils/export.js'
import { Flame, FileSpreadsheet, FileText } from 'lucide-react'

const TABS = ['Project Info', 'Plant Units', 'Relief Cases', 'Summary']

const defaultProject = {
  name: '', number: '', client: '', preparedBy: '',
  date: new Date().toISOString().slice(0, 10),
  plant: '', docNumber: '',
  massUnit: 'kg/hr', pressUnit: 'barg', tempUnit: '°C',
}

export default function App() {
  const [activeTab, setActiveTab] = useState(0)
  const [project, setProject] = useState(defaultProject)
  // units: [{ id, name, description }]
  const [units, setUnits] = useState([])
  // cases: [{ id, unitId, name, type, tag, tempRelief, pressure, unmit:{flow,mw}, mit:{flow,mw} }]
  const [cases, setCases] = useState([])

  const updateProject = (field, val) => setProject(p => ({ ...p, [field]: val }))

  // Unit CRUD
  const addUnit = () => setUnits(prev => [...prev, { id: Date.now(), name: '', description: '' }])
  const removeUnit = (id) => {
    setUnits(prev => prev.filter(u => u.id !== id))
    setCases(prev => prev.filter(c => c.unitId !== id))
  }
  const updateUnit = (id, field, val) => setUnits(prev => prev.map(u => u.id === id ? { ...u, [field]: val } : u))

  // Case CRUD
  const addCase = (unitId) => setCases(prev => [...prev, {
    id: Date.now(), unitId,
    name: '', type: 'Power failure', tag: '',
    tempRelief: '', pressure: '',
    unmit: { flow: '', mw: '' },
    mit: { flow: '', mw: '' },
  }])
  const removeCase = (id) => setCases(prev => prev.filter(c => c.id !== id))
  const updateCase = (id, field, val) => setCases(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c))
  const updateCaseSub = (id, sub, field, val) => setCases(prev => prev.map(c => c.id === id ? { ...c, [sub]: { ...c[sub], [field]: val } } : c))

  const totalCases = cases.length

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        borderBottom: '1px solid var(--border)', background: 'var(--bg-card)',
        padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Flame size={20} color="var(--accent)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, letterSpacing: '0.04em' }}>FLARE LOAD SUMMARY</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4, fontFamily: 'var(--font-mono)' }}>EPC / PETROCHEMICAL</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-export" onClick={() => exportExcel(project, units, cases)}>
            <FileSpreadsheet size={14} /><span>Excel</span>
          </button>
          <button className="btn-export accent" onClick={() => exportPDF(project, units, cases)}>
            <FileText size={14} /><span>PDF</span>
          </button>
        </div>
      </header>

      <nav style={{
        borderBottom: '1px solid var(--border)', background: 'var(--bg-card)',
        padding: '0 24px', display: 'flex', flexShrink: 0,
      }}>
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '10px 20px', fontSize: 13, fontFamily: 'var(--font-sans)',
            color: activeTab === i ? 'var(--accent)' : 'var(--text-secondary)',
            borderBottom: activeTab === i ? '2px solid var(--accent)' : '2px solid transparent',
            marginBottom: -1, transition: 'color 0.15s',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {tab}
            {i === 1 && units.length > 0 && <Badge>{units.length}</Badge>}
            {i === 2 && totalCases > 0 && <Badge>{totalCases}</Badge>}
          </button>
        ))}
      </nav>

      <main style={{ flex: 1, padding: '24px', overflowY: 'auto', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
        {activeTab === 0 && <ProjectInfo project={project} updateProject={updateProject} onNext={() => setActiveTab(1)} />}
        {activeTab === 1 && <PlantUnits units={units} addUnit={addUnit} removeUnit={removeUnit} updateUnit={updateUnit} onNext={() => setActiveTab(2)} />}
        {activeTab === 2 && <ReliefCases cases={cases} units={units} project={project} addCase={addCase} removeCase={removeCase} updateCase={updateCase} updateCaseSub={updateCaseSub} onNext={() => setActiveTab(3)} />}
        {activeTab === 3 && <Summary cases={cases} units={units} project={project} />}
      </main>

      <style>{`
        .btn-export { display:flex;align-items:center;gap:6px;padding:6px 14px;font-size:12px;font-family:var(--font-sans);background:var(--bg-card2);color:var(--text-secondary);border:1px solid var(--border-mid);border-radius:4px;cursor:pointer;transition:all 0.15s; }
        .btn-export:hover { border-color:var(--border-hi);color:var(--text-primary); }
        .btn-export.accent { color:var(--accent);border-color:var(--accent-border);background:var(--accent-dim); }
        .btn-export.accent:hover { background:rgba(249,115,22,0.2); }
      `}</style>
    </div>
  )
}

function Badge({ children }) {
  return (
    <span style={{
      background: 'var(--accent-dim)', color: 'var(--accent)',
      border: '1px solid var(--accent-border)',
      borderRadius: 10, fontSize: 10, padding: '1px 6px', fontFamily: 'var(--font-mono)',
    }}>{children}</span>
  )
}
