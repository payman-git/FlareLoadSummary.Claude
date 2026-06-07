# Flare Load Summary

Web application for preparing Flare Load Summary documents used in EPC of petrochemical plants.

## Features
- Define project information and document header details
- Define one or multiple plant units (single unit or mega-complex)
- Add relief sources per unit, each with mitigated and unmitigated loads
- Auto-generated summary table grouped by unit with grand total
- Export to Excel (one sheet per unit + grand summary sheet)
- Export to PDF (one page per unit)

## Tech stack
React 18 + Vite + SheetJS + jsPDF

## Local development

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository
2. Go to **Settings → Pages → Source → GitHub Actions**
3. Push any commit to `main` — the workflow auto-builds and deploys

Your app will be live at: `https://<your-username>.github.io/<repo-name>/`
