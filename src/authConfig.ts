import { Configuration, PopupRequest } from "@azure/msal-browser";
import { TENANT_ID, CLIENT_ID } from "./config/DefaultValues"
// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
    auth: {
        clientId: CLIENT_ID,
        authority: "https://login.microsoftonline.com/" + TENANT_ID,
        redirectUri: "/sso",
        postLogoutRedirectUri: "/logout"
    },
    system: {
        allowNativeBroker: false // Disables WAM Broker
    }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: PopupRequest = {
    scopes: ["User.Read"]
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};