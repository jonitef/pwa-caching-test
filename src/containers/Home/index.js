import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Painot from './../../../src/painot.jpg';
import Ruoka from './../../../src/ruoka.jpg';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
    searchRoot: {
        flexGrow: 1,
        marginLeft: '8px',
        marginRight: '8px',
        marginTop: '8px',
    },
    search: {
        width: '100%',
        paddingLeft: '8px',
    },
    select: {
        width: '100%',
        paddingLeft: '8px'
    },
    paper: {
        flexGrow: 1,
        marginLeft: '16px',
        marginRight: '16px',
        marginTop: '16px',
    },
    card: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        this.getValmennukset()
    };

    toggleDrawer = () => {
        this.props.callbackFromParent()
    };

    appBar = (classes) => {
        return (
            <AppBar>
                <Toolbar>
                    <IconButton aria-label='btn-label' edge="start" onClick={this.toggleDrawer}>
                        <MenuIcon style={{ color: 'white' }} />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Koti
                </Typography>
                </Toolbar>
            </AppBar>
        );
    };

    card = (classes, value) => {
        return (
            <li key={value.id}>
                <Card className={classes.paper}>
                    <CardActionArea>
                        <CardMedia
                            className={classes.media}
                            image={value.image === 'painot' ? Painot : Ruoka}
                            title={value.title}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {value.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {value.info}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </li>
        );
    };

    getStuff = () => {
        console.log('getStuff')
        
        fetch('https://back-opinnaytetyo.herokuapp.com/api/v1/valmennus', {
          method: 'GET',/*
          body: JSON.stringify({
            title: 'foo',
            body: 'bar',
            userId: 1
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
          */
        })
          .then(response => response.json())
          .then(json => {
            console.log(json)
            this.setState({data: json})
          })
    };

    getValmennukset = async () => {
        var networkDataReceived = false;

        const url = 'https://back-opinnaytetyo.herokuapp.com/api/v1/valmennus'

        // fetch fresh data
        var networkUpdate = fetch(url).then((response) => {
            return response.json();
        }).then((data) => {
            networkDataReceived = true;
            console.log('got new data from network')
            this.setState({data: data})
            caches.has('mysite-dynamic').then((x) => {
                if(!x) {
                    caches.open('mysite-dynamic').then(async (cache) => {
                        cache.put(url, new Response(JSON.stringify(data)))
                    });                
                }
            });
        });

        // fetch cached data
        caches.match(url).then((response) => {
            if (!response) throw Error("No data");
            return response.json();
        }).then((data) => {
            // don't overwrite newer network data
            if (!networkDataReceived) {
                console.log('no new data form network')
                this.setState({data: data})
            }
        }).catch(() => {
            // we didn't get cached data, the network is our last hope:
            return networkUpdate;
        }).catch((e) => console.log(e)).then(() => {
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                {this.appBar(classes)}
                <Toolbar/>
                <List>
                    {
                        this.state.data.map((value) => (
                            this.card(classes, value)
                        ))
                    }
                </List>
            </div>
        );
    }
}

export default withStyles(styles)(Home);


/*

getRequests = async () => {
        var networkDataReceived = false;

        this.setState({ isLoading: true })
        const url = 'https://jonitef-back.herokuapp.com/api/v1/stats'

        // fetch fresh data
        var networkUpdate = fetch(url).then((response) => {
            return response.json();
        }).then((data) => {
            networkDataReceived = true;
            console.log('got new data from network')
            this.setState({ demoData: data, all: [], urgents: [] })
            this.parseAllRequests(this.state.demoData)
            this.parseUrgentRequests(this.state.demoData)
        });

        // fetch cached data
        caches.match(url).then((response) => {
            if (!response) throw Error("No data");
            return response.json();
        }).then((data) => {
            // don't overwrite newer network data
            if (!networkDataReceived) {
                console.log('no new data form network')
                this.setState({ demoData: data, all: [], urgents: [] })
                this.parseAllRequests(this.state.demoData)
                this.parseUrgentRequests(this.state.demoData)
            }
        }).catch(() => {
            // we didn't get cached data, the network is our last hope:
            return networkUpdate;
        }).catch((e) => console.log(e)).then(() => {
            this.setState({ isLoading: false });
        });
    }

*/