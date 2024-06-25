import { Schema } from '../structures/Schema';
import { AnyObject } from '../typings/utils';
import { VustError } from './VustError';

export class SchemaError extends VustError {
    public constructor(
        message: string,
        /**
         * The schema that this error belongs to
         */
        public schema: Schema<AnyObject>
    ) {
        super(message);
    }
}
