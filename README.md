# 🍎 NutriAI - Intelligent Food Ingredient Analysis

> Your AI-powered nutrition copilot that analyzes food ingredients and helps you make healthier choices

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)]([https://your-vercel-link.vercel.app](https://nutriai-black.vercel.app/))

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-5.2.1-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Google AI](https://img.shields.io/badge/Google_AI-Gemini_2.5-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.18-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📋 Overview

**FoodAI** (also known as **IngredientAI**) is a comprehensive full-stack application that leverages Google's Gemini AI to provide intelligent food ingredient analysis. The application helps users make informed dietary decisions by analyzing food labels, scanning barcodes, and comparing products based on personalized health goals.

### 🎯 Key Features

- **📸 Image Analysis**: Upload food label images to get instant AI-powered nutritional analysis
- **📱 Barcode Scanner**: Scan product barcodes to retrieve detailed ingredient and nutrition information
- **⚖️ Product Comparison**: Compare two products side-by-side to find the healthier option
- **🎨 Beautiful UI**: Modern, responsive design with smooth animations using Framer Motion
- **🎯 Personalized Insights**: Tailored recommendations based on user goals and dietary restrictions
- **💡 Smart Recommendations**: Get green flags, red flags, and actionable pro tips for every product

---

## 🏗️ Project Structure

```
FoodAI/
├── Backend/                    # Express.js API server
│   ├── routes/
│   │   └── analyze.js         # AI analysis endpoints
│   ├── uploads/               # Temporary image storage
│   ├── server.js              # Main server file
│   ├── package.json
│   └── .env                   # Environment variables
│
└── Frontend/                  # React + Vite application
    ├── src/
    │   ├── components/        # Reusable UI components
    │   │   ├── ChatInterface.jsx
    │   │   ├── CompareInterface.jsx
    │   │   ├── BarcodeScanner.jsx
    │   │   ├── ResultsView.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Hero.jsx
    │   │   └── ...
    │   ├── pages/             # Route pages
    │   │   ├── Home.jsx
    │   │   ├── Chat.jsx
    │   │   └── About.jsx
    │   ├── assets/            # Static assets
    │   ├── App.jsx            # Main app component
    │   └── main.jsx           # Entry point
    ├── design_specs/          # Design documentation
    ├── public/                # Public assets
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd FoodAI
```

2. **Setup Backend**

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

3. **Setup Frontend**

```bash
cd ../Frontend
npm install
```

Create a `.env` file in the `Frontend` directory:

```env
VITE_API_URL=http://localhost:3001
```

### Running the Application

1. **Start the Backend Server**

```bash
cd Backend
npm start
```

The server will run on `http://localhost:3001`

2. **Start the Frontend Development Server**

```bash
cd Frontend
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 🔌 API Endpoints

### 1. **POST** `/api/analyze`

Analyze a food product image using AI.

**Request:**
- `Content-Type`: `multipart/form-data`
- `image`: Image file (required)
- `userGoals`: User health goals/dietary restrictions (optional)

**Response:**
```json
{
  "success": true,
  "brief_summary": "...",
  "green_flags": ["..."],
  "red_flags": ["..."],
  "shock_comparison": "...",
  "better_alternative": ["...", "..."],
  "pro_tip": "...",
  "confidence_score": 100,
  "final_verdict": [
    { "is_good": true },
    "🟢 YES - ..."
  ]
}
```

### 2. **POST** `/api/barcode`

Analyze a product using barcode data from OpenFoodFacts API.

**Request:**
```json
{
  "product_name": "...",
  "ingredients_text": "...",
  "nutriments": { ... },
  "image_url": "...",
  "userGoals": "..."
}
```

**Response:**
```json
{
  "success": true,
  "product_details": {
    "name": "...",
    "image": "...",
    "ingredients": "..."
  },
  "analysis": { ... }
}
```

### 3. **POST** `/api/compare`

Compare two food products side-by-side.

**Request:**
- `Content-Type`: `multipart/form-data`
- `image`: Two image files (required)
- `userGoals`: User health goals (optional)

**Response:**
```json
{
  "success": true,
  "comparison": {
    "battle_intro": "...",
    "product_a": {
      "vibe_check": "...",
      "health_score": 8,
      "pros": ["...", "...", "..."],
      "cons": ["...", "...", "..."]
    },
    "product_b": { ... },
    "the_trade_off": "...",
    "hero_ingredient": "...",
    "pro_tip": "...",
    "final_recommendation": [
      { "winner": "Product A" },
      "..."
    ]
  }
}
```

---

## 🛠️ Technology Stack

### Frontend
- **React 19.2.0** - UI library
- **Vite 7.2.4** - Build tool and dev server
- **React Router DOM 7.13.0** - Client-side routing
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Framer Motion 12.31.2** - Animation library
- **Lucide React** - Icon library
- **React Webcam** - Camera integration
- **React QR Barcode Scanner** - Barcode scanning
- **Canvas Confetti** - Celebration animations

### Backend
- **Express 5.2.1** - Web framework
- **Google Generative AI (Gemini 2.5 Flash)** - AI analysis
- **Multer 2.0.2** - File upload handling
- **CORS 2.8.6** - Cross-origin resource sharing
- **Dotenv 17.2.3** - Environment variable management

---

## 🎨 Features Deep Dive

### 1. **Image Analysis**
Upload any food product label image, and the AI will:
- Identify ingredients and nutritional content
- Highlight green flags (beneficial ingredients)
- Warn about red flags (concerning ingredients)
- Provide personalized recommendations
- Suggest better alternatives
- Give actionable pro tips

### 2. **Barcode Scanner**
Scan product barcodes to:
- Fetch product data from OpenFoodFacts database
- Get instant nutritional analysis
- View detailed ingredient breakdowns
- Receive health scores tailored to your goals

### 3. **Product Comparison**
Compare two products to:
- See side-by-side nutritional analysis
- Get health scores for each product
- Understand trade-offs between options
- Receive a clear winner recommendation
- Learn about hero ingredients

### 4. **80/20 Rule Analysis**
The AI uses the "80/20 Rule" approach:
- Prioritizes major nutritional wins over minor imperfections
- Focuses on core benefits (protein, fiber, whole grains)
- Treats minor additives as notes, not dealbreakers
- Provides balanced, motivating recommendations

---

## 📱 Pages & Routes

- **`/`** - Home page with hero section and features overview
- **`/chat`** - Main chat interface for image analysis and barcode scanning
- **`/compare`** - Product comparison interface
- **`/about`** - About page with project information

---

## 🎯 User Goals & Personalization

The application supports personalized analysis based on:
- **Health Goals**: Weight loss, muscle gain, general wellness
- **Dietary Restrictions**: Vegan, vegetarian, gluten-free, etc.
- **Allergies**: Specific ingredient allergies
- **Medical Conditions**: Diabetes, hypertension, etc.

Users can specify their goals when analyzing products, and the AI will tailor recommendations accordingly.

---

## 🔒 Environment Variables

### Backend (`.env`)
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3001
```

---

## 📝 Development Scripts

### Backend
```bash
npm start          # Start production server
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

---

## 🌟 Key Highlights

- **AI-Powered**: Leverages Google's latest Gemini 2.5 Flash model
- **Real-time Analysis**: Get instant feedback on food products
- **Beautiful Design**: Modern UI with smooth animations
- **Responsive**: Works seamlessly on desktop and mobile
- **Personalized**: Tailored recommendations based on your health profile
- **Comprehensive**: Analyzes images, barcodes, and compares products

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

ISC License

---

## 👤 Author

Developed with ❤️ by the NutriAI team

---

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful AI capabilities
- **OpenFoodFacts** for barcode product data
- **React** and **Vite** communities for excellent tooling
- All contributors and users of this project

---

<div align="center">
  <strong>Make healthier choices with AI-powered insights! 🥗✨</strong>
</div>
