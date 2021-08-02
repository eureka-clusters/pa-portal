import Config from "../constants/Config";

export default async function GetProjectData(identifier, accessToken) {

    const serverUri = Config.SERVER_URI;

    const res = await fetch(
        serverUri + '/api/view/project/' + identifier,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
        }
    );

    let result = await res.json();

    return result;
}
