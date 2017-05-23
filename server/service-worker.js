/* NEED TO FIX ISSUES BEFORE USE:
*   breaks logout
*   handle stale caches persisting after logout
*   handle showing fresh content (easy for React pages, harder for handlebar pages since data is in HTML)
*/

'use strict';

const
    version = '1.0.0.5',
    CACHE = version + '::PLA',
    offlineURL = '/static/offline.html',
    installFilesEssential = [
        '/static/vendor/font-awesome.min.css',
        '/static/main.css',
        '/static/shared.js',
        '/static/react_apps.js'
    ].concat(offlineURL),
    installFilesDesirable = [
        '/static/fonts/fontawesome-webfont.eot',
        '/static/fonts/fontawesome-webfont.svg',
        '/static/fonts/fontawesome-webfont.ttf',
        '/static/fonts/fontawesome-webfont.woff',
        '/static/fonts/fontawesome-webfont.woff2',
        '/static/fonts/FontAwesome.otf',
        '/static/favicon.ico',
        '/static/images/logo_background.png'
    ];


// install static assets
function installStaticFiles() {
    console.log('installign static');
    return caches.open(CACHE)
        .then(cache => {

            // cache desirable files
            cache.addAll(installFilesDesirable);

            // cache essential files
            return cache.addAll(installFilesEssential);

        });

}

// clear old caches
function clearOldCaches() {

    return caches.keys()
        .then(keylist => {

            return Promise.all(
                keylist
                .filter(key => key !== CACHE)
                .map(key => caches.delete(key))
            );

        });

}

// application installation
self.addEventListener('install', event => {
    console.log('INSTALLING...');
    // cache core files
    event.waitUntil(
        installStaticFiles()
        .then(() => self.skipWaiting())
    );

});


// application activated
self.addEventListener('activate', event => {
    event.waitUntil(
        clearOldCaches()
        .then(() => self.skipWaiting())
    );
});


// is image URL?
let iExt = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'].map(f => '.' + f);

function isImage(url) {

    return iExt.reduce((ret, ext) => ret || url.endsWith(ext), false);

}


// return offline asset
function offlineAsset(url) {

    if (isImage(url)) {

        // return image
        return new Response(
            '<svg role="img" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title>offline</title><path d="M0 0h400v300H0z" fill="#eee" /></svg>', {
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'no-store'
                }
            }
        );

    } else {

        // return page
        return caches.match(offlineURL);

    }
}


function fromCache(request) {
    let url = request.url;

    return caches.open(CACHE)
        .then(cache => {

            return cache.match(request)
                .then(response => {

                    if (response) {
                        // return cached file
                        return response;
                    }

                    // make network request
                    return fetch(request)
                        .then(newreq => {
                            if (newreq.ok) return newreq;
                        })
                        // app is offline
                        .catch(() => offlineAsset(url));

                });

        });
}


// application fetch network data

self.addEventListener('fetch', function(event) {
    console.log('fetch was called', event);

    if(!event.request.url.match('/static')) return;
    event.respondWith(

        fromCache(event.request)

    );

});
