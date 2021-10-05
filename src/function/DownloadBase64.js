// Parameters:
// mimetype: The mime type string of the file.
//      application/pdf or application/msword or image/jpeg or image/png etc.
// base64Data: file base64 data
// fileName: filename for the download prompt. 
export default async function downloadBase64File(mimetype, base64Data, fileName) {
    const linkSource = `data:${mimetype};base64,${base64Data}`;
    const downloadLink = document.createElement("a"); //Create <a>
    // document.body.appendChild(downloadLink);  // append the link to body
    downloadLink.href = linkSource;     // add the base64 download string to href
    downloadLink.download = fileName;   //File name Here
    downloadLink.click();  //initiate file download
    // document.body.removeChild(downloadLink); // remove the link from document.body
}