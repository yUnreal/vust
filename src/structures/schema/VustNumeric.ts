import {
    EffectError,
    MappedSchemaType,
    SchemaType,
} from '../../typings/schema';
import { SchemaKey } from './SchemaKey';

export abstract class VustNumeric<
    Type extends SchemaType.Number | SchemaType.BigInt,
> extends SchemaKey<Type> {
    public min(
        value: MappedSchemaType[Type],
        { message }: EffectError = {
            message: `Value must be greater than "${value}"`,
        }
    ) {
        return this.effect((number) => number >= value, message);
    }

    public max(
        value: MappedSchemaType[Type],
        { message }: EffectError = {
            message: `Value must be less than "${value}"`,
        }
    ) {
        return this.effect((number) => number <= value, message);
    }
}
