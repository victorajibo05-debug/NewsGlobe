#  NewsGlobe

> An interactive 3D globe that lets you explore real-time news from countries around the world — click or search a country, and the latest headlines appear instantly.

![NewsGlobe Preview](public/Globe.jpg)

---

##  Overview

NewsGlobe is a full-stack web application I built to make consuming global news more visual and intuitive. Instead of scrolling through a flat list of articles, you spin a 3D globe, click on any country marker, and get the top headlines for that country right on the sidebar. On mobile, a smooth bottom sheet slides up with the same headlines.

The project combines a **React/Vite** frontend with a **Node.js/Express** backend that proxies news data from [NewsData.io](https://newsdata.io), keeping the API key secure server-side and never exposing it to the browser.

---

##  Features

-  **Interactive 3D Globe** — powered by [globe.gl](https://globe.gl/), with coloured country markers and permanent country name labels
-  **Country Search** — search any country by name; the matching result loads headlines instantly
-  **Live News Headlines** — real-time top news fetched from NewsData.io for 177+ countries
-  **News Detail Card** — click any headline to read the full article description in a pop-up card
-  **Fully Responsive** — desktop shows a draggable sidebar; mobile shows a swipe-to-dismiss bottom sheet
-  **Resizable Sidebar** — drag the sidebar edge to any width you prefer on desktop
-  **Dark Theme** — sleek dark UI with the Bebas Neue font throughout

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework and build tool |
| TypeScript | Type safety across all components |
| globe.gl | 3D interactive globe rendering (via CDN) |
| Tailwind CSS | Utility-first styling |
| Bebas Neue | Display font |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| TypeScript | Type safety on the backend |
| Axios | HTTP client for NewsData.io requests |
| dotenv | Environment variable management |
| CORS | Cross-origin request handling |

### Infrastructure
| Service | Purpose |
|---|---|
| Vercel | Frontend deployment |
| Render | Backend deployment |
| NewsData.io | News data API |

---

##  Project Structure

```
NewsGlobe/
├── backend/                    # Express API server
│   ├── Src/
│   │   ├── App.ts              # Express app entry point
│   │   ├── Config/
│   │   │   └── env.ts          # Environment config (PORT, API_KEY)
│   │   ├── controllers/
│   │   │   └── newsControllers.ts  # Request handlers
│   │   ├── routes/
│   │   │   └── newsRoutes.ts   # Route definitions
│   │   └── services/
│   │       └── newsServices.ts # NewsData.io API integration
│   ├── package.json
│   └── tsconfig.json
│
├── src/                        # React frontend
│   ├── App.tsx                 # Root component, state management
│   ├── components/
│   │   ├── globe.tsx           # 3D globe with HTML markers
│   │   ├── GlobeOverlay.tsx    # Floating header + search bar on globe
│   │   ├── sidebar.tsx         # Desktop news headlines panel
│   │   ├── bottomsheet.tsx     # Mobile news headlines panel
│   │   ├── newsCard.tsx        # Article detail pop-up card
│   │   └── pointer.tsx         # Bullet point icon component
│   ├── hooks/
│   │   └── useFetchnews.ts     # Custom hook for news API calls
│   └── index.css               # Global styles
│
├── types/
│   └── types.ts                # Shared TypeScript interfaces
│
├── public/                     # Static assets
├── vite.config.ts              # Vite + proxy configuration
└── tsconfig.app.json           # TypeScript config
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v20 or higher
- A free [NewsData.io](https://newsdata.io) API key

### 1. Clone the repository

```bash
git clone https://github.com/your-username/NewsGlobe.git
cd NewsGlobe
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Set up environment variables

Create a `.env` file in the `backend/` folder:

```env
API_KEY=your_newsdata_io_api_key_here
PORT=3000
```

> ⚠️ Never commit your `.env` file. It's already in `.gitignore`.

### 5. Start the backend

Open a terminal in the `backend/` folder:

```bash
npm run dev
```

You should see:
```
Server is running on port 3000
```

### 6. Start the frontend

Open a second terminal in the project root:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔄 How It Works

```
User clicks/searches a country on the globe
              ↓
App.tsx fires fetchNewsByCountry(countryCode)
              ↓
useFetchNews hook calls GET /api/news/:countryCode
              ↓
Vite dev proxy forwards to http://localhost:3000
              ↓
Express route → controller → service
              ↓
Axios calls NewsData.io API with your API key
              ↓
Articles returned as JSON
              ↓
Desktop: Sidebar updates with headlines
Mobile:  Bottom sheet slides up with headlines
              ↓
User clicks a headline → NewsCard pops up with description
```

---

## 🌐 API Reference

### Backend Endpoint

```
GET /api/news/:countryCode
```

| Parameter | Type | Description |
|---|---|---|
| `countryCode` | string | ISO 2-letter country code (e.g. `ng`, `us`, `gb`) |

**Example:**
```
GET /api/news/ng
```

**Response:**
```json
{
  "status": "success",
  "totalResults": 10,
  "articles": [
    {
      "article_id": "abc123",
      "title": "Breaking news from Nigeria",
      "description": "Full description here...",
      "url": "https://source.com/article",
      "image_url": "https://...",
      "source_name": "Punch",
      "pubDate": "2025-01-01 12:00:00",
      "country": ["nigeria"],
      "category": ["top"],
      "language": "english"
    }
  ]
}
```

---

## 📦 Deployment

### Frontend → Vercel

```bash
npm run build
npx vercel
```

In your Vercel project settings, add the environment variable:
```
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
```

### Backend → Render

1. Push your code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set the root directory to `backend`
4. Build command: `npm install && npm run build`
5. Start command: `npm start`
6. Add environment variables:
   ```
   API_KEY=your_newsdata_io_api_key
   PORT=3000
   ```

### CORS

After deploying both, update `backend/Src/App.ts` with your actual Vercel URL:

```typescript
app.use(cors({
  origin: [
    "https://your-app.vercel.app",
    "http://localhost:5173"
  ],
}));
```

---

## 📱 Responsive Behaviour

| Screen | Globe | News Panel | Search |
|---|---|---|---|
| Desktop (>768px) | Left portion of screen | Draggable sidebar (left) | Inside sidebar |
| Mobile (≤768px) | Full screen | Bottom sheet (swipe to dismiss) | Floating overlay on globe |

---

##  Known Limitations

- **NewsData.io free tier** allows 10 articles per request and 200 credits per day
- **Render free tier** spins down after 15 minutes of inactivity — the first request after idle takes ~30 seconds to wake up
- Some smaller countries may return zero articles if NewsData.io has no English-language coverage for them

---

##  Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

Built by **Victor Ajibo** — a computer science undergraduate building a full-stack portfolio toward a software engineering career.

- GitHub: [@victorajibo05](https://github.com/victorajibo05-debug)
- Project: [NewsGlobe on GitHub](https://github.com/victorajibo05-debug/NewsGlobe)
- Live: [newsglobe.vercel.app](https://newsglobe.vercel.app)
