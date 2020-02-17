const drawerWidth = 240;

/** Store CSS styles */
const useStyles = theme => ({
    root: {
      display: "flex",
    },
    drawer: {
      width: drawerWidth,
      position: "absolute"
    },
    drawerPaper: {
      marginTop: theme.mixins.toolbar,
      width: drawerWidth,
      backgroundColor: "#424242",
      color: "#fff"
    },
    appBar: {
      [theme.breakpoints.up('md')]: {
        width: "100%",
        marginLeft: drawerWidth,
      },
      backgroundColor: "#424242",
    },
    menuButton: {
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
      color: "white"
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: "5px",
    },
    title: {
      margin: "5px",
      textAlign: "left"
    },
    subtitle: {
      margin: "5px",
      marginLeft: "25px",
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    avatar: {
      marginBottom: theme.spacing(2),
      backgroundColor: theme.palette.secondary.main,
    },
    logoutButton: {
      marginLeft: "150px"
    },
    onlineFriends: {
      position: "sticky",
      top: "100px",
      textAlign: "center"
    }
    
});

/**
 * Store CSS styling elements.
 * @return {theme} CSS styles.
 */
export default useStyles;