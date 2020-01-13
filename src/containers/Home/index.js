import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';

const styles = () => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
});

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
    };

    toggleDrawer = () => {
        this.props.callbackFromParent()
    };

    render() {
        const { classes } = this.props;

        return (

            <AppBar position='static'>
                <Toolbar>
                    <IconButton edge="start" onClick={this.toggleDrawer}>
                        <MenuIcon style={{ color: 'white' }} />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Home
                    </Typography>
                </Toolbar>
            </AppBar>

        );
    }
}

export default withStyles(styles)(Home);
