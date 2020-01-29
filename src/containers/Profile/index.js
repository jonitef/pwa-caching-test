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

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                id: null,
                name: ''
            }
        }
    }

    componentDidMount() {
        this.getProfile()
    };

    toggleDrawer = () => {
        this.props.callbackFromParent()
    };

    getProfile = () => {
        fetch('https://back-opinnaytetyo.herokuapp.com/api/v1/profile/1')
            .then(response => response.json())
            .then(json => {
                console.log(json)
                this.setState({ user: json })
            })
    };

    updateProfile = async () => {
        let body = {
            id: 1,
            name: 'Keijo'
        }

        let headers = {
            "Content-type": "application/json; charset=UTF-8"
        }

        fetch('https://back-opinnaytetyo.herokuapp.com/api/v1/profile/1', {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: headers
        })
            .then(response => response.json())
            .then(json => console.log(json))
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <AppBar position='static'>
                    <Toolbar>
                        <IconButton aria-label='btn-label' edge="start" onClick={this.toggleDrawer}>
                            <MenuIcon style={{ color: 'white' }} />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Profiili
                    </Typography>
                    </Toolbar>
                </AppBar>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Typography>{this.state.user.name}</Typography>
                    <Button onClick={() => this.updateProfile()}>Update</Button>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Profile);
