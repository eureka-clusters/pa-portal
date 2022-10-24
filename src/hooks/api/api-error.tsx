import React from 'react';
import {ApiError} from 'interface/api/api-error';

export const ApiStates = {
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
}

export const RenderApiError = ({error}: { error: ApiError | undefined }) => {

    if (error === undefined) {
        return <></>;
    }

    return <p className="api-error">
        <strong>Api Error</strong><br/>
        {error.data}<br/>
        Message: {error.message}<br/>
        Code: {error.code}<br/>
    </p>;
}
