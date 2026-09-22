# Fältskytte-timer

Ett minimalt PWA-skelett med Vite och vanlig HTML, CSS och JavaScript. Ingen timer- eller WAV-logik finns ännu.

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

Vite använder basvägen `/faltskytte-timer/` för GitHub Pages. Produktionsbygget i `dist/` innehåller manifest och service worker. Besök sidan en gång med nätverk så att filerna kan cachelagras innan den används offline. Kör via HTTPS eller localhost; service workers fungerar inte direkt från `file://`.

Framtida ljudfiler kan läggas i `public/audio/`. Den befintliga lokala mappen `faltskytte-timer-audio/` är undantagen från Git och ingår inte i bygget. Ingen publiceringskonfiguration eller GitHub Pages-deploy har gjorts.
