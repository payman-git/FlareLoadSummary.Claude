import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronRight, ArrowRight, AlertTriangle } from 'lucide-react'

const CASE_TYPES = [
  'Power failure','Fire case','Blocked outlet','Cooling water failure',
  'Reflux failure','Instrument air failure','Normal blowdown','Emergency blowdown',
  'Loss of cooling','Loss of heat input','Tube rupture','Other',
]

const Label = ({ children }) => (
  <label style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{children}</label>
)
const Field = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}><Label>{label}</Label>{children}</div>
)

function CaseRow({ c, project, removeCase, updateCase, updateCaseSub }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 6, marginBottom: 8, overflow: 'hidden' }}>
      <div onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer',
        borderBottom: open ? '1px solid var(--border)' : 'none',
      }}>
        {open ? <ChevronDown size={14} color="var(--text-muted)" /> : <ChevronRight size={14} color="var(--text-muted)" />}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', minWidth: 60 }}>{c.tag || '—'}</span>
        <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{c.name || <span style={{ color: 'var(--text-muted)' }}>New relief source</span>}</span>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border-mid)', borderRadius: 3, padding: '2px 8px' }}>{c.type}</span>
        <button onClick={e => { e.stopPropagation(); removeCase(c.id) }} style={{
          display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', fontSize: 11,
          background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 3, cursor: 'pointer',
        }}>
          <Trash2 size={11} />
        </button>
      </div>

      {open && (
        <div style={{ padding: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: 12, marginBottom: 12 }}>
            <Field label="Relief source / description">
              <input value={c.name} onChange={e => updateCase(c.id, 'name', e.target.value)} placeholder="e.g. Feed pump seal failure" />
            </Field>
            <Field label="Case type">
              <select value={c.type} onChange={e => updateCase(c.id, 'type', e.target.value)}>
                {CASE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Equipment tag">
              <input value={c.tag} onChange={e => updateCase(c.id, 'tag', e.target.value)} placeholder="e.g. V-101" />
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <Field label={`Relieving temp (${project.tempUnit})`}>
              <input type="number" value={c.tempRelief} onChange={e => updateCase(c.id, 'tempRelief', e.target.value)} placeholder="e.g. 250" />
            </Field>
            <Field label={`Relieving pressure (${project.pressUnit})`}>
              <input type="number" value={c.pressure} onChange={e => updateCase(c.id, 'pressure', e.target.value)} placeholder="e.g. 10.5" />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {/* Unmitigated */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--yellow-border)', borderRadius: 6, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--yellow)', letterSpacing: '0.06em', marginBottom: 12 }}>⚠ UNMITIGATED</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Field label={`Vapor flow (${project.massUnit})`}>
                  <input type="number" value={c.unmit.flow} onChange={e => updateCaseSub(c.id, 'unmit', 'flow', e.target.value)} placeholder="0.0" />
                </Field>
                <Field label="Mol. weight (MW)">
                  <input type="number" value={c.unmit.mw} onChange={e => updateCaseSub(c.id, 'unmit', 'mw', e.target.value)} placeholder="—" />
                </Field>
              </div>
            </div>
            {/* Mitigated */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--green-border)', borderRadius: 6, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--green)', letterSpacing: '0.06em', marginBottom: 12 }}>✓ MITIGATED</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Field label={`Vapor flow (${project.massUnit})`}>
                  <input type="number" value={c.mit.flow} onChange={e => updateCaseSub(c.id, 'mit', 'flow', e.target.value)} placeholder="0.0" />
                </Field>
                <Field label="Mol. weight (MW)">
                  <input type="number" value={c.mit.mw} onChange={e => updateCaseSub(c.id, 'mit', 'mw', e.target.value)} placeholder="—" />
                </Field>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ReliefCases({ cases, units, project, addCase, removeCase, updateCase, updateCaseSub, onNext }) {
  if (units.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <AlertTriangle size={32} color="var(--yellow)" style={{ marginBottom: 12 }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No plant units defined yet.</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Go to the "Plant Units" tab first to define the units in scope.</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Relief cases</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          Add relief sources for each plant unit. Each source has separate unmitigated and mitigated loads.
        </p>
      </div>

      {units.map((unit, uidx) => {
        const unitCases = cases.filter(c => c.unitId === unit.id)
        return (
          <div key={unit.id} style={{ marginBottom: 28 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
                  background: 'var(--accent-dim)', border: '1px solid var(--accent-border)',
                  borderRadius: 4, padding: '2px 8px',
                }}>UNIT {String(uidx + 1).padStart(2, '0')}</span>
                <span style={{ fontWeight: 500, fontSize: 15 }}>{unit.name || 'Unnamed unit'}</span>
                {unit.description && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>— {unit.description}</span>}
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', marginLeft: 4 }}>
                  ({unitCases.length} source{unitCases.length !== 1 ? 's' : ''})
                </span>
              </div>
              <button onClick={() => addCase(unit.id)} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                fontSize: 12, background: 'var(--accent-dim)', color: 'var(--accent)',
                border: '1px solid var(--accent-border)', borderRadius: 4, cursor: 'pointer',
              }}>
                <Plus size={13} /> Add relief source
              </button>
            </div>

            {unitCases.length === 0 && (
              <div style={{
                background: 'var(--bg-card)', border: '1px dashed var(--border-mid)',
                borderRadius: 6, padding: '20px', textAlign: 'center',
                color: 'var(--text-muted)', fontSize: 13,
              }}>
                No relief sources for this unit yet.
              </div>
            )}

            {unitCases.map(c => (
              <CaseRow key={c.id} c={c} project={project} removeCase={removeCase} updateCase={updateCase} updateCaseSub={updateCaseSub} />
            ))}
          </div>
        )
      })}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <button onClick={onNext} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px',
          fontSize: 13, background: 'var(--accent)', color: '#fff',
          border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 500,
        }}>
          View Summary <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}
