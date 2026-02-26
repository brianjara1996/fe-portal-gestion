
import { Navigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { useEffect } from "react";

const LogOut = () => {
    const { instance } = useMsal();

    
    useEffect(() => {
        instance.logoutRedirect();        
    }, [,]);

    return (
        <></>
    );
}

export default LogOut;
