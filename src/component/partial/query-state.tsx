import {Alert, Spinner} from "react-bootstrap";

interface QueryStateProps {
    isLoading: boolean;
    isError: boolean;
    loadingMessage?: string;
    errorMessage?: string;
}

export function QueryState(
    {
        isLoading,
        isError,
        loadingMessage = "Loading...",
        errorMessage = "Something went wrong.",
    }: QueryStateProps) {
    if (isLoading) {
        return (
            <div
                className="d-flex align-items-center gap-3 rounded border bg-body-tertiary px-4 py-3 my-3"
                role="status"
                aria-live="polite"
            >
                <Spinner animation="border" variant="primary" />
                <div>
                    <div className="fw-semibold text-body-emphasis">{loadingMessage}</div>
                    <div className="small text-body-secondary">Please wait a moment.</div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <Alert variant="danger" className="my-3">
                {errorMessage}
            </Alert>
        );
    }

    return null;
}
