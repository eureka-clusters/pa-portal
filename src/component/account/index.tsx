import {useQuery} from "@tanstack/react-query";

import {QueryState} from "@/component/partial/query-state";
import {useUser} from "@/providers/user-provider";

export default function Account() {
    const {refreshUser, user} = useUser();

    const accountQuery = useQuery({
        queryKey: ["account"],
        queryFn: refreshUser,
        initialData: user ?? undefined,
    });

    if (accountQuery.isLoading || accountQuery.isError) {
        return (
            <QueryState
                isLoading={accountQuery.isLoading}
                isError={accountQuery.isError}
                errorMessage="Your account details could not be loaded."
            />
        );
    }

    const userInfo = accountQuery.data;

    if (!userInfo) {
        return <div>No account data is available.</div>;
    }

    return (
        <>
            <h1>Account</h1>

            <dl className="row">
                <dt className="col-sm-3 text-end">Email:</dt>
                <dd className="col-sm-9">{userInfo.email}</dd>
                {userInfo.firstName && <>
                    <dt className="col-sm-3 text-end">Name:</dt>
                    <dd className="col-sm-9">{userInfo.firstName} {userInfo.lastName}</dd>
                </>}
                <dt className="col-sm-3 text-end">Is Funder:</dt>
                <dd className="col-sm-9">{userInfo.isFunder ? "Yes" : "No"}</dd>
                {userInfo.funderCountry ? (
                    <>
                        <dt className="col-sm-3 text-end">Funder Country:</dt>
                        <dd className="col-sm-9">{userInfo.funderCountry.country}</dd>
                    </>
                ) : null}
                <dt className="col-sm-3 text-end">Is ESE Staff:</dt>
                <dd className="col-sm-9">{userInfo.isEurekaSecretariatStaffMember ? "Yes" : "No"}</dd>
            </dl>
        </>
    );
}
