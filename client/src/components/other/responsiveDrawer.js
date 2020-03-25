import React, { useState } from 'react';
import { Typography, AppBar, CssBaseline, Drawer, Hidden, IconButton, Toolbar, useTheme, withStyles, List, ListItem, ListItemText, createMuiTheme, MuiThemeProvider, Grid } from '@material-ui/core';
import { MenuOutlined as MenuOutlinedIcon, Brightness2 as Brightness2Icon, Brightness7 as Brightness7Icon, ExitToApp as ExitToAppIcon } from '@material-ui/icons';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useStyles from './useStyles';
import { Link } from "react-router-dom";
import Asynchronous from './searchBar'

//Handle session logout
function handleLogout() {
    sessionStorage.removeItem("authToken")
    window.location.replace("/login")
}

/** Responsible for suitable page-navigation regarding device width */
function ResponsiveDrawer(props) {

    const { container, classes, content, loc } = props;
    const themex = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    /** Sets darkmode preference */
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [dark, setdark] = useState({ prefersDarkMode });
    const theme = 
        createMuiTheme({
            palette: {
                type: dark ? 'dark' : 'light',
            }});


    /** Logout Button and SearchBar */
    let logout = null;
    let searchbar = null;
    if (!(loc === "/login" || loc === "/register")) {
        logout = (
            <IconButton onClick={handleLogout} style={{ color: "white" }}>
                <ExitToAppIcon></ExitToAppIcon>
            </IconButton>
        )
        searchbar = (
            <Asynchronous dark={dark}></Asynchronous>
        )
    }

    let darkmode = <Brightness2Icon></Brightness2Icon>;
    if(dark){
        darkmode = <Brightness7Icon></Brightness7Icon>
    }

    return (
        <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
            <CssBaseline />

            {/** AppBar - Toolbar on page header: Hidden above MaterialUI size "md" */}
            <AppBar position="absolute" className={classes.appBar}>
                    <Hidden mdUp implementation="css">
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={handleDrawerToggle}
                                className={classes.menuButton}
                            >
                                <MenuOutlinedIcon />
                            </IconButton>
                            <Typography variant="h5" className={classes.title}><Link style={{ textDecoration: "none", color: "inherit" }} to="/">Tweety</Link></Typography>
                        </Toolbar>
                    </Hidden>
                    
                    <Hidden smDown implementation="css">
                        <Toolbar>
                                <Grid container item>
                                
                                    <Toolbar style={{ padding: 0, margin: 0 }}>
                                        <Typography variant="h5" className={classes.title}><Link style={{ textDecoration: "none", color: "inherit" }} to="/">Tweety</Link></Typography>
                                        <Typography variant="subtitle1" className={classes.subtitle}><Link style={{ textDecoration: "none", color: "inherit" }} to="/feed">Feed</Link></Typography>
                                        <Typography variant="subtitle1" className={classes.subtitle}><Link style={{ textDecoration: "none", color: "inherit" }} to="/personal">Personal</Link></Typography> 
                                        <Typography variant="subtitle1" className={classes.subtitle}><Link style={{ textDecoration: "none", color: "inherit" }} to="/hashtags">Tags</Link></Typography> 
                                        <Typography variant="subtitle1" className={classes.subtitle}><Link style={{ textDecoration: "none", color: "inherit", marginRight: "30px" }} to="/profile">Profile</Link></Typography>
                                    </Toolbar>
                                </Grid>
                                <Grid container item justify="center">
                                    <Toolbar style={{ padding: 0, margin: 0 }}>
                                        {searchbar}
                                    </Toolbar>
                                </Grid>
                                <Grid container item justify="flex-end">
                                    <Toolbar style={{ padding: 0, margin: 0 }}>
                                        <IconButton onClick={() => dark ? setdark(false) : setdark(true)} style={{ color: "white" }}>
                                            {darkmode}
                                        </IconButton>
                                        <Typography>{logout}</Typography>
                                    </Toolbar>
                                </Grid>    
                        </Toolbar>               
                    </Hidden>
            </AppBar>

            {/** Mobile Navigation */}
            <nav className={classes.drawer}>
                <Drawer
                    container={container}
                    variant="temporary"
                    anchor={themex.direction === 'rtl' ? 'right' : 'left'}
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
                        <ListItem button key={1} component={Link} style={{ color: "inherit" }} to={"/feed"} >
                            <ListItemText primary={"Feed"} />
                        </ListItem>
                    </List>
                    <List>
                        <ListItem button key={2} component={Link} style={{ color: "inherit" }} to={"/personal"} >
                            <ListItemText primary={"Personal"} />
                        </ListItem>
                    </List>
                    <List>
                        <ListItem button key={3} component={Link} style={{ color: "inherit" }} to={"/hashtags"} >
                            <ListItemText primary={"Tags"} />
                        </ListItem>
                    </List>
                    <List>
                        <ListItem button key={4} component={Link} style={{ color: "inherit" }} to={"/profile"} >
                            <ListItemText primary={"Profil"} />
                        </ListItem>
                    </List>
                    <List>
                        <ListItem button key={5} component={Link} style={{ color: "inherit" }} to={"/following"} >
                            <ListItemText primary={"Following"} />
                        </ListItem>
                    </List>
                    <List>
                        <ListItem key={6}>
                            {logout}
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
        </MuiThemeProvider>
    );
}

/**
 * Responsive Page-Navigation as well as perfectly placed content.
 * @param {props} props - Properties given from mother element: Page-Content Components (Switch)
 * @return {Component} Including PageNavigation and content.
 */
export default withStyles(useStyles)(ResponsiveDrawer);
