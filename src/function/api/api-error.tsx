import React, {FC} from 'react';

interface Props {
    error?: string
}

export const ApiError: FC<Props> = ({error}) => {
    return <p className="api-error"><u>ERROR:</u><br/>{error || 'General error'}</p>;
}
