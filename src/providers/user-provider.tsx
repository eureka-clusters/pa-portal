import {createContext, useContext} from "react";
import {User} from "@/interface/auth/user";
import axios from "axios";
import {getServerUri} from "@/functions/get-server-uri";
import {AxiosContext} from "@/providers/axios-provider";

const UserContext = createContext<UserContextContent>({} as UserContextContent);


interface UserContextContent {
    getUser: () => User,
    loadUser: (token: string) => Promise<User>,
    updateUser: () => Promise<User>
}


const UserProvider = ({children}: { children: any }) => {

    let storage = localStorage;
    const authAxios = useContext(AxiosContext).authAxios;

    const loadUser = (token: string) => {

        return axios.get<User>(getServerUri() + '/api/me', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            storage.setItem('user', JSON.stringify(response.data));

            return response.data;
        });
    }

    const updateUser = () => {
        return authAxios.get<User>('/me').then(response => {
            storage.setItem('user', JSON.stringify(response.data));

            return response.data;
        });
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
            value={{getUser, loadUser, updateUser}}>
            {children}
        </UserContext.Provider>
    );
};

export {UserContext, UserProvider};

