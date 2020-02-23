import React, { useState } from 'react';
import { Typography, AppBar, CssBaseline, Drawer, Hidden, IconButton, Toolbar, useTheme, withStyles, List, ListItem, ListItemText, Button, createMuiTheme, MuiThemeProvider, Switch } from '@material-ui/core';
import { MenuOutlined as MenuOutlinedIcon } from '@material-ui/icons';
import useStyles from './useStyles';
import { Link } from "react-router-dom";

//Handle order delete
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

    const [theme, setTheme] = useState({
        palette: {
          type: "light"
        }
    });

    // we change the palette type of the theme in state
    const toggleDarkTheme = () => {
    let newPaletteType = theme.palette.type === "light" ? "dark" : "light";
    setTheme({
        palette: {
        type: newPaletteType
        }
    });
    };

    // we generate a MUI-theme from state's theme object
    const muiTheme = createMuiTheme(theme);


    /** Logout Button */
    let logout = null;
    if (!(loc === "/login" || loc === "/register")) {
        logout = (
            <Button variant="outlined" size="small" className={classes.logoutButton} onClick={handleLogout}>
                Logout
            </Button>
        )
    }

    return (
        <MuiThemeProvider theme={muiTheme}>
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
                    <Typography variant="h5" className={classes.title}><Link style={{ textDecoration: "none", color: "inherit" }} to="/">Tweety</Link></Typography>
                    <Hidden smDown implementation="css">
                        <Toolbar>
                            <Typography variant="subtitle1" className={classes.subtitle}><Link style={{ textDecoration: "none", color: "inherit" }} to="/feed">Feed</Link></Typography>
                            <Typography variant="subtitle1" className={classes.subtitle}><Link style={{ textDecoration: "none", color: "inherit" }} to="/personal">Personal</Link></Typography> 
                            <Typography variant="subtitle1" className={classes.subtitle}><Link style={{ textDecoration: "none", color: "inherit" }} to="/hashtags">Tags</Link></Typography> 
                            <Typography variant="subtitle1" className={classes.subtitle}><Link style={{ textDecoration: "none", color: "inherit" }} to="/profile">Profile</Link></Typography>    
                            {logout}     
                            <Switch
                                onChange={toggleDarkTheme}
                            />                   
                        </Toolbar>
                        
                    </Hidden>
                </Toolbar>
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
                            {/**<ListItemIcon style={{ color: "#fff" }}></ListItemIcon>*/}
                            <ListItemText primary={"Feed"} />
                        </ListItem>
                    </List>
                    <List>
                        <ListItem button key={2} component={Link} style={{ color: "inherit" }} to={"/personal"} >
                            {/**<ListItemIcon style={{ color: "#fff" }}></ListItemIcon>*/}
                            <ListItemText primary={"Personal"} />
                        </ListItem>
                    </List>
                    <List>
                        <ListItem button key={3} component={Link} style={{ color: "inherit" }} to={"/hashtags"} >
                            {/**<ListItemIcon style={{ color: "#fff" }}></ListItemIcon>*/}
                            <ListItemText primary={"Tags"} />
                        </ListItem>
                    </List>
                    <List>
                        <ListItem button key={4} component={Link} style={{ color: "inherit" }} to={"/profile"} >
                            {/**<ListItemIcon style={{ color: "#fff" }}></ListItemIcon>*/}
                            <ListItemText primary={"Profil"} />
                        </ListItem>
                    </List>
                    <List>
                        <ListItem key={2}>
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
