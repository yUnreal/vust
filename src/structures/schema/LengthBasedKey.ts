import { EffectError, SchemaType } from '../../typings/schema';
import { SchemaKey } from './SchemaKey';

export abstract class LengthBasedKey<
    Type extends SchemaType.String | SchemaType.Array,
> extends SchemaKey<Type> {
    public min(
        min: number,
        { message }: EffectError = {
            message: `Min ${this.getName()} length is "${min}"`,
        }
    ) {
        return this.effect((value) => value.length >= min, message);
    }

    public max(
        max: number,
        { message }: EffectError = {
            message: `Max ${this.getName()} length is "${max}"`,
        }
    ) {
        return this.effect((value) => value.length <= max, message);
    }

    public length(
        length: number,
        { message }: EffectError = {
            message: `Length of the ${this.getName()} must be "${length}"`,
        }
    ) {
        return this.effect((value) => value.length === length, message);
    }

    private getName() {
        return this.type === SchemaType.String ? 'string' : 'array';
    }
}
