import React, { useMemo, useRef, useState } from "react";
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./SearchBar.scss";

interface SearchBarProps {
  onFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onFilter }) => {

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    justifySelf: "center",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "90%",
    transition: theme.transitions.create("width"),
    "&:focus-within": {
        width: "100%",
    }
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    justifySelf: "center",
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.common.white,
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: theme.palette.common.white,
    justifySelf: "center",
    width: "100%",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    },
  }));

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    // Call the onFilter function to filter results based on the new search term
    onFilter(event);
  };

  return (
    <div id="search-comp">
        <Search>
        <SearchIconWrapper>
            <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
            placeholder="Rechercher..."
            onChange={handleInputChange}
        />
        </Search>
    </div>
    
  );
};

export default SearchBar;
