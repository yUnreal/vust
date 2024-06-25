import { EffectFunction, SchemaType } from '../typings/schema';
import { VustError } from './VustError';

export class EffectError extends VustError {
    public constructor(
        message: string,
        /**
         * The value that threw the error
         */
        public value: unknown,
        /**
         * The effect function used
         */
        public effect: EffectFunction<SchemaType>
    ) {
        super(message);
    }
}
