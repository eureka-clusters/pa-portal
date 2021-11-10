import Config from "constants/Config";
import axios from 'axios';

export const OAuth2 = {
    createInstance() {
        const serverUri = Config.SERVER_URI;
        const instance = axios.create({
            baseURL: serverUri,
            timeout: 1000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
        return instance;
    },

    async AuthorizeRequest(authorizationCode, cb) {
        // console.debug('authorizationCode in custom oauth', authorizationCode);
        let axios = this.createInstance();
        const res = await axios.post('/oauth', {
            'client_id': Config.CLIENT_ID,
            'client_secret': Config.CLIENT_SECRET,
            'redirect_uri': Config.REDIRECT_URI,
            'grant_type': 'authorization_code',
            'code': authorizationCode
        })
            .then(response => {
                // console.debug('AuthorizeRequest response.data:', response.data);
                return response.data;
            })
            .catch((error) => {
                // console.error(error);
                throw new Error(error);
            });
        // console.debug('AuthorizeRequest res:', res);
        return res;
    },

    async RefreshRequest(refreshToken, cb) {
        // console.debug('Use the refresh token', refreshToken);
        let axios = this.createInstance();
        const res = await axios.post('/oauth', {
            'client_id': Config.CLIENT_ID,
            'client_secret': Config.CLIENT_SECRET,
            'redirect_uri': Config.REDIRECT_URI,
            'grant_type': 'refresh_token',
            'refresh_token': refreshToken
        })
            .then(response => {
                return response.data;
            })
            .catch((error) => {
                // console.error(error);
                throw new Error(error);
            });
        // console.debug('RefreshRequest res:', res);
        return res;
    }
}
