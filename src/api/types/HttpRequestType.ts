const HttpRequestTypes = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
} as const;

export type HttpRequestType = keyof typeof HttpRequestTypes;

export default HttpRequestTypes;