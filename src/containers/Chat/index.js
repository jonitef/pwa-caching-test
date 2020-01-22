import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';

const styles = () => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
});

let our_db = null;

class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            online: true,
            btnTXT: 'online'}
    }

    componentDidMount() {

        if(!navigator.onLine) {
            this.setState({online: false, btnTXT: 'offline'})
            console.log('offline')
        }
        else {
            console.log('online')
        }

        window.addEventListener('offline', () => {
            console.log('in Offline!');
            this.setState({online: false, btnTXT: 'offline'})
        });

        window.addEventListener('online', () => {
            console.log('in Online!');
            this.setState({online: true, btnTXT: 'online'})
            if (navigator.serviceWorker && !window.SyncManager) {
                console.log('service worker no bgsync')
                this.sendPostToServer()
            }
        });

        this.openDatabase()
    };

    toggleDrawer = () => {
        this.props.callbackFromParent()
    };

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
        }
    }

    getObjectStore = (storeName, mode) => {
        return our_db.transaction(storeName, mode).objectStore(storeName)
    }

    sendPostToServer = () => {
        console.log('send post to server')
        let savedRequests = []
        let req = this.getObjectStore('post_requests').openCursor()
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
                            this.getObjectStore('post_requests',
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
    
    submit = async (id) => {

        let body = {
            id: id,
            wins: 20,
            losses: 31,
            points_scored: 10
        }

        let headers = {
            "Content-type": "application/json; charset=UTF-8"
        }

        let msg = {
            'body': body,
            'headers': headers
        }

        navigator.serviceWorker.controller.postMessage(msg)

        navigator.serviceWorker.ready.then((registration) => {
            console.log('Service Worker Ready')
            return registration.sync.register('sync-tag')
        }).then(() => {
            console.log('sync event registered')
            console.log('submit')
            fetch('https://back-opinnaytetyo.herokuapp.com/api/v1/stats', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: headers
            })
                .then(response => response.json())
                .then(json => console.log(json))
        }).catch((e) => {
            console.log('sync registration failed')
            console.log(e)
            this.ifSyncFailsToRegister(body, headers, msg)
        });

    };

    ifSyncFailsToRegister = (body, headers, msg) => {
        fetch('https://back-opinnaytetyo.herokuapp.com/api/v1/stats', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: headers
            })
                .then(response => response.json())
                .then(json => console.log(json))
    };

    render() {
        const { classes } = this.props;

        return (
            <div>
                <AppBar position='static'>
                    <Toolbar>
                        <IconButton edge="start" onClick={this.toggleDrawer}>
                            <MenuIcon style={{ color: 'white' }} />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Keskustelu
                    </Typography>
                    </Toolbar>
                </AppBar>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Button onClick={() => { this.submit(1001) }}>1001 {this.state.btnTXT}</Button>
                    <Button onClick={() => { this.submit(1002) }}>1002 {this.state.btnTXT}</Button>
                    <Button onClick={() => { this.submit(1003) }}>1003 {this.state.btnTXT}</Button>
                </div>
            </div>


        );
    }
}

export default withStyles(styles)(Chat);
