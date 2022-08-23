import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import "./CollaborativeSpace.scss";
import SearchIcon from "@mui/icons-material/Search";
import Tabs from './Tabs';

function CollaborativeSpace() {
  return (
    <div id="collaborative">
        <div id='menuCollaborative'> 
            <div id="searchCollaborative">
                <TextField
                                    label="Rechercher sujet dans l'espace collaboratif"
                                    variant="filled"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
            </div>
            <div id='menuTabs'>
                <Tabs />
            </div>
        </div>
    </div>
  );
}

export default CollaborativeSpace;
