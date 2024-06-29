import { EffectError, SchemaType } from '../../typings/schema';
import { SchemaKey } from './SchemaKey';

export abstract class LengthBasedKey<
    Type extends SchemaType.String | SchemaType.Array | SchemaType.Buffer,
> extends SchemaKey<Type> {
    public min(
        min: number,
        { message }: EffectError = {
            message: `Min ${this.type} length is "${min}"`,
        }
    ) {
        return this.effect((value) => value.length >= min, message);
    }

    public max(
        max: number,
        { message }: EffectError = {
            message: `Max ${this.type} length is "${max}"`,
        }
    ) {
        return this.effect((value) => value.length <= max, message);
    }

    public length(
        length: number,
        { message }: EffectError = {
            message: `Length of the ${this.type} must be "${length}"`,
        }
    ) {
        return this.effect((value) => value.length === length, message);
    }
}
