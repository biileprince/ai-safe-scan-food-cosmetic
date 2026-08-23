# SafeScan — AI-Powered Food & Cosmetic Product Safety Assessment

An intelligent mobile application that photographs product labels, extracts ingredients using AI-powered OCR, checks them against regulatory safety databases, and generates transparent, evidence-based safety reports.

## What It Does

1. **Photograph** any food or cosmetic product label
2. **AI extracts** all ingredients using vision OCR
3. **Safety engine** checks each ingredient against regulatory databases (NAFDAC, FDA, EU CosIng, KEBS, SAHPRA)
4. **Generates** a clear report: benefits, concerns, allergen alerts, and overall assessment

## Tech Stack

| Layer | Technology |
|---|---|
| **Mobile** | React Native (Expo Router) + TypeScript |
| **Backend & DB** | Appwrite Cloud (Auth, Databases, Storage, Functions) |
| **AI Engine** | Multi-provider abstraction (Gemini 2.0 Flash, OpenAI, Claude) |
| **State** | Zustand |
| **Icons** | @expo/vector-icons (Ionicons + MaterialCommunityIcons) |

## Architecture

```
📱 Expo App → ☁️ Appwrite Cloud → ⚡ Appwrite Function → 🔌 AI Provider → 📊 Safety DB
```

**Security:** The mobile app **never** calls the AI API directly. All AI processing happens inside Appwrite Functions where API keys are server-side environment variables.

## Project Structure

```
├── mobile/                        # Expo React Native app
│   ├── app/                       # Expo Router (file-based routing)
│   │   ├── (auth)/                # Auth flow (welcome, login, register)
│   │   ├── (tabs)/                # Main tabs (scan, history, compare, profile)
│   │   └── report/[id].tsx        # Dynamic report detail screen
│   ├── constants/                 # Theme, assessments, allergens, categories
│   ├── services/                  # Appwrite SDK service layer
│   ├── stores/                    # Zustand state management
│   └── components/                # Reusable UI components
│
├── functions/                     # Appwrite Cloud Functions
│   └── assess-product/            # Core AI assessment pipeline
│       └── src/
│           ├── main.js            # Pipeline orchestrator
│           ├── providers/         # Multi-AI provider abstraction
│           │   ├── aiProvider.js  # Base interface
│           │   ├── geminiProvider.js
│           │   └── providerFactory.js
│           ├── ocr/               # Text extraction
│           ├── classification/    # Product categorization
│           ├── extraction/        # Ingredient parsing
│           ├── normalization/     # Name standardization
│           ├── safety/            # Regulatory rule engines
│           └── assessment/        # Scoring & explanation
```

## Assessment Categories

| Status | Meaning |
|---|---|
| ✅ **Generally Favorable** | No major concerns from available label information |
| ⚠️ **Use With Caution** | Issues require attention but don't prove the product unsafe |
| 🚫 **High Concern** | Serious concern or regulatory warning identified |
| ❓ **Insufficient Evidence** | Image/label data too uncertain for reliable assessment |

## Target Jurisdictions

- 🇳🇬 Nigeria (NAFDAC)
- 🇰🇪 Kenya (KEBS)
- 🇿🇦 South Africa (SAHPRA/NRCS)
- 🇬🇭 Ghana (FDA-Ghana)
- 🇺🇸 United States (FDA)
- 🇪🇺 European Union (EC)

## AI Provider Abstraction

Switch AI providers by changing environment variables — zero code changes:

```env
AI_PROVIDER=gemini        # or openai, claude
AI_API_KEY=your_key_here
AI_MODEL=gemini-2.0-flash # optional model override
```

## Getting Started

```bash
# 1. Clone
git clone https://github.com/biileprince/ai-safe-scan-food-cosmetic.git
cd ai-safe-scan-food-cosmetic/mobile

# 2. Install dependencies
npm install

# 3. Start dev server
npx expo start

# 4. Scan QR code with Expo Go on your device
```

## Development Phases

- [x] **Phase 1** — Foundation & Skeleton (Auth, Navigation, Design System, Services)
- [ ] **Phase 2** — Camera, Upload & Processing Pipeline
- [ ] **Phase 3** — AI Engine & Safety Rules
- [ ] **Phase 4** — Report UI & History
- [ ] **Phase 5** — Polish, Testing & Hardening

## Important Disclaimer

SafeScan provides **informational assessments** based on ingredient labels and available evidence. It does not:
- Perform laboratory chemical testing
- Detect contaminants not declared on labels
- Replace medical, dietary, or regulatory advice
- Guarantee product safety

## License

MIT
