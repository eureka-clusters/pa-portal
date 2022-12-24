import { createContext } from "react";
import { User } from "interface/auth/user";
import axios from "axios";
import { getServerUri } from "../functions/get-server-uri";

const UserContext = createContext<UserContextContent>({} as UserContextContent);

interface UserContextContent {
    getUser: () => User,
    loadUser: (token: string) => void
}


const UserProvider = ({ children }: { children: any }) => {

    let storage = localStorage;

    const loadUser = async (token: string) => {
        const response = await axios.get<User>(getServerUri() + '/api/me', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        storage.setItem('user', JSON.stringify(response.data));
    }

    const getUser = (): User => {

        const user = storage.getItem('user');

        if (user) {
            return JSON.parse(user);
        }

        return {} as User;
    }

    return (
        <UserContext.Provider
            value={{ getUser, loadUser }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };

