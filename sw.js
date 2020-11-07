importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox)
    console.log(`workbox berhasil dimuat`);
else
    console.log(`workbox gagal dimuat`);

workbox.precaching.precacheAndRoute(
    [
        { url: '/index.html', revision: '1' },
        { url: '/nav.html', revision: '1' },
        { url: '/detail.html', revision: '1' },
        { url: '/sw.js', revision: '1' },
        { url: '/push.js', revision: '1' },
        { url: '/manifest.json', revision: '1' },
        { url: '/css/materialize.min.css', revision: '1' },
        { url: '/css/style.css', revision: '1' },
        { url: '/js/api.js', revision: '1' },
        { url: '/js/db.js', revision: '1' },
        { url: '/js/idb.js', revision: '1' },
        { url: '/js/materialize.min.js', revision: '1' },
        { url: '/js/nav.js', revision: '1' },
        { url: '/js/sw_detail.js', revision: '1' },
        { url: '/js/sw_index.js', revision: '1' },
        { url: '/pages/about.html', revision: '1' },
        { url: '/pages/favorite.html', revision: '1' },
        { url: '/pages/home.html', revision: '1' },
        { url: '/icons/arrow_back.svg', revision: '1' },
        { url: '/icons/delete.svg', revision: '1' },
        { url: '/icons/github-brands.svg', revision: '1' },
        { url: '/icons/instagram-brands.svg', revision: '1' },
        { url: '/icons/linkedin-in-brands.svg', revision: '1' },
        { url: '/icons/logo.svg', revision: '1' },
        { url: '/icons/menu.svg', revision: '1' },
        { url: '/icons/save.svg', revision: '1' },
        { url: '/icons/icon-64x64.png', revision: '1' },
        { url: '/icons/icon-128x128.png', revision: '1' },
        { url: '/icons/icon-192x192.png', revision: '1' },
        { url: '/icons/icon-512x512.png', revision: '1' },
        { url: '/img/about.jpg', revision: '1' },
        { url: '/pages/about.html', revision: '1' },
        { url: '/pages/favorite.html', revision: '1' },
        { url: '/pages/home.html', revision: '1' },
    ], {
    ignoreUrlParametersMatching: [/.*/]
});

workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'football-data-api',
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 30 * 24 * 60 * 60, //30 hari
                maxEnteries: 30,
            }),
        ]
    })
)

workbox.routing.registerRoute(
    new RegExp('/pages/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'pages'
    })
);

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
            }),
        ],
    })
);

self.addEventListener("push", function (event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = "Push message no payload";
    }
    var options = {
        body: body,
        icon: "icons/icon-64x64.png",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
        },
    };
    event.waitUntil(
        self.registration.showNotification("Push Notification", options)
    );
});

