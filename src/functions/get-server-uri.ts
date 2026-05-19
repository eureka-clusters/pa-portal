import Config from '@/constants/config'

export const getServerUri = () => {
    if (import.meta.env.DEV && Config.SERVER_URI.startsWith("http://")) {
        throw new Error("Remote server URI must use HTTPS");
    }

    return Config.SERVER_URI;
};
