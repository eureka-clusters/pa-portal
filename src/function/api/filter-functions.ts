export function JSON_stringify(s: string, emit_unicode: boolean) {
    let json = JSON.stringify(s);
    return emit_unicode ? json : json.replace(/[\u007f-\uffff]/g,
        function (c) {
            return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
        }
    );
}

export const getFilter = (filter: string) => {
    return btoa(JSON_stringify(filter, false));
}
