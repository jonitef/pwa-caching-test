import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

const styles = () => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
    paper: {
        textAlign: 'center'
    },
    grid: {
        flexGrow: 1,
    },
    inputCenter: {
        textAlign: 'center',
    },
    grid: {
        flexGrow: 1,
        margin: '32px',
    }
});

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null
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
                this.setState({
                    user: {
                        id: json.id,
                        name: json.name,
                        address: json.address,
                        gender: json.gender
                    }
                })
                this.setState({
                    id: json.id,
                    name: json.name,
                    address: json.address,
                    gender: json.gender
                })
            })
    };

    updateProfile = async (body) => {
        /*
        let body = {
            id: 1,
            name: 'Keijo'
        }
        */
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

        if (this.state.user === null) {
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

                </div>
            )

        }

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

                <div className={classes.grid}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Input fullWidth={true} classes={{
                                    input: classes.inputCenter
                                }} fullWidth={true} defaultValue={this.state.user.name} onChange={(e) => {
                                    this.setState({
                                        name: e.target.value
                                    })
                                }} />
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Input fullWidth={true} classes={{
                                    input: classes.inputCenter
                                }} fullWidth={true} defaultValue={this.state.user.address} onChange={(e) => {
                                    this.setState({
                                        address: e.target.value
                                    })
                                }} />
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Input fullWidth={true} classes={{
                                    input: classes.inputCenter
                                }} fullWidth={true} defaultValue={this.state.user.gender} onChange={(e) => {
                                    this.setState({
                                        gender: e.target.value
                                    })
                                }} />
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Button onClick={() => {
                                    const sendThis = {
                                        id: this.state.id,
                                        name: this.state.name,
                                        address: this.state.address,
                                        gender: this.state.gender
                                    }

                                    console.log(sendThis)
                                    this.updateProfile(sendThis)
                                }}>LÄHETÄ</Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>

            </div>
        );
    }
}

export default withStyles(styles)(Profile);
