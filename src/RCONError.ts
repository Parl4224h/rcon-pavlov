type ErrorName =
    | "NO_RESPONSE"
    | "CONNECTION_REFUSED"
    | "INVALID_PASSWORD"
    | "CONNECTION_RESET"
    | "INVALID_RESPONSE";

export class RCONError extends Error {
    name: ErrorName;
    message: string;
    cause: any;

    constructor({name, message, cause}: { name: ErrorName, message: string, cause?: any }) {
        super();
        this.name = name;
        this.message = message;
        this.cause = cause;
    }
}