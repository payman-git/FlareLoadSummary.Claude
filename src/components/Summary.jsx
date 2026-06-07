export default function Summary({ cases, units, project }) {
  const massUnit = project.massUnit || 'kg/hr'
  const pressUnit = project.pressUnit || 'barg'
  const tempUnit = project.tempUnit || '°C'

  const totalUnmit = cases.reduce((s, c) => s + parseFloat(c.unmit.flow || 0), 0)
  const totalMit = cases.reduce((s, c) => s + parseFloat(c.mit.flow || 0), 0)
  const maxUnmit = cases.length ? Math.max(...cases.map(c => parseFloat(c.unmit.flow || 0))) : 0

  const metrics = [
    { label: 'Plant units', value: units.length, unit: '' },
    { label: 'Total relief sources', value: cases.length, unit: '' },
    { label: 'Max unmitigated flow', value: maxUnmit.toFixed(1), unit: massUnit },
    { label: 'Total unmitigated', value: totalUnmit.toFixed(1), unit: massUnit },
    { label: 'Total mitigated', value: totalMit.toFixed(1), unit: massUnit },
  ]

  const hdr = {
    fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
    letterSpacing: '0.06em', textTransform: 'uppercase', padding: '8px 12px',
    background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap',
  }
  const td = (extra = {}) => ({
    padding: '8px 12px', fontSize: 12, borderBottom: '1px solid var(--border)', ...extra,
  })

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Flare load summary</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          {project.name || '—'} &nbsp;·&nbsp; {project.number || '—'} &nbsp;·&nbsp; {project.date || '—'}
        </p>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 24 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 500 }}>{m.value}<span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>{m.unit}</span></div>
          </div>
        ))}
      </div>

      {/* Per-unit tables */}
      {units.map((unit, uidx) => {
        const unitCases = cases.filter(c => c.unitId === unit.id)
        const uTotalUnmit = unitCases.reduce((s, c) => s + parseFloat(c.unmit.flow || 0), 0)
        const uTotalMit = unitCases.reduce((s, c) => s + parseFloat(c.mit.flow || 0), 0)

        return (
          <div key={unit.id} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
                background: 'var(--accent-dim)', border: '1px solid var(--accent-border)',
                borderRadius: 4, padding: '2px 8px',
              }}>UNIT {String(uidx + 1).padStart(2, '0')}</span>
              <span style={{ fontWeight: 500, fontSize: 15 }}>{unit.name || 'Unnamed unit'}</span>
              {unit.description && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>— {unit.description}</span>}
            </div>

            <div style={{ overflowX: 'auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    <th style={hdr}>No.</th>
                    <th style={hdr}>Relief source</th>
                    <th style={hdr}>Case type</th>
                    <th style={hdr}>Equip. tag</th>
                    <th style={hdr}>Temp ({tempUnit})</th>
                    <th style={hdr}>Pressure ({pressUnit})</th>
                    <th style={{ ...hdr, color: 'var(--yellow)', borderLeft: '1px solid var(--border)' }}>Flow unmit. ({massUnit})</th>
                    <th style={{ ...hdr, color: 'var(--yellow)' }}>MW unmit.</th>
                    <th style={{ ...hdr, color: 'var(--green)', borderLeft: '1px solid var(--border)' }}>Flow mit. ({massUnit})</th>
                    <th style={{ ...hdr, color: 'var(--green)' }}>MW mit.</th>
                  </tr>
                </thead>
                <tbody>
                  {unitCases.length === 0 && (
                    <tr><td colSpan={10} style={{ ...td(), textAlign: 'center', color: 'var(--text-muted)' }}>No relief sources for this unit</td></tr>
                  )}
                  {unitCases.map((c, idx) => (
                    <tr key={c.id} style={{ background: idx % 2 === 1 ? 'var(--bg-card2)' : 'transparent' }}>
                      <td style={{ ...td(), fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{idx + 1}</td>
                      <td style={{ ...td(), fontWeight: 500 }}>{c.name || '—'}</td>
                      <td style={td()}>{c.type || '—'}</td>
                      <td style={{ ...td(), fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>{c.tag || '—'}</td>
                      <td style={td()}>{c.tempRelief || '—'}</td>
                      <td style={td()}>{c.pressure || '—'}</td>
                      <td style={{ ...td(), borderLeft: '1px solid var(--border)', color: 'var(--yellow)' }}>{c.unmit.flow || '—'}</td>
                      <td style={{ ...td(), color: 'var(--yellow)' }}>{c.unmit.mw || '—'}</td>
                      <td style={{ ...td(), borderLeft: '1px solid var(--border)', color: 'var(--green)' }}>{c.mit.flow || '—'}</td>
                      <td style={{ ...td(), color: 'var(--green)' }}>{c.mit.mw || '—'}</td>
                    </tr>
                  ))}
                  {unitCases.length > 0 && (
                    <tr style={{ background: 'var(--bg-card2)', borderTop: '1px solid var(--border-mid)' }}>
                      <td colSpan={6} style={{ ...td(), fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Unit total
                      </td>
                      <td style={{ ...td(), fontWeight: 500, color: 'var(--yellow)', borderLeft: '1px solid var(--border)' }}>{uTotalUnmit.toFixed(1)}</td>
                      <td style={td()}>—</td>
                      <td style={{ ...td(), fontWeight: 500, color: 'var(--green)', borderLeft: '1px solid var(--border)' }}>{uTotalMit.toFixed(1)}</td>
                      <td style={td()}>—</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}

      {/* Grand total */}
      {units.length > 1 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--accent-border)', borderRadius: 8, padding: '16px 20px', marginTop: 8 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.08em', marginBottom: 10 }}>GRAND TOTAL — ALL UNITS</div>
          <div style={{ display: 'flex', gap: 40 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Total unmitigated flow ({massUnit})</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--yellow)' }}>{totalUnmit.toFixed(1)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Total mitigated flow ({massUnit})</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--green)' }}>{totalMit.toFixed(1)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
