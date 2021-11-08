import React, {useCallback, useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import {Api, ApiError, apiStates, getFilter} from '../../../function/api';
// import downloadBase64File from "../../../function/DownloadBase64";


export const useDownload = (initialState = false) => {
    // Initialize the state
    const [state, setState] = useState(initialState);
    // Define and memorize toggler function in case we pass down the comopnent,
    // This function change the boolean value to it's opposite value
    const toggle = useCallback(() => setState(state => !state), []);
    return [state, toggle]
}

export function DownloadButton(filter) {

    const [startDownload, setStartDownload] = useDownload();

    // const test = () => {
    //     setStartDownload(true)
    //     setStartDownload(false);
    // }

    // test to set back the download button with useEffect, button is only short labled started, api is requested but download isn't done...
    useEffect(() => {
        if (startDownload) {
            console.log('set startDownload = false');
            // setStartDownload(false);
            setTimeout(() => {
                setStartDownload(false);
            }, 300);  // bei 200 geht der download nur manchmal
        }
    }, [startDownload]);

    const DownloadStatus = () => {
        // console.log(['startDownload', startDownload]);
        // if (startDownload === null) {
        //     return 'Loading...';
        // }
        return startDownload ? 'Started' : 'not Startet';
    }

    return (
        <>
            <p>download button with status</p>
            <Button onClick={setStartDownload(true)}>{DownloadStatus()}</Button>

            {/* doesn't work button state isn't changed download never starts */}
            {/* <Button onClick={() => { setStartDownload(true); setStartDownload(false)}}>{DownloadStatus()}</Button> */}
            {/* <Button onClick={() => { test() }}>{DownloadStatus()}</Button> */}

            <pre className='debug'>{JSON.stringify(startDownload, undefined, 2)}</pre>
            {startDownload &&
                <DownloadExcel filter={filter} startDownload={startDownload} setStartDownload={setStartDownload}/>}
        </>
    )
}

const DownloadExcel = ({filter, startDownload, setStartDownload}) => {

    function downloadBase64File(contentType, base64Data, fileName) {
        console.log('downloadBase64File');
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    // doesn't work as the Api (with its useState couldn't be called in a hook)
    // const downloadExcel = () => {
    //     const { state, error, data } = Api(resultUrl);
    //     switch (state) {
    //         case apiStates.ERROR:
    //             return (
    //                 <>
    //                     <ApiError error={error} />
    //                     <br /><br />Filter used <code className={'pb-2 text-muted'}>{getFilter(filter)}</code>
    //                 </>
    //             );
    //         case apiStates.SUCCESS:
    //             return (
    //                 <React.Fragment>
    //                     <pre className='debug'>{JSON.stringify(filter, undefined, 2)}</pre>
    //                     <pre className='debug'>{JSON.stringify(data, undefined, 2)}</pre>
    //                     {/* <pre className='debug'>{JSON.stringify(data._embedded.results, undefined, 2)}</pre> */}
    //                 </React.Fragment>
    //             );
    //         default:
    //             return <p>Loading data...</p>;
    //     }
    // }

    // return (
    //     <Button onClick={downloadExcel}>Download</Button>
    // )


    const [resultUrl, setResultUrl] = useState('/statistics/download/project/' + getFilter(filter));


    const {state, error, data} = Api(resultUrl);

    // useEffect(() => {
    //     setResultUrl('/statistics/download/project/1/' + getFilter(filter));
    // }, [filter]);


    switch (state) {
        case apiStates.ERROR:
            return (
                <>
                    <ApiError error={error}/>
                    <br/><br/>Filter used <code className={'pb-2 text-muted'}>{getFilter(filter)}</code>
                </>
            );
        case apiStates.SUCCESS:
            let extension = data.extension;
            let mimetype = data.mimetype;
            console.log('render download');
            downloadBase64File(mimetype, data.download, 'Download' + extension);
            // setStartDownload(false);

            // this produces an warning but otherwise the 2nd click woudln't initiate the download?
            //Warning: Cannot update a component(`ProjectStatistics`) while rendering a different component(`DownloadExcel`)
            // setStartDownload(false); 
            // setStartDownload(toggled => !toggled);
            // setStartDownload(toggled => false);


            // return; // produces error Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null.
            return <></>;
        default:
            // return <></>;
            return <p>Start download...</p>;
    }
}

// export default DownloadExcel;