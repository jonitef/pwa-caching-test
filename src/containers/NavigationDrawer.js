import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import ChatIcon from '@material-ui/icons/Chat';

import Home from './Home';
import Profile from './Profile';
import Chat from './Chat';

const styles = theme => ({
  list: {
    width: 250,
  },
});

function NavigationDrawer(props) {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedScreen, setSelectedScreen] = useState(parseInt(localStorage.getItem('homeScreen')))

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  };

  const listItemIcon = (index) => {
    switch (index) {
      case 0:
        return <HomeIcon />;
      case 1:
        return <PersonIcon />;
      case 2:
        return <ChatIcon />;
      default:
        return null;
    }
  };

  const screen = () => {
    switch (selectedScreen) {
      case 0:
        localStorage.setItem('homeScreen', '0')
        return <Home callbackFromParent={toggleDrawer} />;
      case 1:
        localStorage.setItem('homeScreen', '1')
        return <Profile callbackFromParent={toggleDrawer} />;
      case 2:
        localStorage.setItem('homeScreen', '2')
        return <Chat callbackFromParent={toggleDrawer} isDrawerOpen={isDrawerOpen} />;
      default:
        localStorage.setItem('homeScreen', '0')
        return <Home callbackFromParent={toggleDrawer} />;
    }
  };

  const sideList = (classes) => {
    return (
      <div
        className={classes.list}
        role="presentation"
        onClick={toggleDrawer}
      >
        <List>
          {['Koti', 'Profiili', 'Keskustelu'].map((text, index) => (
            <ListItem button key={text} onClick={() => {
                setSelectedScreen(index)
            }}>
              <ListItemIcon>{listItemIcon(index)}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    );
  };

  return (
    <div>
      {screen()}
      <SwipeableDrawer
        open={isDrawerOpen}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
      >
        {sideList(props.classes)}
      </SwipeableDrawer>
    </div>
  );
}

export default withStyles(styles)(NavigationDrawer);