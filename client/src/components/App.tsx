import React, { createContext, useEffect, useRef } from "react";
import Catalogue from "./catalogue/Catalogue";
import { Routes, Route, useNavigate } from "react-router-dom";
import CaseStudyWconnection from "./caseStudy/CaseStudyWconnection";
import NavBar, { NavBarRef } from "./common/NavBar";
import CollaborativeSpace from "./collaborativeSpace/CollaborativeSpace";
import DashboardPaidCase from "./deputy/dashboard/DashboardPaidCase";
import Approval from "./roles/approval/Approval";
import * as env from "dotenv";
import NewCase from "./deputy/newCase/NewCase";
import ResetPassword from "./connection/ResetPassword";
import axios from "axios";
import { ResponseSnackbar, SnackbarObject } from "../utils/ResponseSnackbar";
import AboutPage from "./landingPage/AboutPage";
import AddCaseStudy from "./catalogue/AddCaseStudy";
import PendingCaseEdit from "./roles/edit/teacher/PendingCaseEdit/PendingCaseEdit";
import PendingCaseStudies from "./pendingCaseStudies/PendingCaseStudies";
import GuidePage from "./guidePage/GuidePage";
import LoginPopup, { LoginPopupRef } from "./connection/LoginPopup";
import ForbiddenPage from "./roles/ForbiddenPage";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider, createTheme } from "@mui/material/styles";

