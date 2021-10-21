export const ApiError = ({error}) => {
    return <p className="api-error"><u>ERROR:</u><br />{error || 'General error'}</p>;
}
