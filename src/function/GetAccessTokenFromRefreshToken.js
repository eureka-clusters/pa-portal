import Config from "../constants/Config";

export default async function GetAccessTokenFromRefreshToken(refreshToken) {

    const serverUri = Config.SERVER_URI;

    const res = await fetch(
        serverUri + '/oauth',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'client_id': Config.CLIENT_ID,
                'client_secret': Config.CLIENT_SECRET,
                'redirect_uri': Config.REDIRECT_URI,
                'grant_type': 'refresh_token',
                'refresh_token': refreshToken
            })
        }
    );

    let result = await res.json();

    return result;    
}
