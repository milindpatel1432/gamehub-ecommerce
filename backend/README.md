# GameHub Backend Service

This is the production-ready Node.js + Express.js + MongoDB backend architecture for the GameHub Gaming Marketplace e-commerce web application.

## Directory Structure

```text
backend/
├── src/
│   ├── config/       # Global constants, settings config variables
│   ├── controllers/  # Route controller request handlers
│   ├── database/     # Mongoose connection bootloader
│   ├── middleware/   # Custom Express request interception filters
│   ├── models/       # Mongoose schemas definitions
│   ├── routes/       # API endpoints routing routes
│   ├── services/     # Decoupled database query and transaction helper logic
│   ├── utils/        # General purpose auxiliary utilities
│   ├── validations/  # Request input validation rules schemas
│   ├── app.js        # Main Express App configurator
│   └── server.js     # Entry listener bootloader script
├── .env.example      # Configuration keys template file
├── package.json      # Node scripts and package references
└── README.md
```

## Configured Packages
- **express**: App framework routing engine
- **mongoose**: MongoDB object modeling utility
- **cors**: Cross-Origin Request configuration middleware
- **dotenv**: Environmental variables file loader
- **helmet**: Secure HTTP header configuration middleware
- **morgan**: HTTP request log viewer middleware
- **cookie-parser**: HTTP cookie payload parser
- **express-validator**: Schema validators utility

## Getting Started

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Start development server session:
   ```bash
   npm run dev
   ```
