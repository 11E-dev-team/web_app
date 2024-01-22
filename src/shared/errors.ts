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

export class IncorrectCanvasObjectError extends Error {
    constructor() {
        super("Incorrect canvas object");
    }
}

export class IncorrectShapeError extends Error {
    constructor(shape: string) {
        super("Incorrect shape " + shape);
    }
}

export class IncorrectToolError extends Error {
    constructor(tool: string) {
        super("Incorrect tool " + tool);
    }
}