interface AppContextValue {
  openLogInPopup: () => void;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

function App() {
  env.config({ path: `.env.${process.env.NODE_ENV}`})
  const snackBarRef = useRef<SnackbarObject>(null);
  const loginPopupRef = useRef<LoginPopupRef | null>(null);
  let resolveLogIn: ((value: void | PromiseLike<void>) => void) | undefined;
  const navigate = useNavigate();
  const navBarRef = useRef<NavBarRef | null>(null);
  const openLogInPopup = () => {
    if (loginPopupRef.current) {
      loginPopupRef.current.setPopupOpen();
    }
  };

  const contextValue: AppContextValue = {
    openLogInPopup,
  };

  const onLoggedIn = () => {
    // If a promise of a request was attached to this action, resolve it
    if(resolveLogIn) resolveLogIn(); 

    // Refresh NavBar so button shows logged in
    if(navBarRef.current) {
      navBarRef.current.SetIsLoggedIn(true);
    }
  };

  axios.interceptors.response.use(
    (response) => {
      snackBarRef.current!.handleClick(
        false,
        "Votre requête a été traitée avec succès"
      );
      return response;
    },
    async (error) => {
      console.group("Error");
      console.log(error);
      console.groupEnd();
      
      // Prompt user to log in if unauthorized (Session expired)
      if (error.response) {
        if(localStorage.getItem("email") && error.response.status === 401 && error.response.data == "Authentication error") {
          const originalRequest = error.config;
          originalRequest._retry = true;

          openLogInPopup();
          
          let logInPromise = new Promise<void>((resolve, reject) => {
            resolveLogIn = resolve;
          });

          // wait for user to sign in before retrying request
          await logInPromise;
          return axios(originalRequest);
        } else if(error.response.status === 403) {
            navigate('/forbidden')
        } 
      }

      let message = "Une erreur s'est produite, veuillez réessayer";
      if (error.response.data) {
        message = error.response.data;
      } 
      snackBarRef.current!.handleClick(
        true,
        message
      );
      return Promise.reject(error);
    }
  );

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#41aae6', 
        light: '#4aaee7', 
        dark: '#34a4e4', 
        contrastText: '#fff',
      },
      secondary: {
        main: '#ff9100',
        light: '#ffc246', 
        dark: '#c56200', 
        contrastText: '#000',
      },
      error: {
        main: '#f44336', 
      },
      warning: {
        main: '#ff9800', 
      },
      success: {
        main: '#4caf50', 
      },
      info: {
        main: '#2196f3', 
      },
      text: {
        primary: '#333', 
        secondary: '#666', 
        disabled: '#999', 
      },
      background: {
        default: '#F8F6EE', 
        paper: '#FFFFFD', 
      },
    },
    typography: {
        fontFamily: `-apple-system, BlinkMacSystemFont, 'Yaldevi', 'Gotu', sans-serif`,
        h1: {
            fontSize: `calc(1.15rem + 1.15vw)`,
            fontWeight: 'bold',
          },
          h2: {
            fontSize: `calc(0.9rem + 0.9vw)`,
            fontWeight: 'bold',
          },
          h3: {
            fontSize: `calc(0.65rem + 0.65vw)`,
            fontWeight: 'bold',
          },
          h4: {
            fontSize: `calc(0.5rem + 0.5vw)`,
            fontWeight: 'bold',
          },
          h5: {
            fontSize: `calc(0.4rem + 0.4vw)`,
            fontWeight: 'bold',
          },
          h6: {
            fontSize: `calc(0.3rem + 0.3vw)`,
            fontWeight: 'bold',
          },
          subtitle1: {
            fontSize: `calc(0.45rem + 0.45vw)`,
            lineHeight: 1.5,
          },
          body1: {
            fontSize: `calc(0.4rem + 0.4vw)`,
            lineHeight: 1.5,
          },
          body2: {
            fontSize: `calc(0.35rem + 0.35vw)`,
            lineHeight: 1.4,
          },
          caption: {
            fontSize: `calc(0.3rem + 0.3vw)`,
            lineHeight: 1.2,
          },
      },
    });

    window.addEventListener('resize', function () {
      arrangeNavBars();
    });
  
    useEffect(() => {
      arrangeNavBars();
    }, []);

  const arrangeNavBars = () => {
    const mainNavBar = document.querySelector('#nav-bar') as HTMLElement;
    const mainContent = document.querySelector('#content') as HTMLElement;

    if (mainNavBar && mainContent && window.location.pathname !== "/") {
        const navbarHeight = mainNavBar.clientHeight;
        mainContent.style.marginTop = `${navbarHeight}px`;
    }
  }

  return (
    <div>
        <ThemeProvider theme={theme}>
        <GlobalStyles
            styles={{
            body: {
                backgroundColor: theme.palette.background.default,
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                margin: 0,
                padding: 0,
                minHeight: '100vh',
            },
            }}
      />
       <div>
      <AppContext.Provider value={contextValue}>
          <NavBar ref={navBarRef}/>
      <div id="content">
        <ResponseSnackbar ref={snackBarRef} />
        <Routes>
          <Route path="/" element={<AboutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/catalogue" element={<Catalogue />} />
          {/* <Route path="/etude-de-cas" element={<CaseStudyWTconnection />} /> */}
          <Route path="/etude-de-cas" element={<CaseStudyWconnection />} />
          <Route
            path="/espace-de-collaboration"
            element={<CollaborativeSpace />}
          />
          <Route path="/dashboard" element={<DashboardPaidCase />} />
          <Route path="/my-pending-case-studies" element={<PendingCaseStudies />}/>
          <Route path="/my-pending-case-studies/case-edit" element={<PendingCaseEdit />} />
          <Route path="/approval" element={<Approval />} />
          <Route path="/approval/new-case" element={<NewCase />} />
          <Route path="/create" element={<AddCaseStudy />} />

          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />
          <Route
              path="/*"
              element={<div>Error 404</div>}
          />
      </Routes>
      </div>
      <footer style={{height: "50px", width: "100%", backgroundColor: "#06091f", display: "flex", justifyContent: "center", marginTop: "5vh"}}>
        <div style={{display:"inline-block", color: "whitesmoke"}}>&copy; 2023</div>
      </footer>
    
      <LoginPopup onLoggedIn={onLoggedIn} ref={loginPopupRef}/>
  </AppContext.Provider>
  </div>
  </ThemeProvider>
</div>
   
      
  );
}

export default App;
