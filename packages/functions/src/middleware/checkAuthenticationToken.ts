import { useHeader } from "sst/node/api";
import { Config } from "sst/node/config";

export const checkAuthenticationToken = () => {
    let token: string | undefined;
    try {
        token = Config.API_AUTH_TOKEN;
    } catch (e) {
    }
    
    // Return true if no Secret token is set (for local development)
    if (process.env.IS_LOCAL && !token) {
        return true;
    }

    const header = useHeader("authorization");

    if (header && header === token) {
        return true;
    }

    return false;
}