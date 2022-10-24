// ./Me2.js
import React from 'react';
import { useMeCompact} from 'hooks/api/user/use-me-compact'


import Button from 'react-bootstrap/Button'

export const Me2 = () => {

    const meQuery = useMeCompact();
    
    return (
        <div>
            {
                meQuery.isLoading ? (
                        <span>Loading...</span>
                ) : meQuery.isError ? (
                    <>
                        {/* <pre className='debug'>{JSON.stringify(meQuery.error, undefined, 2)}</pre> */}
                        {meQuery.error.message}
                    </>
                ) : (
                    <>
                        {/* <pre className='debug'>{JSON.stringify(meQuery.data, undefined, 2)}</pre> */}
                        <ul>
                            <li>{meQuery.data.first_name}</li>
                            <li>{meQuery.data.last_name}</li>
                            <li>{meQuery.data.email}</li>
                        </ul>
                        <Button onClick={() => meQuery.load()}>reload current url load() </Button>
                    </>
                )
            }
        </div>
    );
};

export default Me2