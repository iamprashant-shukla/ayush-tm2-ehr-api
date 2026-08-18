# AYUSH TM2 EHR API

Backend service and Supabase database integration mapping **AYUSH NAMASTE Portal** terminology to **WHO ICD-11 Traditional Medicine Module 2 (TM2)** codes for EHR-compliant Electronic Health Record (EHR) systems in India.

## Overview

Standardizing traditional medicine terminology (Ayurveda, Siddha, Unani) is essential for interoperable healthcare records under India's Digital Health Mission (ABDM). This project provides:
- Database schemas for AYUSH diagnostic and terminology codes (`Namaste_code`).
- Mapping structures between NAMASTE terms (English, Devanagari, Hinglish) and WHO ICD-11 TM2.
- Local Supabase development configuration and automated migrations.

## Repository Structure

```
.
├── supabase/
│   ├── config.toml       # Supabase CLI project configuration
│   └── migrations/       # Database migrations for tables & indexes
├── .gitignore
└── README.md
```

## Schema: `Namaste_code`

| Column | Type | Description |
| :--- | :--- | :--- |
| `Sr No.` | `bigint` | Primary Key |
| `TM2 Code` | `varchar` | WHO ICD-11 TM2 classification code |
| `Ayurveda Code` | `varchar` | AYUSH Ayurveda terminology code |
| `Name English` | `varchar` | Term name in English |
| `Namc Term Devanagari` | `varchar` | Term name in Devanagari script |
| `Hinglish` | `varchar` | Phonetic Hinglish representation |

## Local Setup

### Prerequisites
- Node.js (v18+)
- Supabase CLI

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/iamprashant-shukla/ayush-tm2-ehr-api.git
   cd ayush-tm2-ehr-api
   ```

2. **Initialize & Link Supabase**
   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   ```

3. **Apply Database Migrations**
   ```bash
   npx supabase db push
   ```

## License

MIT
