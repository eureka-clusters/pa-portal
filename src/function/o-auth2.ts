import Config from "constants/config";
import axios from 'axios';

export interface BearerToken {
    access_token: string
    refresh_token: string,
    expires_in: number,
    status: number,
    detail: string,
    title: string
}

export const OAuth2 = {
    createInstance() {
        const serverUri = Config.SERVER_URI;
        return axios.create({
            baseURL: serverUri,
            timeout: 1000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
    },

    async AuthorizeRequest(authorizationCode: string) {
        console.debug('authorizationCode in custom oauth', authorizationCode);
        let axios = this.createInstance();

        return await axios.post<BearerToken>('/oauth', {
            'client_id': Config.CLIENT_ID,
            'client_secret': Config.CLIENT_SECRET,
            'redirect_uri': Config.REDIRECT_URI,
            'grant_type': 'authorization_code',
            'code': authorizationCode
        })
            .then(response => {
                console.debug('AuthorizeRequest response.data:', response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(error);
                throw new Error(error);
            });
    },

    async RefreshRequest(refreshToken: string) {
        console.debug('Use the refresh token', refreshToken);
        let axios = this.createInstance();
        return await axios.post<BearerToken>('/oauth', {
            'client_id': Config.CLIENT_ID,
            'client_secret': Config.CLIENT_SECRET,
            'redirect_uri': Config.REDIRECT_URI,
            'grant_type': 'refresh_token',
            'refresh_token': refreshToken
        })
            .then(response => {
                console.debug('RefreshRequest response.data', response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(error);
                throw new Error(error);
            });
    }
}
