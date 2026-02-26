/**
 * Variables de entorno
 *
 * Las variables de entorno son obtenidas del archivo public/env.js el cual es cargado en el head del root HTML public/index.html
 * Aca se las procesa para obtener un valor por defecto
 */
function getEnvs(): Config {    
    const env = (window as any).env;    
    if (env != undefined) {
        return {
            SECURITY_URL: env.SECURITY_URL,
            CLIENT_ID: env.CLIENT_ID,
            TENANT_ID: env.TENANT_ID
        }
    } else {
        return {
           
            SECURITY_URL: process.env.SECURITY_URL,
            CLIENT_ID: process.env.CLIENT_ID,
            TENANT_ID: process.env.TENANT_ID
        }
    }
}

interface Config {
    SECURITY_URL: string;
    CLIENT_ID: string;
    TENANT_ID: string;
}
const CONSTANTS = getEnvs();

export const config: Config = CONSTANTS;

