# 🧩 Better Wordle — Frontend
A React frontend for **Better Wordle** — a mobile-first Wordle clone with a changelog, history, and JWT-protected API.

---

## Demo  
> Live demo: https://better-wordle.vercel.app/

---

## Features  
- Mobile-first responsive UI built with React and Material UI  
- Game board with animations and validation  
- Local stats tracking with daily streak logic  
- JWT authentication for protected API endpoints  
- Word History + Changelog views  
- Combined validation + guess API (`/api/combined-guess/`)  
- Full-width keyboard optimized for touch devices  

---

## Tech stack  
- React (Vite / CRA)  
- TypeScript  
- Material UI (MUI)  
- styled-components  
- moment / dayjs  
- Hosted on Render / Vercel / Netlify  
### ⚙️ Environment
| Tool | Version |
|------|----------|
| Node.js | 22.15.0 |
| npm | ≥10.0.0 |
| React | 19.2.0 |
| TypeScript | 4.9.5 |

Make sure you’re using the correct Node and npm versions to avoid dependency issues.
If you’re using **nvm**, run:
```bash
nvm install 22.15.0
nvm use 22.15.0
```
Or manually check your versions:
```bash
node -v
npm -v
```

---

## Prerequisites  
- Node.js v22.15.0 (or match deployment version)  
- npm or yarn installed  
- Backend API running and reachable  

---

## Environment variables  
Create a `.env` file in the project root (ignored by git):

```env
Base URL of your backend API (no trailing slash)
REACT_APP_RENDER_BASE_URL=https://your-backend.onrender.com
```

> The frontend automatically requests a JWT from `/api/get-jwt/`.

---

## Install & run locally  
```bash
install dependencies
npm install
or
yarn

start dev server
npm start
or
yarn start
```

Build for production:
```bash
npm run build
```

Preview locally:
```bash
npx serve build
```

---

## Available scripts  
- `start` — starts dev server  
- `build` — builds production assets  
- `test` — runs tests  
- `prepare` — installs Husky hooks (if used)  

---

## App flow overview  

### 1. Authentication  
- Requests token via `/api/get-jwt/`  
- Adds to header:  
  `Authorization: Bearer <token>`  

### 2. Guessing a word  
Endpoint: `/api/combined-guess/`  
Body:  
```json
{ "guess": "APPLE" }
```
Response (invalid):  
```json
{ "valid": false }
```
Response (valid):  
```json
{ "valid": true, "letters": [2,0,1,0,2] }
```

### 3. Word History  
Endpoint: `/api/list/`  
Returns all past words (before today).  

### 4. Changelog  
Fetches and displays version updates from a JSON file.  

---

## UI & UX notes  
- Keyboard fills screen width on mobile  
- `styled-components` for isolated styles  
- Responsive and accessible (semantic buttons, focusable keys)  
- Stats persist via localStorage  
- Daily rollover logic resets streak if `lastPlayedDate` < yesterday  

---

## Styling  
- MUI theme for colors and typography  
- styled-components for custom UI  
- Dark mode palette with Wordle-like tone  

---

## Deployment  
1. Set environment variables in Render / Vercel Dashboard  
2. Run `npm run build` (automatic for most hosts)  
3. Ensure HTTPS (default for most static hosts)  

---

## Troubleshooting  
❌ **Blank screen:** Check `REACT_APP_RENDER_BASE_URL`  
🔒 **401 Unauthorized:** Token expired → frontend will refresh automatically  
📱 **Tiny keyboard:** Ensure viewport width and `flex: 1` applied in CSS  
🕒 **Wrong streak reset:** Check device timezone or force UTC dates  

---

## Testing tips  
Simulate yesterday’s session:  
- Open DevTools → localStorage → edit `lastPlayedDate`  
- Set to `YYYY-MM-DD` (yesterday)  
Use mobile device emulation in Chrome for touch testing.  

---

## Contributing  
1. Fork repository  
2. Create branch: `feat/your-feature`  
3. Commit using `feat:` / `fix:` / `chore:` prefix  
4. Open PR with screenshots if UI-related  

---

© 2025 DevGarcia – Better Wordle Project
