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
      marginLeft: "150px",
      color: "white",
      borderColor: "white"
    },
    onlineFriends: {
      position: "sticky",
      top: "100px",
      textAlign: "center",
      backgroundColor: "#DFDFDF",  
      borderRadius: "15px",

    },

    privateMessage: {
      borderRadius: "16px", 
      color: "white", 
      overflowWrap:"break-word",
      backgroundColor: theme.palette.primary.main,
      display: "inline-flex",
      alignItems: "center",
      maxWidth: "70%",
      flexWrap: "wrap",
      "& div": {
        minWidth: "0",
      }
    },
    privateMessageText: {
      paddingLeft: "12px",
      paddingRight: "12px",
      paddingTop: "5px",
      paddingBottom: "5px",
      display: "flex",
      flex: 1
      
    }
});

/**
 * Store CSS styling elements.
 * @return {theme} CSS styles.
 */
export default useStyles;