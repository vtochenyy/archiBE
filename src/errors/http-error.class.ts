export class HttpError extends Error {
    statusCode: number;
    message: string;
    context?: string;
    errorcode?: number;

    constructor(statusCode: number, message: string, context?: string, errorcode?: number) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.context = context;
        this.errorcode = errorcode;
    }
}
