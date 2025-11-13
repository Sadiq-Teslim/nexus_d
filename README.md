# Nexus Disrupt

Nexus Disrupt is an interactive fraud-disruption console for financial institutions. The application showcases two secure portals (Manager and Admin) backed by graph-driven intelligence, autonomous micro-freeze actions, and detailed compliance narratives. It is built with React and Vite, styled with Tailwind CSS, and visualised with React Flow for graph analysis.

## Features

- **Public experience** – Landing page and onboarding flow guiding new institutions into the platform.
- **Authentication** – Institution sign-up and fraud manager login screens with guarded access to the portals.
- **Manager Portal**
	- Operational dashboard with live transaction feed, advanced filtering, and KPI cards.
	- Active disruption queue for case review, including AI recommendations and manual decision controls.
	- Nexus Map visualiser powered by React Flow, surfacing graph context, top counterparties, and per-account metadata.
	- Audit and compliance log stream with pagination and search.
	- Case review modal with staged evidence, consequence modelling (CDT), and a cognitive compliance narrative.
- **Admin Portal**
	- Executive KPI dashboard and system status snapshot.
	- User management area to add or revoke manager accounts with pagination.
	- API documentation hub describing ingestion and command endpoints.
	- Settings panel for tuning GNN thresholds and managing integration keys.
- **Mock services** – All data is generated through `src/services/mockApiService.js`, simulating real-time transactions, AI actions, and compliance artifacts.

## Tech Stack

- React 19 with JSX components and hooks
- Vite 7 for bundling and rapid development
- Tailwind CSS 3 for styling
- React Flow 11 for interactive graph visualisations
- Lucide React for iconography
- ESLint 9 with React hooks and refresh plugins

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+

### Installation

```bash
npm install
```

### Development server

```bash
npm run dev
```

This launches Vite on http://localhost:5173 with hot module reloading. The Manager portal lives at `/manager`, the Admin portal at `/admin`, and the auth flow at `/auth`.

### Linting

```bash
npm run lint
```

### Production build

```bash
npm run build
```

To preview the production bundle locally:

```bash
npm run preview
```

## Project Structure

```
src/
	components/          Reusable UI (navbar, modals, etc.)
	hooks/               Custom React hooks
	pages/               Public routes (landing, auth, home)
	portals/
		AdminPortal.jsx    Admin console with dashboard, API docs, and settings
		ManagerPortal.jsx  Operational console with analytics, graph view, and case workflow
	services/
		mockApiService.js  Mock transactions, AI actions, and CCN narrative
	assets/              Static assets and illustrations
```

Tailwind configuration lives in `tailwind.config.js`, while global styles are under `src/index.css` and portal-specific tweaks in `src/App.css` and related CSS modules.

## Data & Mock Services

The application uses generated datasets to simulate fraud networks and compliance outputs. The service layer (`mockApiService.js`) exposes helpers such as:

- `fetchTransactions` – returns the current transaction stream.
- `triggerMicroFreeze` / `authorizeHold` / `releaseFunds` – emulate AI and human actions on cases.
- `MOCK_CCN_REPORT` – sample compliance narrative used in the case review modal.

These mocks are synchronous simulations and can be replaced with real endpoints when integrating with production systems.

## Contributing & Next Steps

- Replace the mock service layer with real APIs and persistence.
- Harden authentication and session management (e.g., JWT, refresh tokens).
- Extend test coverage with component and integration tests.
- Add accessibility audits for graph interactions and modals.

Feel free to fork the project, open issues, or submit pull requests as you expand the platform.
