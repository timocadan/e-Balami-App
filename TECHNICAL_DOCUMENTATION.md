# eBalami Mobile App - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Development Workflow](#development-workflow)
6. [Application Architecture](#application-architecture)
7. [Core Features](#core-features)
8. [Database Structure](#database-structure)
9. [Internationalization (i18n)](#internationalization-i18n)
10. [Security Implementation](#security-implementation)
11. [State Management](#state-management)
12. [Routing & Navigation](#routing--navigation)
13. [Form Handling & Validation](#form-handling--validation)
14. [Styling Guidelines](#styling-guidelines)
15. [Recent UI/UX Updates](#recent-uiux-updates)
16. [Testing](#testing)
17. [Deployment](#deployment)
18. [Troubleshooting](#troubleshooting)
19. [Contributing Guidelines](#contributing-guidelines)

---

## Project Overview

**eBalami** is a multilingual mobile application built with React Native and Expo that facilitates service requests for medical and technical services. The app supports three languages (Somali, English, and Amharic) and provides a seamless flow for users to request services, submit their information, and track their orders.

### Key Features
- **Dual Service Types**: Medical Services (Caafimaad) and Technical Services (Farsamo)
- **Multilingual Support**: Somali (default), English, and Amharic
- **Order Management**: Draft orders that convert to confirmed orders upon completion
- **Admin Dashboard Integration**: Web-based admin panel for order management
- **Form Validation**: Comprehensive client-side and server-side validation
- **Dark Theme**: Consistent dark theme throughout the application

---

## Technology Stack

### Core Framework
- **React Native**: `0.81.5`
- **React**: `19.1.0`
- **Expo SDK**: `54.0.21`
- **TypeScript**: `~5.9.2`

### Key Libraries
- **Expo Router**: `~6.0.14` - File-based routing
- **Firebase**: `^12.4.0` - Backend database (Firestore)
- **React Navigation**: Bottom tabs and drawer navigation
- **AsyncStorage**: `@react-native-async-storage/async-storage` - Local storage
- **Phone Number Input**: `react-native-phone-number-input` - Phone validation

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Type safety
- **Expo CLI**: Development and build tools

---

## Project Structure

```
ebalami-app/
├── app/                          # Expo Router pages (file-based routing)
│   ├── _layout.tsx              # Root layout with providers
│   ├── index.tsx                # Entry point (redirects to /home)
│   └── (tabs)/                  # Tab navigation group
│       ├── _layout.tsx          # Tab layout configuration
│       ├── home/                # Home tab screens
│       │   ├── index.tsx        # Main home screen
│       │   ├── caafimaad/       # Medical services flow
│       │   │   ├── index.tsx    # Service selection
│       │   │   ├── adeegyada.tsx # Services selection (package/single)
│       │   │   ├── form.tsx     # Customer information form
│       │   │   ├── goobta.tsx   # Destination selection
│       │   │   ├── bixinta.tsx  # Order summary
│       │   │   └── guusha.tsx   # Success screen
│       │   └── farsamo/         # Technical services flow
│       │       ├── index.tsx    # Service selection
│       │       ├── location.tsx # Location selection
│       │       ├── form.tsx     # Customer information form
│       │       ├── faahfaahin.tsx # Additional details
│       │       ├── bixinta.tsx  # Order summary
│       │       └── guusha.tsx   # Success screen
│       ├── about.tsx            # About Us page
│       └── contact.tsx          # Contact page
│
├── assets/                      # Static assets
│   └── images/                 # Image files (logos, icons)
│
├── components/                  # Reusable components
│   └── ui/                     # UI components
│
├── contexts/                    # React Context providers
│   └── LanguageContext.tsx     # Language state management
│
├── constants/                   # App constants
│   └── theme.ts                # Theme configuration
│
├── hooks/                       # Custom React hooks
│
├── translations/                # i18n translation files
│   ├── so.json                 # Somali translations
│   ├── en.json                 # English translations
│   └── am.json                 # Amharic translations
│
├── utils/                       # Utility functions
│   ├── validation.ts           # Input validation utilities
│   └── security.ts             # Security utilities
│
├── firebaseConfig.js           # Firebase configuration
├── firestore.rules             # Firestore security rules
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript configuration
├── babel.config.js             # Babel configuration
└── .env                        # Environment variables (not in git)
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Expo CLI**: Install globally with `npm install -g expo-cli`
- **Firebase CLI**: Install globally with `npm install -g firebase-tools`
- **Git**: For version control

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "eBalami App"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
   > **Note**: The `.env` file is in `.gitignore` and should never be committed.

4. **Configure Firebase**
   - Ensure `firebase.json` and `.firebaserc` are properly configured
   - Deploy Firestore security rules:
     ```bash
     firebase login
     firebase deploy --only firestore:rules
     ```

5. **Start the development server**
   ```bash
   npm start
   ```
   Or for a specific platform:
   ```bash
   npm run android  # Android
   npm run ios      # iOS
   npm run web      # Web
   ```

### Running on Physical Device
- Install **Expo Go** app on your device
- Scan the QR code from the terminal/Expo Dev Tools
- Ensure your device and computer are on the same network

---

## Development Workflow

### Available Scripts

```bash
npm start              # Start Expo dev server
npm run android        # Start with Android emulator
npm run ios            # Start with iOS simulator
npm run web            # Start web version
npm run lint           # Run ESLint
npm run reset-project  # Reset project (if needed)
```

### Development Guidelines

1. **Code Style**
   - Follow TypeScript best practices
   - Use ESLint for code quality
   - Maintain consistent naming conventions (camelCase for variables, PascalCase for components)

2. **File Naming**
   - Components: `PascalCase.tsx` (e.g., `HomeScreen.tsx`)
   - Utilities: `camelCase.ts` (e.g., `validation.ts`)
   - Constants: `camelCase.ts` (e.g., `theme.ts`)

3. **Git Workflow**
   - Never commit `.env` files
   - Write descriptive commit messages
   - Create feature branches for new functionality

---

## Application Architecture

### Flow Architecture

#### Medical Services Flow (Caafimaad)
```
Home → Caafimaad → Service Selection → 
  ├─ Package Services (multiple)
  └─ Single Service
     ↓
  Services Selection → Customer Form → 
  Location Selection → Summary → Success
```

#### Technical Services Flow (Farsamo)
```
Home → Farsamo → Service Selection → 
  Location Selection → Customer Form → 
  Additional Details → Summary → Success
```

### State Management
- **Global State**: React Context API (`LanguageContext`)
- **Local State**: React hooks (`useState`, `useEffect`)
- **Persistent Storage**: AsyncStorage for language preference

### Data Flow
1. User input → Form validation
2. Validated data → Firestore (draft collection)
3. User confirmation → Move to confirmed collection
4. Admin dashboard reads from confirmed collections

---

## Core Features

### 1. Service Request System

**Medical Services (Caafimaad)**
- Hotel Booking
- Hospital Booking
- Translator Services
- Airport Taxi
- Flight Ticket (WhatsApp redirect)
- Other Services (custom modal)

**Technical Services (Farsamo)**
- Home/Office Repair
- Electrician
- Plumber
- Construction
- Technology Services
- Car Repair
- Events
- Other Services

### 2. Order Lifecycle

1. **Draft Stage** (`dalabyadaAanDhamaystirnayn` / `dalabyadaFarsamoQabyoAh`)
   - User creates order with basic info
   - Order can be updated/modified
   - User completes all required fields

2. **Confirmation Stage**
   - User reviews and confirms order
   - Draft is copied to confirmed collection
   - Draft is deleted from temporary collection

3. **Confirmed Order** (`dalabyadaDhamaystiran` / `dalabyadaFarsamada`)
   - Immutable record
   - Visible to admin dashboard
   - Only admins can delete

### 3. Language Support

- **Somali (so)**: Default language
- **English (en)**: Full translation
- **Amharic (am)**: Full translation

Language preference is persisted using AsyncStorage and applied globally through `LanguageContext`.

---

## Database Structure

### Firestore Collections

#### Draft Collections
```
dalabyadaAanDhamaystirnayn/    # Medical services drafts
  ├─ {docId}
  │   ├─ services: string[]
  │   ├─ nooca_dalabka: "caafimaad"
  │   ├─ timestamp: Timestamp
  │   ├─ name?: string
  │   ├─ email?: string          # Currently not collected (field hidden)
  │   ├─ phone?: string
  │   ├─ age?: number
  │   ├─ city?: string
  │   └─ destination?: string

dalabyadaFarsamoQabyoAh/       # Technical services drafts
  ├─ {docId}
  │   ├─ service: string
  │   ├─ location: string
  │   ├─ name: string
  │   ├─ email?: string          # Currently not collected (field hidden)
  │   ├─ phone: string
  │   ├─ address: string
  │   ├─ timestamp: Timestamp
  │   └─ details?: string
```

#### Confirmed Collections
```
dalabyadaDhamaystiran/         # Medical services confirmed
  ├─ {docId}
  │   ├─ (all fields from draft)
  │   ├─ status: "xaqiijiyay"
  │   └─ timestamp_dhamaystiran: Timestamp

dalabyadaFarsamada/            # Technical services confirmed
  ├─ {docId}
  │   ├─ (all fields from draft)
  │   ├─ status: "xaqiijiyay"
  │   └─ timestamp_dhamaystiran: Timestamp
```

### Security Rules

See `firestore.rules` for complete security configuration:
- Draft collections: Full read/write access
- Confirmed collections: Read/write for all, delete only for admins
- Admin identification: Email-based whitelist

---

## Internationalization (i18n)

### Translation Structure

All translations are stored in JSON files under `/translations/`:
- `so.json` - Somali (default)
- `en.json` - English
- `am.json` - Amharic

### Translation Key Structure
```json
{
  "home": {
    "title": "Welcome Text",
    "medicalServices": "Medical Services Button",
    "technicalServices": "Technical Services Button"
  },
  "caafimaad": {
    "services": {
      "hotelBooking": "Hotel Booking",
      "hospitalBooking": "Hospital Booking"
    }
  }
}
```

### Usage in Components

```typescript
import { useLanguage } from '../../contexts/LanguageContext';

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return <Text>{t('home.title')}</Text>;
}
```

### Adding New Translations

1. Add the key to all three translation files
2. Provide translations in each language
3. Use `t('your.key.path')` in components

---

## Security Implementation

### Client-Side Security

1. **Input Validation** (`utils/validation.ts`)
   - Name validation (2-100 chars)
   - Email format validation
   - Phone number validation
   - Address validation (5-500 chars)
   - Document ID validation

2. **Input Sanitization**
   - HTML tag removal
   - JavaScript protocol removal
   - Event handler removal
   - Whitespace normalization

3. **Safe Error Messages** (`utils/security.ts`)
   - Generic error messages
   - No sensitive data exposure
   - Production vs development modes

### Server-Side Security

1. **Firestore Security Rules**
   - Document ID validation
   - Field validation
   - Admin-only operations
   - Collection access control

2. **Environment Variables**
   - Firebase credentials in `.env`
   - Never committed to version control
   - Fallback to `app.json` for Expo builds

See `SECURITY_IMPLEMENTATION.md` for detailed security documentation.

---

## State Management

### Language Context

**Location**: `contexts/LanguageContext.tsx`

**Features**:
- Global language state
- Persistent language preference (AsyncStorage)
- Translation function `t(key: string)`
- Language switching

**Usage**:
```typescript
const { language, setLanguage, t } = useLanguage();
```

### Local State Management

- Use `useState` for component-specific state
- Use `useEffect` for side effects
- Use `useRef` for mutable values that don't trigger re-renders

---

## Routing & Navigation

### Expo Router

The app uses **file-based routing** with Expo Router.

**Route Structure**:
```
/                    → Redirects to /home
/home                → Home screen
/home/caafimaad      → Medical services
/home/farsamo        → Technical services
/(tabs)/about        → About page
/(tabs)/contact      → Contact page
```

### Navigation Patterns

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate with params
router.push({
  pathname: '/home/caafimaad/form',
  params: { qabyoId: docId }
});

// Navigate back
router.back();

// Replace (no back button)
router.replace('/home/caafimaad/guusha');
```

### Tab Navigation

Configured in `app/(tabs)/_layout.tsx`:
- Home (🏠)
- About Us (ℹ️)
- Contact (📞)

---

## Form Handling & Validation

### Validation Utilities

All validation functions return:
```typescript
{
  isValid: boolean;
  sanitized: string;
  error?: string;
}
```

### Available Validators

- `validateName(name: string)`
- `validateEmail(email: string)` - Currently not used (email field hidden)
- `validateAddress(address: string)`
- `validateCity(city: string)`
- `validateDetails(details: string)`
- `validateDocumentId(id: string | string[])`
- `validateService(service: string | string[])`
- `validateLocation(location: string | string[])`
- `validateAge(age: number)`

**Note**: Email validation is available but currently disabled in forms. See [Email Field (Currently Hidden)](#email-field-currently-hidden) section for details.

### Form Pattern

```typescript
const handleSubmit = async () => {
  // Validate inputs
  const nameValidation = validateName(name);
  if (!nameValidation.isValid) {
    Alert.alert('Error', nameValidation.error);
    return;
  }
  
  // Use sanitized data
  const sanitizedName = nameValidation.sanitized;
  
  // Submit to Firestore
  await addDoc(collection(db, 'collection'), {
    name: sanitizedName
  });
};
```

---

## Styling Guidelines

### Theme Colors

```typescript
Primary: #FFC107 (Yellow)
Background: #121212 (Dark)
Card Background: #1E1E1E
Text: #FFFFFF
Secondary Text: #A9A9A9
Border: #333333
```

### StyleSheet Pattern

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center'
  }
});
```

### Design Principles
- Dark theme throughout
- Yellow accent color (#FFC107) for primary actions
- Consistent spacing (8px grid system)
- Rounded corners (8-16px border radius)

### UI Component Standards

#### Back Button Consistency
All back buttons across the application follow a standardized design:

**Icon**: `MaterialIcons arrow-back-ios` (standardized across all pages)

**Position & Styling**:
```typescript
backButton: {
  position: 'absolute',
  top: 40,
  left: 20,
  zIndex: 10,
  backgroundColor: 'rgba(0,0,0,0.4)',
  padding: 8,
  borderRadius: 20
}
```

**Implementation**:
- All pages use the same back button component
- Semi-transparent black background for visibility
- Consistent positioning and z-index for proper layering
- Rounded corners for modern aesthetic

**Files with standardized back buttons**:
- `app/(tabs)/home/farsamo/index.tsx`
- `app/(tabs)/home/caafimaad/index.tsx`
- `app/(tabs)/home/farsamo/location.tsx`
- `app/(tabs)/home/caafimaad/adeegyada.tsx`
- `app/(tabs)/home/farsamo/form.tsx`
- `app/(tabs)/home/caafimaad/form.tsx`
- `app/(tabs)/home/farsamo/faahfaahin.tsx`
- `app/(tabs)/home/caafimaad/goobta.tsx`
- `app/(tabs)/home/farsamo/bixinta.tsx`
- `app/(tabs)/home/caafimaad/bixinta.tsx`

---

## Recent UI/UX Updates

### Email Field (Currently Hidden)

**Status**: Email input fields are currently hidden but code is preserved for future use.

**Affected Forms**:
- `app/(tabs)/home/farsamo/form.tsx`
- `app/(tabs)/home/caafimaad/form.tsx`

**Implementation Details**:
- Email field UI is commented out in both forms
- Email validation is disabled (commented out)
- Email is not saved to Firestore when hidden
- State variables remain in code but are not used

**To Re-enable Email Field**:
1. **In both form files**, uncomment the email input JSX block (marked with `/* EMAIL FIELD - HIDDEN */`)
2. **In `handleNext` function**, uncomment the email validation block
3. **In Firestore save/update**, uncomment the email field in the document

**Example (farsamo/form.tsx)**:
```typescript
// Currently commented out:
/*
<Text style={styles.label}>{t('farsamo.form.email')}</Text>
<TextInput 
    style={[styles.input, isEmailFocused && styles.inputFocused]} 
    placeholder={t('farsamo.form.emailPlaceholder')} 
    // ... rest of props
/>
*/
```

### Design Consistency Improvements (December 2024)

**Changes Made**:
1. **Back Button Standardization**
   - Changed Farsamo first page from `Ionicons arrow-back` to `MaterialIcons arrow-back-ios`
   - Standardized all back buttons to use `MaterialIcons arrow-back-ios`
   - Applied consistent styling (background, position, z-index) across all pages

2. **Position Standardization**
   - Standardized back button position from `top: 20` to `top: 40` in form pages
   - Adjusted progress bar margins accordingly (from `marginTop: 50` to `marginTop: 70`)

3. **Visual Consistency**
   - All back buttons now have semi-transparent background (`rgba(0,0,0,0.4)`)
   - Consistent border radius (20px) for modern look
   - Uniform z-index (10) for proper layering

**Rationale**:
- Improves user experience with consistent navigation patterns
- Reduces cognitive load by maintaining visual consistency
- Makes the codebase easier to maintain with standardized components

---

## Testing

### Manual Testing Checklist

**Forms**:
- [ ] Test with invalid inputs
- [ ] Test with empty fields
- [ ] Test with special characters
- [ ] Test input length limits

**Navigation**:
- [ ] Test all navigation paths
- [ ] Test back button behavior
- [ ] Test deep linking

**Language Switching**:
- [ ] Test language toggle
- [ ] Verify all text translates
- [ ] Test language persistence

**Firestore Integration**:
- [ ] Test order creation
- [ ] Test order confirmation
- [ ] Test admin access

### Error Testing
- Test with invalid document IDs
- Test with network failures
- Test with invalid route parameters

---

## Deployment

### Development Build

```bash
npm start
```

### Production Build

1. **Update version numbers**
   - `app.json`: Update `version`
   - `package.json`: Update `version`

2. **Build with EAS**
   ```bash
   eas build --platform android
   eas build --platform ios
   ```

3. **Submit to App Stores**
   ```bash
   eas submit --platform android
   eas submit --platform ios
   ```

### Environment Variables for Production

Ensure `.env` file is properly configured for production Firebase project.

### Firestore Rules Deployment

```bash
firebase deploy --only firestore:rules
```

---

## Troubleshooting

### Common Issues

#### 1. Firebase Connection Issues
**Problem**: Cannot connect to Firestore

**Solutions**:
- Verify `.env` file exists and has correct values
- Check Firebase project is active
- Verify internet connection
- Check Firestore security rules are deployed

#### 2. Language Not Persisting
**Problem**: Language resets on app restart

**Solutions**:
- Check AsyncStorage permissions
- Verify `LanguageContext` is properly wrapped in root layout
- Check for AsyncStorage errors in console

#### 3. Form Validation Not Working
**Problem**: Invalid data passes validation

**Solutions**:
- Ensure validation functions are imported correctly
- Check validation functions are called before submission
- Verify error handling in form components

#### 4. Navigation Issues
**Problem**: Routes not working or wrong screen shown

**Solutions**:
- Verify file structure matches Expo Router conventions
- Check route parameters are correctly passed
- Clear Metro bundler cache: `npx expo start --clear`

#### 5. Build Errors
**Problem**: Build fails with TypeScript errors

**Solutions**:
- Run `npm install` to ensure dependencies are installed
- Check TypeScript version compatibility
- Verify all imports are correct
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Debug Mode

Enable debug logging:
```typescript
// In components, use console.log for debugging
console.log('Debug info:', data);

// Remove before production!
```

### Metro Bundler Cache

Clear cache if experiencing issues:
```bash
npx expo start --clear
```

---

## Contributing Guidelines

### Code Style
- Follow existing code patterns
- Use TypeScript for type safety
- Write descriptive variable and function names
- Add comments for complex logic

### Commit Messages
- Use clear, descriptive messages
- Format: `type: description`
- Examples:
  - `feat: add new service type`
  - `fix: resolve form validation issue`
  - `docs: update technical documentation`

### Pull Request Process
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Update documentation if needed
5. Submit pull request with description

### Adding New Features

1. **New Service Type**:
   - Add service to appropriate flow (`caafimaad` or `farsamo`)
   - Add translations to all language files
   - Update service selection screens
   - Test complete flow

2. **New Screen**:
   - Create file in appropriate directory
   - Add translations
   - Update navigation
   - Style consistently with theme

3. **New Validation**:
   - Add function to `utils/validation.ts`
   - Export from module
   - Use in appropriate forms
   - Test edge cases

---

## Additional Resources

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Project-Specific
- `SECURITY_IMPLEMENTATION.md` - Detailed security documentation
- `firestore.rules` - Database security rules
- Translation files in `/translations/` - i18n content

---

## Support & Contact

For questions or issues:
- Review this documentation
- Check existing issues
- Contact: ebalamiservices@gmail.com

---

**Last Updated**: December 2024  
**Documentation Version**: 1.1

### Recent Updates (v1.1)
- Added UI component standards section
- Documented email field hiding implementation
- Added design consistency improvements documentation
- Updated back button standardization details  
**Maintained by**: eBalami Development Team

