self.addEventListener('install', event => {
    console.log('install');
});

self.addEventListener('activate', event => {
    console.log('in activate')
    event.waitUntil(self.clients.claim());
});