import {ReactNode, useEffect, useState} from "react";
import {Button, Spinner} from "react-bootstrap";

export default function LoadingButton({
                                          isLoading,
                                          loadingText = 'Loading...',
                                          onClick,
                                          children,
                                       }: {
    isLoading: boolean,
    loadingText?: string,
    onClick: () => void | Promise<void>,
    children: ReactNode
}) {
    /* showLoader is used to stay in the "isLoading state" a bit longer to avoid loading flashes
     if the loading state is too short. */
    const [showLoader, setShowLoader] = useState(false);


    useEffect(() => {
        if (isLoading) {
            setShowLoader(true);
        }

        // Show loader a bits longer to avoid loading flash
        if (!isLoading && showLoader) {
            const timeout = setTimeout(() => {
                setShowLoader(false);
            }, 400);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [isLoading, showLoader]);

    return (
        <Button
            onClick={onClick}
            className="btn btn-primary"
            disabled={showLoader}
        >

            {showLoader ? (
                <span className="d-inline-flex align-items-center gap-2">
                    <Spinner animation="border" size="sm" aria-hidden="true"/>
                    <span>{loadingText}</span>
                </span>
            ) : (
                <>{children}</>
            )}

        </Button>
    );
}
