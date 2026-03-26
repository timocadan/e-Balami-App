# eBalami App

eBalami is a multilingual mobile application built with React Native and Expo for requesting medical and technical services. It supports Somali (default), English, and Amharic, and includes order creation, validation, and Firebase Firestore integration.

## Key Features

- Dual service flows: Medical (`Caafimaad`) and Technical (`Farsamo`)
- Multilingual UI (Somali, English, Amharic)
- Draft-to-confirmed order lifecycle in Firestore
- Form validation and input security helpers
- Admin dashboard-compatible confirmed orders
- Consistent dark theme and structured navigation

## Technology Stack

- React Native `0.81.5`
- React `19.1.0`
- Expo SDK `54.0.21`
- TypeScript `~5.9.2`
- Expo Router `~6.0.14`
- Firebase `^12.4.0` (Firestore)

## Project Structure

```text
app/                Expo Router screens and flows
components/         Reusable UI components
contexts/           Global context providers (language)
translations/       i18n JSON files (so/en/am)
utils/              Validation and security utilities
assets/images/      App images and icons
firebaseConfig.js   Firebase initialization
firestore.rules     Firestore security rules
```

## Getting Started

### Prerequisites

- Node.js `18+`
- npm `9+`
- Expo CLI (`npm install -g expo-cli`)
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/timocadan/e-Balami-App.git
   cd "eBalami App"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` in the project root:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
4. Start development server:
   ```bash
   npm start
   ```

### Run on Platforms

```bash
npm run android
npm run ios
npm run web
```

## Available Scripts

```bash
npm start
npm run android
npm run ios
npm run web
npm run lint
npm run reset-project
```

## Architecture Overview

### Medical Flow (`Caafimaad`)

`Home -> Caafimaad -> Service Selection -> Form -> Location -> Summary -> Success`

### Technical Flow (`Farsamo`)

`Home -> Farsamo -> Service Selection -> Location -> Form -> Details -> Summary -> Success`

### Data Lifecycle

1. User submits details to draft collections.
2. User confirms order on summary screen.
3. Order is moved to confirmed collections.
4. Admin dashboard consumes confirmed data.

## Firestore Collections

- Draft medical: `dalabyadaAanDhamaystirnayn`
- Draft technical: `dalabyadaFarsamoQabyoAh`
- Confirmed medical: `dalabyadaDhamaystiran`
- Confirmed technical: `dalabyadaFarsamada`

## Deployment Notes

- Build with EAS:
  ```bash
  eas build --platform android
  eas build --platform ios
  ```
- Deploy Firestore rules:
  ```bash
  firebase deploy --only firestore:rules
  ```

## Documentation

- Technical documentation: `TECHNICAL_DOCUMENTATION.md`
- Security notes: `SECURITY_IMPLEMENTATION.md`

## Support

For project questions and support: `ebalamiservices@gmail.com`
