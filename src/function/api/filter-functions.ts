export function JSON_stringify(s: string, emit_unicode: boolean) {
    let json = JSON.stringify(s);
    return emit_unicode ? json : json.replace(/[\u007f-\uffff]/g,
        function (c) {
            return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
        }
    );
}

export const getFilter = (filter: string) => {
    return Buffer.from(JSON_stringify(filter, false)).toString('base64');
    // return btoa(JSON_stringify(filter, false));
}

export const fromFilter = (filter: string) => {
    return Buffer.from(filter, 'base64').toString('ascii');
    // return atob(filter);
}