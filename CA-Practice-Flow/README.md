# PraxisFlow — CA Practice Automation Platform

Interactive solution demo + UI prototype for a CA firm (~400 → 600–800 clients).

## How to open / share

### Option A — Local
```bash
cd CA-Practice-Flow
# Python
python3 -m http.server 8080
# then open http://localhost:8080
```

Or simply open `index.html` in a browser (some browsers restrict modules; a local server is preferred).

### Option B — Share a URL
Upload this folder to Netlify, Vercel, GitHub Pages, or any static host. Send the client:
- **Solution plan:** `https://your-host/`
- **Live UI demo:** `https://your-host/demo.html`

## What’s inside

| File | Purpose |
|------|---------|
| `index.html` | Full BRD → solution answers (all 10 sections) |
| `demo.html` | Interactive UI — CA / Staff / Client / Admin roles |
| `architecture.html` | Tech architecture, schema, security, data flow |
| `workflows.html` | All 10 workflows in detail |
| `modules.html` | 13 core modules + role map |
| `pilot.html` | 30–50 client pilot plan + KPIs |
| `css/styles.css` | Design system |
| `js/data.js` | Demo data |
| `js/app.js` | Shared UI helpers |
| `js/demo.js` | Role-based screens & drawers |

## Demo walkthrough (for the meeting)

1. Start on **Solution** — principle Green/Amber/Red + BRD accordion  
2. **Architecture** — stack + schema  
3. **Workflows** — open GST Returns  
4. **Live Demo UI**  
   - **CA** — dashboard, red exceptions, approvals  
   - **Staff** — amber queue, reconciliation, WhatsApp  
   - **Client** — upload, pending, status  
   - **Admin** — services, Tally, security audit  

## Design principle

> The system should tell staff what needs attention. Staff should not have to remember what needs to be done.
