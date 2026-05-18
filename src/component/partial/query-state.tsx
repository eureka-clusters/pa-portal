interface QueryStateProps {
    isLoading: boolean;
    isError: boolean;
    loadingMessage?: string;
    errorMessage?: string;
}

export function QueryState({
    isLoading,
    isError,
    loadingMessage = "Loading...",
    errorMessage = "Something went wrong.",
}: QueryStateProps) {
    if (isLoading) {
        return <div>{loadingMessage}</div>;
    }

    if (isError) {
        return <div>{errorMessage}</div>;
    }

    return null;
}
