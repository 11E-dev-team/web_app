import { ValueError, ValidationError } from "@/errors";

export default class Email {
    private value: string;

    private validate(value: string): boolean {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    }

    constructor(value: string | null = null) {
        if (value === null || value === "") {
            throw new ValueError("Email must be non-empty string");
        }
        if (!this.validate(value)) {
            throw new ValidationError("Email is not valid");
        }
        this.value = value;
    }

    toString(): string {
        return this.value;
    }
}
