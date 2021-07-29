import Config from "../constants/Config";

export default async function GetProjectData(project, accessToken) {

    const serverUri = Config.SERVER_URI;

    const res = await fetch(
        serverUri + '/oauth',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer' + accessToken
            },
        }
    );

    let result = await res.json();

    return result;    
}
