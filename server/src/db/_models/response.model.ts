export interface ResponseModel {
    /* https://developer.mozilla.org/docs/Web/HTTP/Status */
    status: 200 | 201 | 400 | 401 | 403 | 404;
    body: any;
}
