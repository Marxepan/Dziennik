
const CACHE_NAME = 'freedom-journal-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/badges.ts',
  '/components/Calendar.tsx',
  '/components/NoteEditor.tsx',
  '/components/Stats.tsx',
  '/components/GoalTracker.tsx',
  '/components/FallAnalysis.tsx',
  '/components/ProgressChart.tsx',
  '/components/RelapseTimer.tsx',
  '/components/Lifeline.tsx',
  '/components/NotesList.tsx',
  '/components/Badges.tsx',
  '/components/ZIKAnalysisVisualization.tsx',
  '/components/TreeOfFreedom.tsx',
  '/components/DailyCheckin.tsx',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});