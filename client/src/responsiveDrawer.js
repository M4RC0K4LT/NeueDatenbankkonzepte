import React from 'react';
import { Link  } from 'react-router-dom'
import { Typography, AppBar, CssBaseline, Drawer, Hidden, IconButton, Toolbar, useTheme, withStyles, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { MenuOutlined as MenuOutlinedIcon, Clear as ClearIcon } from '@material-ui/icons';
import useStyles from './components/other/useStyles';


/** Responsible for suitable page-navigation regarding device width */
function ResponsiveDrawer(props) {

  const { container, classes, content } = props;
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className={classes.root}>  
        <CssBaseline />

        {/** AppBar - Toolbar on page header: Hidden above MaterialUI size "md" */}
        <AppBar position="absolute" className={classes.appBar}>
            <Toolbar>
                <Hidden mdUp implementation="css">
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuOutlinedIcon />
                    </IconButton>
                </Hidden>
                <Typography variant="h6" className={classes.title}><Link style={{ textDecoration: "none", color: "inherit" }} to="/">Tweety</Link></Typography>
                <Hidden smDown implementation="css">
                    <Toolbar>
                        <Typography variant="subtitle2" className={classes.subtitle}><Link style={{ textDecoration: "none", color: "inherit" }} to="/feed">Feed</Link></Typography>
                        <Typography variant="subtitle2" className={classes.subtitle}><Link style={{ textDecoration: "none", color: "inherit" }} to="/profile">Profile</Link></Typography>
                    </Toolbar>
                </Hidden>
            </Toolbar>
        </AppBar>

        {/** Mobile Navigation */}
        <nav className={classes.drawer}>
            <Drawer
                container={container}
                variant="temporary"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={mobileOpen}
                onClick={handleDrawerToggle}
                onClose={handleDrawerToggle}
                classes={{
                    paper: classes.drawerPaper,
                }}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <List>
                    <ListItem button key={1} component={Link} to={"/feed"} >
                        <ListItemIcon style={{ color: "#fff" }}></ListItemIcon>
                        <ListItemText primary={"Feed"} />
                    </ListItem>
                </List>
                <List>
                    <ListItem button key={2} component={Link} to={"/profile"} >
                        <ListItemIcon style={{ color: "#fff" }}></ListItemIcon>
                        <ListItemText primary={"Profil"} />
                    </ListItem>
                </List>
            </Drawer>

        </nav>

        {/** Website content next to drawer (passed as props) */}
        <main className={classes.content}>
            <div className={classes.toolbar} />
            {content}
        </main>
        
    </div>
  );
}

/**
 * Responsive Page-Navigation as well as perfectly placed content.
 * @param {props} props - Properties given from mother element: Page-Content Components (Switch)
 * @return {Component} Including PageNavigation and content.
 */
export default withStyles(useStyles) (ResponsiveDrawer);
