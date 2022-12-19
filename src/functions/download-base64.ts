export default async function downloadBase64File(mimetype: string, base64Data: string, fileName: string) {
    const linkSource = `data:${mimetype};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;     // add the base64 download string to href
    downloadLink.download = fileName;   //File name Here
    downloadLink.click();  //initiate file download
}