# Fältskytte-timer

En enkel mobilanpassad timer för fältskytte, byggd med Vite och vanlig HTML, CSS och JavaScript.

Appen används för att ställa in skjuttiden för en station och spela upp kommandosekvensen för fast mål:

- 10 sekunder kvar
- Färdiga
- Eld
- Eld upphör

Den kritiska timingen bygger inte på JavaScript-timers under uppspelningen. I stället sätts kommandon och tystnad ihop till en sammanhängande WAV-sekvens där tidsintervallen bestäms av antalet ljudsamplingar.

## Publicerad app

Appen publiceras automatiskt till GitHub Pages från `main`:

https://morgansundsvallmakers.github.io/faltskytte-timer/

## Status

En första fungerande version finns publicerad och är testad på både dator och telefon.

Under aktiv utveckling är PWA/service worker avstängd som standard för att undvika att gamla cachade versioner stör testning. PWA-stöd kan aktiveras vid bygge med miljövariabeln `PWA=true`.

Ljudkommandona finns i `public/audio/commands/`. Nuvarande version använder prototypljud; de kan senare ersättas utan att ändra principen för den sample-baserade timingen.

## Lokalt

Node.js och npm behövs.

```sh
npm ci
npm run dev
```

Bygg och granska produktionsversionen:

```sh
npm run build
npm run preview
```

Vite använder basvägen `/faltskytte-timer/` för GitHub Pages.
