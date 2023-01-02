import React, {useEffect, useRef, useState} from "react";
import {Button} from "react-bootstrap";

export default function LoadingButton({
                                          isLoading,
                                          loadingText = 'Loading...',
                                          onClick,
                                          children,
                                      }: {
    isLoading: boolean,
    loadingText?: string,
    onClick: () => any,
    children: React.ReactNode
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

    const ref = useRef(null);

    return (
        <Button
            onClick={onClick}
            className="btn btn-primary"
            ref={ref}
            disabled={showLoader}
        >

            {showLoader ? (
                <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    &nbsp; {loadingText}
                </>
            ) : (
                <>
                    {children}
                </>
            )}

        </Button>
    );
}
