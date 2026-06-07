import { Plus, Trash2, ArrowRight, Factory } from 'lucide-react'

const Label = ({ children }) => (
  <label style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{children}</label>
)

const Field = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}><Label>{label}</Label>{children}</div>
)

export default function PlantUnits({ units, addUnit, removeUnit, updateUnit, onNext }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Plant units</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          Define the process units covered by this flare system. A single unit (e.g. CDU) or a mega-complex with multiple units (e.g. CDU + VDU + NHT) can be added.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {units.length === 0 ? 'No units defined' : `${units.length} unit${units.length > 1 ? 's' : ''} defined`}
        </span>
        <button onClick={addUnit} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px',
          fontSize: 13, background: 'var(--accent)', color: '#fff',
          border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 500,
        }}>
          <Plus size={14} /> Add unit
        </button>
      </div>

      {units.length === 0 && (
        <div style={{
          background: 'var(--bg-card)', border: '1px dashed var(--border-mid)',
          borderRadius: 8, padding: '40px 24px', textAlign: 'center',
        }}>
          <Factory size={28} color="var(--text-muted)" style={{ marginBottom: 10 }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No plant units yet. Click "Add unit" to define the scope of the flare system.</p>
        </div>
      )}

      {units.map((unit, idx) => (
        <div key={unit.id} style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '16px 20px', marginBottom: 12,
          borderLeft: '3px solid var(--accent)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
              background: 'var(--accent-dim)', border: '1px solid var(--accent-border)',
              borderRadius: 4, padding: '2px 8px',
            }}>UNIT {String(idx + 1).padStart(2, '0')}</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>
              {unit.name || <span style={{ color: 'var(--text-muted)' }}>Unnamed unit</span>}
            </span>
            <button onClick={() => removeUnit(unit.id)} style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', fontSize: 12, fontFamily: 'var(--font-sans)',
              background: 'var(--red-dim)', color: 'var(--red)',
              border: '1px solid rgba(239,68,68,0.3)', borderRadius: 4, cursor: 'pointer',
            }}>
              <Trash2 size={12} /> Remove
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
            <Field label="Unit tag / name">
              <input value={unit.name} onChange={e => updateUnit(unit.id, 'name', e.target.value)} placeholder="e.g. CDU, VDU, NHT, FCC" />
            </Field>
            <Field label="Description">
              <input value={unit.description} onChange={e => updateUnit(unit.id, 'description', e.target.value)} placeholder="e.g. Crude Distillation Unit" />
            </Field>
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <button onClick={onNext} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px',
          fontSize: 13, background: 'var(--accent)', color: '#fff',
          border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 500,
        }}>
          Next: Relief Cases <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}
