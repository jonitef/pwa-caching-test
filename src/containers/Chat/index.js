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
            fetch('https://back-opinnaytetyo.herokuapp.com/api/v1/stats', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: headers
            })
                .then(response => response.json())
                .then(json => console.log(json))
        }).catch(() => {
            console.log('sync registration failed')
        });

        navigator.serviceWorker.controller.postMessage(msg)
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
                            Chat
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
