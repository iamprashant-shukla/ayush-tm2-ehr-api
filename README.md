# AYUSH TM2 EHR API & Multilingual Fuzzy Search Engine

Full-stack microservice and Supabase database integration mapping **AYUSH NAMASTE Portal** terminology to **WHO ICD-11 Traditional Medicine Module 2 (TM2)** codes for ABDM-compliant Electronic Health Record (EHR) systems in India.

## 🚀 Features

- **Multilingual Fuzzy Search Engine**: Fast real-time search across English, Devanagari script, and phonetic Hinglish.
- **WHO ICD-11 TM2 Mapping**: Instant cross-referencing between AYUSH diagnostic entities and WHO classification codes (`SR11`, `SQ00`, `SN49`, etc.).
- **EHR API Bridge**: Standardized `GET /api/search?q=:query` endpoint returning structured JSON payloads for ABDM integration.
- **Clean UI**: Minimalist search interface with autocomplete dropdown and JSON viewer.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, TypeScript)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL with `pg_trgm` extension & GIN indexes)
- **Styling**: Vanilla CSS design system

---

## 📦 Getting Started for Developers / Teammates

### 1. Clone the Repository
```bash
git clone https://github.com/iamprashant-shukla/ayush-tm2-ehr-api.git
cd ayush-tm2-ehr-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a file named `.env.local` in the root directory and add the Supabase project credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the search interface.

---

## 📡 API Reference

### Search Endpoint: `GET /api/search`

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `q` | `string` | **Yes** | Search term in English, Devanagari, Hinglish, TM2 code, or Ayurveda code |

#### Example Request:
```bash
curl -X GET "http://localhost:3000/api/search?q=Vata"
```

#### Example Response:
```json
{
  "success": true,
  "count": 50,
  "data": [
    {
      "Sr No.": 1,
      "TM2 Code": "SR11",
      "Ayurveda Code": "AAA-1",
      "Name English": "Accumulation of Vata pattern (TM2)",
      "Namc Term Devanagari": "वातसञ्चयः",
      "Hinglish": "Vatasanchayah"
    }
  ]
}
```

---

## 🔒 Security

All environment files (`.env`, `.env.local`, etc.) are ignored by Git to protect database credentials.

## 📄 License

MIT
