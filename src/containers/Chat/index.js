import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Input from '@material-ui/core/Input';

const styles = () => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
    paper: {
        flexGrow: 1,
        marginTop: '16px',
        backgroundColor: ''
    },
});

let our_db = null;

class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            online: true,
            btnTXT: 'online',
            data: [],
            messageInput: ''
        }
    }

    componentDidMount() {

        if (!navigator.onLine) {
            this.setState({ online: false, btnTXT: 'offline' })
            console.log('offline')
        }
        else {
            console.log('online')
        }

        window.addEventListener('offline', () => {
            console.log('in Offline!');
            this.setState({ online: false, btnTXT: 'offline' })
        });

        window.addEventListener('online', () => {
            console.log('in Online!');
            this.setState({ online: true, btnTXT: 'online' })
            if (navigator.serviceWorker && !window.SyncManager) {
                console.log('service worker no bgsync')
                this.sendPostToServer()
            }
        });

        this.openDatabase()
        this.getStuff()
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

    submit = async () => {

        let body = {
            from: 'user',
            message: this.state.messageInput
        }

        let headers = {
            "Content-type": "application/json; charset=UTF-8"
        }

        let msg = {
            'body': body,
            'headers': headers
        }

        caches.open('mysite-dynamic').then(async (cache) => {
            const cacheThis = [...this.state.data, body]
            console.log(cacheThis)
            cache.put('https://back-opinnaytetyo.herokuapp.com/api/v1/chat', new Response(JSON.stringify(cacheThis)))
            this.setState({data: [...this.state.data, body]})
        });

        navigator.serviceWorker.controller.postMessage(msg)

        navigator.serviceWorker.ready.then((registration) => {
            console.log('Service Worker Ready')
            return registration.sync.register('sync-tag')
        }).then(() => {
            console.log('sync event registered')
            console.log('submit')
            fetch('https://back-opinnaytetyo.herokuapp.com/api/v1/chat', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: headers
            })
                .then(response => response.json())
                .then(json => {
                    console.log(json)
                })
        }).catch((e) => {
            console.log('sync registration failed')
            console.log(e)
            this.ifSyncFailsToRegister(body, headers, msg)
        });
    };

    ifSyncFailsToRegister = (body, headers, msg) => {
        fetch('https://back-opinnaytetyo.herokuapp.com/api/v1/chat', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: headers
        })
            .then(response => response.json())
            .then(json => console.log(json))
    };

    getStuff = () => {
        console.log('getStuff')

        fetch('https://back-opinnaytetyo.herokuapp.com/api/v1/chat', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(json => {
                console.log(json)
                this.setState({ data: json })
            })
    };

    createItem = (classes, value) => {
        return (

            <Paper style={{ marginTop: '16px', alignSelf: value.from === 'ai' ? 'flex-start' : 'flex-end', marginLeft: '16px', marginRight: '16px', maxWidth: '70%' }}>
                <ListItem>
                    <ListItemText primary={value.message} />
                </ListItem>
            </Paper>

        );
    };

    handleInput = (inputString) => {
        this.setState({ messageInput: inputString })
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <AppBar>
                    <Toolbar>
                        <IconButton aria-label='btn-label' edge="start" onClick={this.toggleDrawer}>
                            <MenuIcon style={{ color: 'white' }} />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Keskustelu
                    </Typography>
                    </Toolbar>
                </AppBar>
                <Toolbar />
                <List style={{ display: 'flex', flexDirection: 'column', marginBottom: '32px' }}>
                    {
                        this.state.data.map((value) => (
                            this.createItem(classes, value)
                        ))
                    }
                </List>
                <div>
                <Input style={{ backgroundColor: 'white', display: 'flex', marginLeft: '8px', position: 'fixed', bottom: '0px' }} fullWidth={true} placeholder={'Kirjoita viesti...'} onChange={(e) => {
                    this.handleInput(e.target.value);
                }} >

                </Input>
                <Button aria-label='btn-label' style={{ position: 'fixed', bottom: '0px', right: '0px'}} onClick={() => { this.submit() }}>Lähetä</Button>
                </div>

            </div>


        );
    }
}

export default withStyles(styles)(Chat);
