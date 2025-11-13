# Puglia Regionali 2025 - Portale Elettorale

Applicazione web per il monitoraggio in tempo reale dei risultati delle elezioni regionali della Puglia 2025.

## 📋 Descrizione

Questo progetto è una piattaforma web sviluppata con Next.js 16 che permette di visualizzare e monitorare i risultati elettorali delle elezioni regionali pugliesi del 2025. L'applicazione offre una visualizzazione dettagliata dei risultati per candidati, affluenza e dati suddivisi per provincia.

### Caratteristiche Principali

- 🗳️ **Visualizzazione Risultati**: Tabelle dettagliate con i risultati dei candidati e relative percentuali
- 📊 **Affluenza in Tempo Reale**: Monitoraggio dell'affluenza alle urne con grafici e statistiche
- 🗺️ **Dati Provinciali**: Risultati dettagliati per ciascuna delle 6 province pugliesi (Bari, BAT, Brindisi, Foggia, Lecce, Taranto)
- 🌓 **Dark Mode Intelligente**: Supporto per modalità chiara/scura con sincronizzazione automatica al tema di sistema
- 📱 **Design Responsivo**: Interfaccia ottimizzata per desktop, tablet e mobile
- ⚡ **Performance**: Utilizzo di Next.js 16 con Turbopack per un caricamento ultra-veloce

## 🚀 Tecnologie Utilizzate

- **Framework**: [Next.js 16.0.2](https://nextjs.org/) (Pages Router)
- **UI Framework**: [React 19.2.0](https://react.dev/)
- **Linguaggio**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**:
  - [Tailwind CSS 4.0.0](https://tailwindcss.com/) (stable)
  - [DaisyUI 5.5.2](https://daisyui.com/) - Componenti UI
- **State Management**: [Redux Toolkit 2.10.1](https://redux-toolkit.js.org/)
- **Font**: [Google Fonts - Roboto](https://fonts.google.com/specimen/Roboto)

## 📦 Installazione

### Prerequisiti

- Node.js 18.x o superiore
- npm, yarn, pnpm o bun

### Setup del Progetto

1. Clona il repository:

```bash
git clone <url-repository>
cd shamaninn
```

1. Installa le dipendenze:

```bash
npm install
```

1. Avvia il server di sviluppo:

```bash
npm run dev
```

1. Apri [http://localhost:3000](http://localhost:3000) nel browser

## 🗂️ Struttura del Progetto

```text
shamaninn/
├── src/                        # Codice sorgente applicazione
│   ├── pages/                 # Pages Router
│   │   ├── _app.tsx          # App wrapper principale
│   │   ├── _document.tsx     # Document HTML personalizzato
│   │   ├── index.tsx         # Homepage
│   │   ├── risultati.tsx     # Pagina risultati elettorali
│   │   ├── affluenze.tsx     # Pagina affluenza
│   │   └── provincia/
│   │       └── [provincia].tsx  # Pagine dinamiche per provincia
│   ├── components/            # Componenti React riutilizzabili
│   │   ├── Navbar.tsx        # Barra di navigazione con dark mode
│   │   └── Providers.tsx     # Context providers
│   ├── styles/
│   │   └── globals.css       # Stili globali e configurazione Tailwind
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   ├── store/                 # Redux store
│   │   ├── store.ts          # Configurazione store
│   │   └── regionaleSlice.ts # Slice per dati regionali
│   └── types/
│       └── election.ts        # TypeScript types
├── public/
│   └── data/
│       └── risultati-regionali.json  # Dati elettorali (mock)
└── next.config.ts             # Configurazione Next.js
```

## 🎨 Funzionalità Dark Mode

Il sistema di dark mode offre tre modalità:

1. **Auto**: Segue automaticamente il tema del sistema operativo in tempo reale
2. **Light**: Modalità chiara forzata
3. **Dark**: Modalità scura forzata

Il pulsante nella navbar cicla tra queste tre modalità. La preferenza viene salvata in localStorage e ripristinata automaticamente nelle visite successive.

## 📄 Pagine Disponibili

- `/` - Homepage con panoramica elezioni
- `/risultati` - Risultati completi con tabella candidati
- `/affluenze` - Statistiche affluenza per provincia
- `/provincia/[nome]` - Dettagli per singola provincia:
  - `/provincia/bari`
  - `/provincia/bat`
  - `/provincia/brindisi`
  - `/provincia/foggia`
  - `/provincia/lecce`
  - `/provincia/taranto`

## 🛠️ Script Disponibili

```bash
# Avvia il server di sviluppo
npm run dev

# Crea build di produzione
npm run build

# Avvia il server di produzione
npm run start

# Esegue il linter
npm run lint
```

## 🎯 Caratteristiche Tecniche

### Routing

- Utilizzo di **Pages Router** per compatibilità e semplicità
- Routing dinamico per le pagine delle province
- `getServerSideProps` per SSR (Server-Side Rendering)

### Styling

- **Tailwind CSS 4.0** con configurazione nativa CSS (`@import`)
- **DaisyUI** per componenti UI pre-stilizzati
- Temi personalizzati per light/dark mode
- CSS custom properties per variabili di tema

### Performance

- **Turbopack** come bundler di sviluppo (default Next.js 16)
- Ottimizzazione automatica delle immagini
- Code splitting automatico
- Font optimization con `next/font`

### Type Safety

- TypeScript strict mode
- Tipi definiti per dati elettorali
- Props tipizzate per tutti i componenti

## 📊 Formato Dati

I dati elettorali sono strutturati in formato JSON:

```typescript
interface ElectionData {
  timestamp: string;
  totalVoters: number;
  votedCount: number;
  turnoutPercentage: number;
  candidates: Candidate[];
  provinces: ProvinceData[];
}
```

## 🔧 Configurazione

### Tailwind CSS

La configurazione di Tailwind CSS 4.0 avviene direttamente nel file `styles/globals.css`:

```css
@import "tailwindcss";
@plugin "daisyui";
```

### Next.js

Configurazione in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  reactCompiler: true,
};
```

## 🐛 Risoluzione Problemi

### Gli stili non vengono applicati

- Verifica che `@plugin "daisyui";` sia presente in `globals.css`
- Controlla che il file CSS sia importato in `_app.tsx`
- Riavvia il server di sviluppo

### Dark mode non funziona

- Cancella il localStorage del browser
- Verifica che l'attributo `data-theme` sia presente sul tag `<html>`
- Ricarica la pagina

### Errori di routing

- Assicurati che i nomi delle province siano lowercase nell'URL
- Verifica che `getServerSideProps` sia presente nelle pagine dinamiche

## 📝 Note di Sviluppo

### Migrazione da App Router

Il progetto è stato inizialmente sviluppato con App Router e successivamente migrato a Pages Router per:

- Maggiore stabilità con Next.js 16
- Compatibilità con Redux e state management
- Gestione sincrona dei parametri di routing
- Migliore supporto per SSR

### Scelte Architetturali

- **Pages Router** invece di App Router per evitare problemi con async params
- **DaisyUI** per velocizzare lo sviluppo UI
- **Tailwind CSS 4.0** per le ultime funzionalità di styling
- **localStorage** per persistenza preferenze tema

## 🚀 Deploy

### Vercel (Consigliato)

```bash
vercel
```

### Build Locale

```bash
npm run build
npm run start
```

## 📄 Licenza

Questo progetto è stato sviluppato per le elezioni regionali della Puglia 2025.

## 👥 Contributi

Progetto sviluppato con GitHub Copilot e Claude Sonnet 4.5.

---

**Ultimo aggiornamento**: 13 novembre 2025
