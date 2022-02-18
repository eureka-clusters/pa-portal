import React from "react";
import { Button } from "react-bootstrap";

export default function LoadingButton({ isLoading, children, ...props }) {
    /* showLoader is used to stay in the "isLoading state" a bit longer to avoid loading flashes
     if the loading state is too short. */
    const [showLoader, setShowLoader] = React.useState(false);

    React.useEffect(() => {
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

    /* Capture the dimensions of the button before the loading happens
    so it doesn’t change size.
    These hooks can be put in a seprate file. */
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (ref.current && ref.current.getBoundingClientRect().width) {
            setWidth(ref.current.getBoundingClientRect().width);
        }
        if (ref.current && ref.current.getBoundingClientRect().height) {
            setHeight(ref.current.getBoundingClientRect().height);
        }
    }, [children]);

    return (
        <Button
            {...props}
            className="btn btn-primary" 
            ref={ref}
            disabled={showLoader ?true:false}
            style={
                showLoader
                    ? {
                        width: `${width}px`,
                        height: `${height}px`
                    }
                    : {}
            }
        >   
            
            {showLoader ? (
                <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    &nbsp; Loading...
                </>
            ) : (
                <>
                    {children}
                </>
            )}
        </Button>
    );
}
