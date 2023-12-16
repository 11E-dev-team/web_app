export class ValueError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValueError";
    }
}

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}
