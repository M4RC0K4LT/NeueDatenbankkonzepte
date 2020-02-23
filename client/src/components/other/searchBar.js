import React from 'react';
import {CircularProgress, TextField, withStyles} from '@material-ui/core/';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useHistory } from "react-router-dom";
import useStyles from './useStyles';

function Asynchronous(props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [selected, setSelected] = React.useState(null)
  const loading = open && options.length === 0;

  let history = useHistory();

  function handleClick(value) {
    if(value.entity === "hashtag"){
        history.push("/hashtags/" + value.value.slice(1));
    }
    else {
        history.push("/profile/" + value.id)
    }
    
  }

  React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            const response = await fetch(window.$apiroute + '/user/search');         
            const countries = await response.json();

            if (active) {
                setOptions(countries);
            }
        })();

        return () => {
        active = false;
        };
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
        setOptions([]);
        }
    }, [open]);

    return (
        <Autocomplete
            className={props.classes.searchBar}
            style={{ width: 300}}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => {
                setOpen(false)
                setSelected(null)
            }}
            getOptionLabel={option => option.value}
            options={options}
            loading={loading}
            autoComplete={true}
            autoHighlight={true}
            autoSelect={true}
            value={selected}
            onChange={(e, value) => {
                handleClick(value)
            }}
            size="small"
            renderInput={params => (
                <TextField
                {...params}
                variant="standard"
                size="small"
                placeholder="Search..."
                style={{ }}
                InputProps={{                 
                    ...params.InputProps,
                    endAdornment: (
                        <React.Fragment>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                        </React.Fragment>
                    ),
                }}
                />
            )}
        />
    );
}

export default withStyles(useStyles) (Asynchronous);