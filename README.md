# Compass D&T Service Desk Dashboard

A self-contained, high-fidelity operations dashboard prototype designed for an IT office wall display. It rotates between the live Compass D&T Service Desk, Time2Eat connected-estate view and Compass God’s-eye View.

## Run it

Open `index.html` in a modern browser. No install or build step is required. The demonstration login uses the username and password agreed for the prototype; the session is retained only in the current browser tab.

For the best local experience, serve the folder with any static server, for example:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Demo controls

- **Live / Paused** toggles the simulated ticket feed.
- **Service Desk / Time2Eat Estate / God’s-eye View** switches screens immediately.
- **Auto · 30s** pauses or resumes automatic screen rotation.
- **Add demo ticket** injects a ticket; on the Time2Eat screen, the same control simulates a device event.
- Priority and channel filters update the visible queue.
- Select a queue row to open the ticket detail drawer and advance its triage state.
- **Wall mode** requests browser fullscreen.

The Time2Eat screen continuously simulates transactions, telemetry throughput, heartbeats, degraded performance, offline devices and recoveries across POS terminals, self-service kiosks and kitchen management devices. Its transaction model is calibrated to approximately six million transactions annually, with live totals for the last hour, last day, last seven days, last month, trailing year and year to date.

The Compass God’s-eye View renders a dependency graph of 2,387 entities across seven central functions, seven business areas, 26 sub-sectors, 40 sector-region clusters, 428 Compass locations and 1,842 connected endpoints. Drag to rotate, scroll to zoom, select a node to inspect it, or use **Expand** for an immersive full-screen model.

All data is illustrative and generated locally in the browser. The front-door login is a client-side demonstration gate, not production-grade authentication.
