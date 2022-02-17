import React, {FC} from 'react';
import { iApiError } from 'hooks/api/interfaces';

interface Props {
    error?: iApiError
}

export const ApiError: FC<Props> = ({ error }) => {
    if (error) {
        return <>
            <p className="api-error">
                <strong>Api Error</strong><br />
                {error.data}<br />
                Message: {error.message}<br />
                Code: {error.code}<br />
            </p>
        </>;
    }
    return null;
}
