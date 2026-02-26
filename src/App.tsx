import React, { useState, useEffect, Suspense } from "react";
import ReactDOM from "react-dom";

import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Home from './views/homeView/HomeView';
import LoginInternal from './views/loginView/LoginIntenalView';
import LoginExternal from './views/loginView/LoginExternalView';
import Application from './views/applicationView/ApplicationView';

import { Provider } from '@orbita-ui/core';
import { CSSReset } from './config/CSSReset';


// variantes disponibles:'theme-orbita' | 'theme-orbita-dark' | 'theme-prisma' | 'theme-prisma-dark'
// 'theme-payway' | 'theme-payway-dark' | 'theme-di'

// MSAL imports
import {
  PublicClientApplication,
  EventType,
  EventMessage,
  AuthenticationResult,
} from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

// MSAL imports
import { MsalProvider } from "@azure/msal-react";
import { IPublicClientApplication } from "@azure/msal-browser";
import { CustomNavigationClient } from "./utils/NavigationClient";
import SSO from "./views/ssoView/SsoView";
import LogOut from "./views/logOut/LogOutView";
import AdministrationView from "./views/admView/AdministrationView";

export const msalInstance = new PublicClientApplication(msalConfig);

type AppProps = {
  pca: IPublicClientApplication;
};

const App = ({ pca }: AppProps) => {
  // The next 3 lines are optional. This is how you configure MSAL to take advantage of the router's navigate functions when MSAL redirects between pages in your app
  const navigate = useNavigate();
  const navigationClient = new CustomNavigationClient(navigate);
  pca.setNavigationClient(navigationClient);

  return (
    <MsalProvider instance={pca}>
      <Provider variant="theme-prisma">
        <CSSReset />
        <Routes >
          <Route path="/" element={<Home />} >
            <Route index element={<Home />} />
          </Route>
          <Route path="/home" element={<Home />} >
            <Route index element={<Home />} />
            <Route path="*" element={<Home />} />
          </Route>
          <Route path="/login" element={<LoginExternal />} >
            <Route path="*" element={<LoginExternal />} />
          </Route>
          <Route path="/internal" element={<LoginInternal />} >
            <Route path="*" element={<LoginInternal />} />
          </Route>
          <Route path="/logout" element={<LogOut />} >
            <Route path="*" element={<LogOut />} />
          </Route>
          <Route path="/application" element={<Application />} >
            <Route path="*" element={<Application />} />
          </Route>
          <Route path="/administration" element={<AdministrationView />} >
            <Route path="*" element={<Application />} />
          </Route>
          <Route path="/sso" element={<SSO />} >            
          </Route>          
        </Routes>
      </Provider>
    </MsalProvider>
  );
}



msalInstance.initialize().then(() => { 
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as AuthenticationResult;
      const account = payload.account;
      msalInstance.setActiveAccount(account);
    }
  });

  const rootElement = document.getElementById("root");
  ReactDOM.render(<Router><App pca={msalInstance} /></Router>, rootElement);


});

