# CivicEye — Municipal Intelligence Platform

CivicEye is an enterprise-grade Smart City Incident Portal designed to bridge the gap between citizens reporting local community hazards and municipal utility dispatch crews. Powered by state-of-the-art multimodal AI, CivicEye transforms raw, unstructured citizen reports—photos, coordinates, and descriptions—into validated, prioritized, and formatted work orders in under 15 seconds.

---

## 🏛️ Executive Visual Identity & Layout
The platform has been meticulously refined to present a polished, high-contrast, professional administrative theme:
- **Corporate Blue & Amber Palette**: Styled with deep `#0B1528` (Slate Blue) headings, pristine off-white canvases, and amber `#FFC000` status markers.
- **Top Bar Utility Banner**: Real-time operating hours and a verified hot-dial lifeline prominently displayed in the header.
- **Dual-Column Command Centers**: Intuitive, distraction-free authentication panels pairing live operations statistics with SSL-secured access forms.
- **Integrated Action Controls**: High-visibility direct "Report Issue" buttons sitting right alongside "Access Portal" controls for instantaneous citizen action.

---

## 🚀 Key Platform Features

### 1. Multimodal AI Dispatch Engine
- Powered by the **Google Gemini SDK**, analyzing uploaded images to classify issues (potholes, water leakages, blackouts, hazards).
- Automatic risk scoring, priority mapping, safety guidelines recommendation, and department routing.

### 2. Interactive Telemetry Geo-Map
- Map coordinates capture from browser geolocators.
- Fully interactive blueprints showing real-time hazard density clusters and status colors.

### 3. Citizen Incident Hub
- Submit reports in seconds without requiring registration.
- Track progression through active states: **Pending**, **Under Review**, and **Resolved**.
- Access interactive live chats directly with assigned municipal dispatch technicians on individual report logs.

### 4. Dispatcher Command Panel
- Powerful search queries, category filters, and high-priority triage toggles.
- Take ownership of tickets, write internal progress comments, and trigger status updates instantly.

### 5. AI Civic Representative Chatbot
- A virtual smart-city AI agent that reads active database reports to handle live citizen inquiries regarding municipal updates.

---

## 🛠️ Technology Stack

- **Client Runtime**: React with Vite, Tailwind CSS, Lucide Icons, and Motion.
- **Core Database**: Firebase Firestore for durable multi-user telemetry and persistence.
- **Identity Engine**: Firebase Authentication with SSO integration.
- **Backend Proxy**: Express.js server bundling client routing and secure Gemini API tunnels.

---

## ⚙️ Setup & Configuration

### 1. Environment Variables Configuration
Duplicate `.env.example` as `.env` and configure your API keys:
```env
GEMINI_API_KEY="your-google-ai-studio-gemini-key"
APP_URL="your-application-deployment-url"
```

### 2. Local Installation
To bootstrap dependencies and boot the development server:
```bash
# Install packages
npm install

# Run the dev server
npm run dev
```

### 3. Production Compilation Build
To bundle the high-performance client assets and CJS server:
```bash
# Compile and bundle
npm run build

# Start the Node process
npm start
```

---

## 🧑‍💻 Developer Verification Workflow
Experience both sides of the civic pipeline using our built-in test profiles:
1. Click **Access Portal** or **Report Issue** to enter the clean, dual-column authorization suite.
2. Locate the **Developer Quick-Pass Portal** card at the bottom of the form.
3. **Citizen Demo**: Click **As Citizen** to instantly load a resident profile. Drop a telemetry pin, upload a photo, click **Analyze with AI** to view live Gemini insights, and hit **File Civic Report**.
4. **Dispatcher Demo**: Log out and click **As Dispatcher**. Look up the submitted issue, claim the ticket, post an official update comment, and transition the status to **Resolved**.
