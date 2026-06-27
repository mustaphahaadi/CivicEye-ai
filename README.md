# CivicEye - Smart AI City Platform

CivicEye is an AI-powered Smart City Incident portal that enables citizens to report community hazards—including potholes, flooding, illegal dumping, broken streetlights, water leakages, fallen trees, and power outages. Using Google Gemini 2.5 Flash, the platform analyzes images and text to classify severity, gauge confidence levels, assign emergency priorities, draft public safety risk reports, and route work orders instantly to correct municipal departments.

---

## 🚀 Key Platform Features

1. **Intelligent AI Inspection**: Image and text analysis powered by **Gemini 2.5 Flash** for instant classification and risk assessments.
2. **Interactive City Map**: A stylized blueprint telemetry panel allowing citizens to drop pins and visualize neighborhood-wide incident logs.
3. **Citizen Dashboard**: Track reported tickets from submission through Pending, Under Review, and Resolved status transitions in real-time.
4. **Dispatcher Action Center**: Government authority views with search queries, priority sorting, status updates, and interactive comments syncing.
5. **Interactive AI Chatbot**: A friendly virtual smart-city representative that has live knowledge of filed reports to answer citizen concerns.
6. **QR Code Link Sharing & PDF Print Exporter**: Scan QR codes to share reports or download formal vector PDFs with digital government headers.
7. **Developer Quick-Pass**: Single-click quick accounts to instantly experience both Citizen and Authority flows during evaluations.

---

## 🛠️ Technology Stack

- **Frontend**: React, Tailwind CSS, Recharts, Lucide Icons, Motion (animations)
- **Backend Service**: Express.js & Vite middleware integration
- **AI Core**: Google GenAI SDK (`@google/genai`) with Gemini 2.5 Flash
- **Cloud Database**: Firebase Firestore with Authentication

---

## ⚙️ Setup & Installation

### 1. Environment Variables Configuration
Duplicate `.env.example` as `.env` and configure your secret credentials:
```env
GEMINI_API_KEY="your-google-ai-studio-gemini-key"
APP_URL="your-application-deployment-url"
```

### 2. Local Installation
To install core libraries and start the local development server:
```bash
# Install package dependencies
npm install

# Start development full-stack server
npm run dev
```

### 3. Production Compilation Build
To compile static production assets and bundle the Node.js server:
```bash
# Build Vite client assets and esbuild server bundle
npm run build

# Start production server
npm start
```

---

## 🧑‍💻 Developer Verification Guidelines
During live evaluations or hackathon demonstrations:
1. Click **Portal Login** or **Report Issue** to access the login sheet.
2. Under **Developer Quick-Pass Portal**, click **As Citizen** or **As Dispatcher** to log in instantly.
3. As a **Citizen**, click **File Incident Pin**, upload a photo, type a description, drop a pin on the telemetry grid, click **Analyze with AI**, and then click **File Civic Report**.
4. Log out and click **As Dispatcher** to view the live ticket, post dispatcher comments, change work status, and observe live analytical updates.
