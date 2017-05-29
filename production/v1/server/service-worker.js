/* NEED TO FIX ISSUES BEFORE USE:
*   breaks logout
*   handle stale caches persisting after logout
*   handle showing fresh content (easy for React pages, harder for handlebar pages since data is in HTML)
*/

'use strict';

var version = '1.0.0.5',
    CACHE = version + '::PLA',
    offlineURL = '/static/offline.html',
    installFilesEssential = ['/static/vendor/font-awesome.min.css', '/static/main.css', '/static/shared.js', '/static/react_apps.js'].concat(offlineURL),
    installFilesDesirable = ['/static/fonts/fontawesome-webfont.eot', '/static/fonts/fontawesome-webfont.svg', '/static/fonts/fontawesome-webfont.ttf', '/static/fonts/fontawesome-webfont.woff', '/static/fonts/fontawesome-webfont.woff2', '/static/fonts/FontAwesome.otf', '/static/favicon.ico', '/static/images/logo_background.png'];

// install static assets
function installStaticFiles() {
    console.log('installign static');
    return caches.open(CACHE).then(function (cache) {

        // cache desirable files
        cache.addAll(installFilesDesirable);

        // cache essential files
        return cache.addAll(installFilesEssential);
    });
}

// clear old caches
function clearOldCaches() {

    return caches.keys().then(function (keylist) {

        return Promise.all(keylist.filter(function (key) {
            return key !== CACHE;
        }).map(function (key) {
            return caches.delete(key);
        }));
    });
}

// application installation
self.addEventListener('install', function (event) {
    console.log('INSTALLING...');
    // cache core files
    event.waitUntil(installStaticFiles().then(function () {
        return self.skipWaiting();
    }));
});

// application activated
self.addEventListener('activate', function (event) {
    event.waitUntil(clearOldCaches().then(function () {
        return self.skipWaiting();
    }));
});

// is image URL?
var iExt = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'].map(function (f) {
    return '.' + f;
});

function isImage(url) {

    return iExt.reduce(function (ret, ext) {
        return ret || url.endsWith(ext);
    }, false);
}

// return offline asset
function offlineAsset(url) {

    if (isImage(url)) {

        // return image
        return new Response('<svg role="img" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title>offline</title><path d="M0 0h400v300H0z" fill="#eee" /></svg>', {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'no-store'
            }
        });
    } else {

        // return page
        return caches.match(offlineURL);
    }
}

function fromCache(request) {
    var url = request.url;

    return caches.open(CACHE).then(function (cache) {

        return cache.match(request).then(function (response) {

            if (response) {
                // return cached file
                return response;
            }

            // make network request
            return fetch(request).then(function (newreq) {
                if (newreq.ok) return newreq;
            })
            // app is offline
            .catch(function () {
                return offlineAsset(url);
            });
        });
    });
}

// application fetch network data

self.addEventListener('fetch', function (event) {
    console.log('fetch was called', event);

    if (!event.request.url.match('/static')) return;
    event.respondWith(fromCache(event.request));
});