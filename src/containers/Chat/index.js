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

class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {

        window.addEventListener('offline', () => {
            console.log('in Offline!');
        });

        window.addEventListener('online', () => {
            console.log('in Online!');
            if (!navigator.serviceWorker && !window.SyncManager) {
                console.log('service worker no bgsync')
            }
        });


    };

    toggleDrawer = () => {
        this.props.callbackFromParent()
    };

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

        navigator.serviceWorker.ready.then((registration) => {
            console.log('Service Worker Ready')
            return registration.sync.register('sync-tag')
        }).then(() => {
            console.log('sync event registered')
            console.log('submit')
            navigator.serviceWorker.controller.postMessage(msg)
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
        if (navigator.onLine) {
            fetch('https://back-opinnaytetyo.herokuapp.com/api/v1/stats', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: headers
            })
                .then(response => response.json())
                .then(json => console.log(json))
        }
        else {
            console.log('You are offline, try again laiter')
        }
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
                    <Button onClick={() => { this.submit(1001) }}>1001</Button>
                    <Button onClick={() => { this.submit(1002) }}>1002</Button>
                    <Button onClick={() => { this.submit(1003) }}>1003</Button>
                </div>
            </div>


        );
    }
}

export default withStyles(styles)(Chat);
