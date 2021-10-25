export function JSON_stringify(s, emit_unicode) {
    var json = JSON.stringify(s);
    return emit_unicode ? json : json.replace(/[\u007f-\uffff]/g,
        function (c) {
            return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
        }
    );
}


export const getFilter = (filter) => {
    return btoa(JSON_stringify(filter, false));
    // return btoa(jsonEscapeUTF(JSON.stringify(filter)));
}