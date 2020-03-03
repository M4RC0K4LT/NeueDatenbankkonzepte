import { green } from '@material-ui/core/colors';

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
        color: "white",
        borderColor: "white",
    },
    onlineFriends: {
        textAlign: "center",
        backgroundColor: theme.palette.action.disabledBackground,
        borderRadius: "15px",
        padding: "15px",
        maxHeight: "400px",
        overflow: "auto",
    },

    recentTags: {
        textAlign: "center",
        backgroundColor: theme.palette.action.disabledBackground,
        borderRadius: "15px",
        padding: "15px",
        margin: "0",
        marginTop: "30px",
        maxWidth: "60%",
    },

    privateMessage: {
        borderRadius: "16px",
        color: "white",
        overflowWrap: "break-word",
        backgroundColor: theme.palette.primary.main,
        display: "inline-flex",
        alignItems: "center",
        flexWrap: "wrap",
        maxWidth: "70%"
    },
    privateMessageText: {
        paddingLeft: "12px",
        paddingRight: "12px",
        paddingTop: "5px",
        paddingBottom: "5px",
        wordBreak: "break-all",
        display: "flex",
        minWidth: "70%",
        flex: 1

    },

    ProfileAvatar: {
        width: theme.spacing(20),
        height: theme.spacing(20),
        margin: "auto",
        marginBottom: theme.spacing(4),
        backgroundColor: theme.palette.action.disabledBackground,
    },

    backdrop: {
        zIndex: theme.zIndex.drawer + 3,
        color: '#fff',
    },

    error: {
        backgroundColor: theme.palette.error.dark,
        justifyContent: "center"
    },
    success: {
        backgroundColor: green[500],
        justifyContent: "center"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    cssLabel: {
        color: "white"
      },
    
    cssOutlinedInput: {
        '&$cssFocused $notchedOutline': {
            borderColor: `${theme.palette.primary.main}`,
        },
        "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
            borderColor: "white"
        },
        color: "white"
    },

    cssFocused: { },

    notchedOutline: {
        borderWidth: '1px',
        borderColor: 'white',
        color: "white"
    },
});

/**
 * Store CSS styling elements.
 * @return {theme} CSS styles.
 */
export default useStyles;