import {
    EffectError,
    MappedSchemaType,
    SchemaType,
} from '../../typings/schema';
import { SchemaKey } from './SchemaKey';

export abstract class NumericSchemaKey<
    Type extends SchemaType.Number | SchemaType.BigInt,
> extends SchemaKey<Type> {
    /**
     * The min value of the schema key
     * @param value The min value
     * @param param1 Optional error options message
     */
    public min(
        value: MappedSchemaType[Type],
        { message }: EffectError = {
            message: `Value must be greater than "${value}"`,
        }
    ) {
        return this.effect((number) => number >= value, message);
    }

    /**
     * The max value of the schema key
     * @param value The max value
     * @param param1 Optional error options message
     */
    public max(
        value: MappedSchemaType[Type],
        { message }: EffectError = {
            message: `Value must be less than "${value}"`,
        }
    ) {
        return this.effect((number) => number <= value, message);
    }
}
