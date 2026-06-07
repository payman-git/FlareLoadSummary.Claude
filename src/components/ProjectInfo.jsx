import { ArrowRight } from 'lucide-react'

const Label = ({ children }) => (
  <label style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
    {children}
  </label>
)

const Field = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    <Label>{label}</Label>
    {children}
  </div>
)

const SectionTitle = ({ children }) => (
  <h2 style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>{children}</h2>
)

const Card = ({ title, children }) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
    {title && <SectionTitle>{title}</SectionTitle>}
    {children}
  </div>
)

const G2 = ({ children }) => <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>{children}</div>
const G3 = ({ children }) => <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>{children}</div>

export default function ProjectInfo({ project, updateProject, onNext }) {
  const u = (f) => (e) => updateProject(f, e.target.value)
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Project information</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Document header details for the flare load summary report.</p>
      </div>

      <Card title="Project details">
        <G2>
          <Field label="Project name"><input value={project.name} onChange={u('name')} placeholder="e.g. Ethylene Plant Unit 100" /></Field>
          <Field label="Project number"><input value={project.number} onChange={u('number')} placeholder="e.g. EPC-2024-001" /></Field>
        </G2>
        <G3>
          <Field label="Client"><input value={project.client} onChange={u('client')} placeholder="Client name" /></Field>
          <Field label="Plant / Unit"><input value={project.plant} onChange={u('plant')} placeholder="e.g. CDU, FCC, SRU" /></Field>
          <Field label="Document number"><input value={project.docNumber} onChange={u('docNumber')} placeholder="e.g. DOC-FLS-001" /></Field>
        </G3>
        <G2>
          <Field label="Prepared by"><input value={project.preparedBy} onChange={u('preparedBy')} placeholder="Engineer name" /></Field>
          <Field label="Date"><input type="date" value={project.date} onChange={u('date')} /></Field>
        </G2>
      </Card>

      <Card title="Units">
        <G3>
          <Field label="Mass flow">
            <select value={project.massUnit} onChange={u('massUnit')}>
              <option value="kg/hr">kg/hr</option>
              <option value="lb/hr">lb/hr</option>
            </select>
          </Field>
          <Field label="Pressure">
            <select value={project.pressUnit} onChange={u('pressUnit')}>
              <option value="barg">barg</option>
              <option value="bara">bara</option>
              <option value="psig">psig</option>
              <option value="psia">psia</option>
            </select>
          </Field>
          <Field label="Temperature">
            <select value={project.tempUnit} onChange={u('tempUnit')}>
              <option value="°C">°C (Celsius)</option>
              <option value="°F">°F (Fahrenheit)</option>
            </select>
          </Field>
        </G3>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <button onClick={onNext} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px',
          fontSize: 13, background: 'var(--accent)', color: '#fff',
          border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 500,
        }}>
          Next: Plant Units <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}
