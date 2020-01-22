openDatabase = () => {
    let indexedDBOpenRequest = indexedDB.open('test-idb', 1)
    indexedDBOpenRequest.onerror = (error) => {
        console.error('IndexedDB error:', error)
    }
    indexedDBOpenRequest.onupgradeneeded = (e) => {
        e.target.result.createObjectStore('post_requests', {
            autoIncrement: true, keyPath: 'mytestidbid'
        })
    }
    indexedDBOpenRequest.onsuccess = (e) => {
        our_db = e.target.result
        sendPostToServer()
    }
}

let our_db
openDatabase()

let body
let headers
let data

getObjectStore = (storeName, mode) => {
    return our_db.transaction(storeName, mode).objectStore(storeName)
}

savePostRequests = (url, payload) => {
    let request = getObjectStore('post_requests', 'readwrite').add({
        url: url,
        payload: payload,
        method: 'POST'
    })
    request.onsuccess = (event) => {
        console.log('a new post_request has been added to indexedb')
    }
    request.onerror = (error) => {
        console.error(error)
    }
}

getPostResponse = (req) => {
    return fetch(req.clone()).catch((error) => {
        console.log(error)
        console.log(req.clone())
        savePostRequests(req.clone().url, data)
    })
};

sendPostToServer = () => {
    console.log('send post to server')
    let savedRequests = []
    let req = getObjectStore('post_requests').openCursor()
    req.onsuccess = async (event) => {
        let cursor = event.target.result
        if (cursor) {
            savedRequests.push(cursor.value)
            cursor.continue()
        } else {
            for (let savedRequest of savedRequests) {
                console.log('saved request', savedRequest)
                let requestUrl = savedRequest.url
                let payload = JSON.stringify(savedRequest.payload.body)
                let method = savedRequest.method
                let headers = savedRequest.payload.headers

                fetch(requestUrl, {
                    headers: headers,
                    method: method,
                    body: payload
                }).then((response) => {
                    console.log('server response', response.body)
                    if (response.status < 400) {
                        getObjectStore('post_requests',
                            'readwrite').delete(savedRequest.mytestidbid)
                    }
                }).catch((error) => {
                    console.error('Send to Server failed:', error)
                    throw error
                })
            }
        }
    }
}

self.addEventListener('install', event => {
    console.log('install');
});

self.addEventListener('activate', event => {
    console.log('in activate')
    event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
    console.log('data', event.data)
    if (event.data.hasOwnProperty('body') && event.data.hasOwnProperty('headers')) {
        body = event.data.body
        headers = event.data.headers
        data = event.data
    }
});

self.addEventListener('fetch', (event) => {
    if (event.request.method === 'GET') {
        if (event.request.url === 'https://back-opinnaytetyo.herokuapp.com/api/v1/valmennus') {
            event.respondWith(
                fetch(event.request).then((response) => {
                    console.log('request done')
                    caches.open('mysite-dynamic').then(async (cache) => {
                        console.log('cache open')
                        cache.put(event.request, response)
                        console.log('cache open and ready?')
                    });
                    console.log('return thing')
                    return response.clone();
                }).catch(() => {
                    return caches.match(event.request);
                })
            );
        }
        else if (event.request.url === 'https://back-opinnaytetyo.herokuapp.com/api/v1/chat') {
            event.respondWith(
                fetch(event.request).then((response) => {
                    console.log('request done')
                    caches.open('mysite-dynamic').then(async (cache) => {
                        console.log('cache open')
                        cache.put(event.request, response)
                        console.log('cache open and ready?')
                    });
                    console.log('return thing')
                    return response.clone();
                }).catch(() => {
                    return caches.match(event.request);
                })
            );
        }
    }
    if (event.request.method === 'POST') {
        console.log(body)
        console.log(headers)
        event.respondWith(
            getPostResponse(event.request.clone())
        )
    }
});

self.addEventListener('sync', (event) => {
    console.log('in sync online')
    if (event.tag === 'sync-tag') {
        console.log('sync tag sendData')
        event.waitUntil(sendPostToServer())
    }
});

/*

self.addEventListener('fetch', (event) => {
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.open('mysite-dynamic').then(async (cache) => {
                const response = await fetch(event.request);
                cache.put(event.request, response.clone());
                return response;
            })
        );
    }
});

*/