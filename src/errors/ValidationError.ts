import { VustError } from './VustError';

export class ValidationError extends VustError {
    public constructor(
        message: string,
        /**
         * The value/key that caused the error
         */
        public value: unknown
    ) {
        super(message);
    }
}
