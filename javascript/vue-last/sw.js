//const { setFlagsFromString } = require('v8')

// let CACHE_NAME = 'pwa-offline-v1'
// let filesToCache = [
//     '/',
//     '/dist/build.js'
// ]


let CACHE_NAME = 'pwa-offline-v2'
let filesToCache = [
    '/README.md',
    '/',
    '/dist/build.js'
]

// TODO : 서비스 워커 설치 ( App Cashing )
self.addEventListener('install', (event) => {
    console.log(`install event >> ${event}`)
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(filesToCache)
            })
            .catch((error) => {
                console.error(`에러발생 : ${error}`)
            })
    )
})

self.addEventListener('fetch', (event) => {
    console.log(`fetch event >> ${event}`)
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request)
            })
            .catch((error) => {
                return console.log(error)
            })
    )
})

self.addEventListener('activate', (event) => {
    const newCacheList = ['pwa-offline-v2']
    console.log(`activate event >> ${event}`)
    event.waitUntil(
        caches.keys()
        .then((cacheList) => {
            return Promise.all(
                cacheList.map((cacheEl)=>{
                    if( (newCacheList.indexOf(cacheEl) === -1) ) {
                        return caches.delete(cacheEl)
                    }
                })
            )
        })
        .catch((error) => {
            console.error(error) 
        })
    )
})