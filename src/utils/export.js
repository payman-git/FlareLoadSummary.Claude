import * as XLSX from 'xlsx'

export function exportExcel(project, units, cases) {
  const wb = XLSX.utils.book_new()
  const massUnit = project.massUnit || 'kg/hr'
  const pressUnit = project.pressUnit || 'barg'
  const tempUnit = project.tempUnit || '°C'

  // Cover sheet
  const coverData = [
    ['FLARE LOAD SUMMARY'],
    [],
    ['Project name', project.name || '—'],
    ['Project number', project.number || '—'],
    ['Client', project.client || '—'],
    ['Plant / Unit', project.plant || '—'],
    ['Document number', project.docNumber || '—'],
    ['Prepared by', project.preparedBy || '—'],
    ['Date', project.date || '—'],
    [],
    ['Units in scope:', units.length],
    ...units.map((u, i) => [`  Unit ${i + 1}`, `${u.name}${u.description ? ' — ' + u.description : ''}`]),
  ]
  const coverSheet = XLSX.utils.aoa_to_sheet(coverData)
  coverSheet['!cols'] = [{ wch: 20 }, { wch: 40 }]
  XLSX.utils.book_append_sheet(wb, coverSheet, 'Cover')

  // One sheet per unit
  units.forEach((unit, uidx) => {
    const unitCases = cases.filter(c => c.unitId === unit.id)
    const sheetData = [
      [`FLARE LOAD SUMMARY — UNIT ${uidx + 1}: ${unit.name}${unit.description ? ' (' + unit.description + ')' : ''}`],
      [`Project: ${project.name || '—'}   |   Doc No.: ${project.docNumber || '—'}   |   Date: ${project.date || '—'}`],
      [],
      [
        'No.', 'Relief Source', 'Case Type', 'Equipment Tag',
        `Temp (${tempUnit})`, `Pressure (${pressUnit})`,
        `Flow Unmitigated (${massUnit})`, 'MW Unmitigated',
        `Flow Mitigated (${massUnit})`, 'MW Mitigated',
      ],
      ...unitCases.map((c, i) => [
        i + 1, c.name || '—', c.type || '—', c.tag || '—',
        c.tempRelief || '—', c.pressure || '—',
        c.unmit.flow || '—', c.unmit.mw || '—',
        c.mit.flow || '—', c.mit.mw || '—',
      ]),
      [],
      [
        'UNIT TOTAL', '', '', '', '', '',
        unitCases.reduce((s, c) => s + parseFloat(c.unmit.flow || 0), 0).toFixed(1), '',
        unitCases.reduce((s, c) => s + parseFloat(c.mit.flow || 0), 0).toFixed(1), '',
      ],
    ]
    const ws = XLSX.utils.aoa_to_sheet(sheetData)
    ws['!cols'] = [{ wch: 5 }, { wch: 30 }, { wch: 22 }, { wch: 14 }, { wch: 12 }, { wch: 14 }, { wch: 22 }, { wch: 12 }, { wch: 22 }, { wch: 12 }]
    const name = (unit.name || `Unit${uidx + 1}`).replace(/[\\/*?:[\]]/g, '').slice(0, 31)
    XLSX.utils.book_append_sheet(wb, ws, name)
  })

  // Grand summary sheet
  if (units.length > 1) {
    const summaryRows = [
      ['GRAND TOTAL FLARE LOAD SUMMARY'],
      [`Project: ${project.name || '—'}   |   Doc No.: ${project.docNumber || '—'}   |   Date: ${project.date || '—'}`],
      [],
      ['Unit', 'Description', 'No. of Sources', `Total Unmit. Flow (${massUnit})`, `Total Mit. Flow (${massUnit})`],
      ...units.map(u => {
        const uc = cases.filter(c => c.unitId === u.id)
        return [
          u.name || '—', u.description || '—', uc.length,
          uc.reduce((s, c) => s + parseFloat(c.unmit.flow || 0), 0).toFixed(1),
          uc.reduce((s, c) => s + parseFloat(c.mit.flow || 0), 0).toFixed(1),
        ]
      }),
      [],
      [
        'GRAND TOTAL', '', cases.length,
        cases.reduce((s, c) => s + parseFloat(c.unmit.flow || 0), 0).toFixed(1),
        cases.reduce((s, c) => s + parseFloat(c.mit.flow || 0), 0).toFixed(1),
      ],
    ]
    const ws = XLSX.utils.aoa_to_sheet(summaryRows)
    ws['!cols'] = [{ wch: 14 }, { wch: 30 }, { wch: 14 }, { wch: 24 }, { wch: 24 }]
    XLSX.utils.book_append_sheet(wb, ws, 'Grand Summary')
  }

  const safeNum = (project.number || 'FLS').replace(/\s/g, '_')
  XLSX.writeFile(wb, `Flare_Load_Summary_${safeNum}.xlsx`)
}

export function exportPDF(project, units, cases) {
  import('jspdf').then(({ jsPDF }) => {
    import('jspdf-autotable').then(() => {
      const massUnit = project.massUnit || 'kg/hr'
      const pressUnit = project.pressUnit || 'barg'
      const tempUnit = project.tempUnit || '°C'
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      const headerLine = `Project: ${project.name || '—'}  |  No.: ${project.number || '—'}  |  Client: ${project.client || '—'}  |  By: ${project.preparedBy || '—'}  |  Date: ${project.date || '—'}`

      let isFirst = true
      units.forEach((unit, uidx) => {
        if (!isFirst) doc.addPage()
        isFirst = false
        const unitCases = cases.filter(c => c.unitId === unit.id)

        doc.setFontSize(13); doc.setFont(undefined, 'bold')
        doc.text('FLARE LOAD SUMMARY', 14, 14)
        doc.setFontSize(9); doc.setFont(undefined, 'normal')
        doc.text(headerLine, 14, 20)
        doc.setFontSize(10); doc.setFont(undefined, 'bold')
        doc.text(`Unit ${uidx + 1}: ${unit.name}${unit.description ? ' — ' + unit.description : ''}`, 14, 27)

        const head = [[
          '#', 'Relief Source', 'Case Type', 'Equip. Tag',
          `Temp (${tempUnit})`, `Pressure (${pressUnit})`,
          `Unmit. Flow (${massUnit})`, 'MW Unmit.',
          `Mit. Flow (${massUnit})`, 'MW Mit.',
        ]]
        const body = unitCases.map((c, i) => [
          i + 1, c.name || '—', c.type || '—', c.tag || '—',
          c.tempRelief || '—', c.pressure || '—',
          c.unmit.flow || '—', c.unmit.mw || '—',
          c.mit.flow || '—', c.mit.mw || '—',
        ])
        const uTotalUnmit = unitCases.reduce((s, c) => s + parseFloat(c.unmit.flow || 0), 0)
        const uTotalMit = unitCases.reduce((s, c) => s + parseFloat(c.mit.flow || 0), 0)
        body.push(['', 'UNIT TOTAL', '', '', '', '', uTotalUnmit.toFixed(1), '', uTotalMit.toFixed(1), ''])

        doc.autoTable({
          head, body, startY: 31,
          styles: { fontSize: 7.5 },
          headStyles: { fillColor: [20, 23, 32], textColor: [200, 200, 200] },
          alternateRowStyles: { fillColor: [26, 30, 40] },
          bodyStyles: { fillColor: [20, 23, 32], textColor: [220, 220, 220] },
          foot: [],
        })
      })

      const safeNum = (project.number || 'FLS').replace(/\s/g, '_')
      doc.save(`Flare_Load_Summary_${safeNum}.pdf`)
    })
  })
}
