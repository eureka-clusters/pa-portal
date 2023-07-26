import {useContext, useEffect, useState} from "react";
import {UserContext} from "@/providers/user-provider";
import {User} from "@/interface/auth/user";

export default function Account() {

    let userContext = useContext(UserContext);

    const [userInfo, setUserInfo] = useState<User>({} as User);

    useEffect(() => {
        userContext.updateUser().then((user) => {
            setUserInfo(user);
        });

    }, []);
    //const userInfo = userContext.updateUser();

    //Update the user info from the backend
    // useEffect(() => {
    //     userContext.updateUser();
    // });


    return <>
        <h1>Account</h1>

        <dl className="row">
            <dt className="col-sm-3 text-end">Email:</dt>
            <dd className="col-sm-9">{userInfo.email}</dd>
            <dt className="col-sm-3 text-end">Name:</dt>
            <dd className="col-sm-9">{userInfo.firstName} {userInfo.lastName}</dd>
            <dt className="col-sm-3 text-end">Is Funder:</dt>
            <dd className="col-sm-9">{userInfo.isFunder ? 'Yes' : 'No'}</dd>
            {userInfo.funderCountry && <>
                <dt className="col-sm-3 text-end">Funder Country:</dt>
                <dd className="col-sm-9">{userInfo.funderCountry?.country}</dd>
            </>
            }
            <dt className="col-sm-3 text-end">Is ESE Staff:</dt>
            <dd className="col-sm-9">{userInfo.isEurekaSecretariatStaffMember ? 'Yes' : 'No'}</dd>
        </dl>
    </>;
}