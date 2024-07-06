import { EffectError, SchemaType } from '../../typings/schema';
import { SchemaKey } from './SchemaKey';

export abstract class LengthBasedKey<
    Type extends SchemaType.String | SchemaType.Array | SchemaType.Buffer,
> extends SchemaKey<Type> {
    /**
     * The min length of the schema key
     * @param min The min length
     * @param param1 Optional error options message
     */
    public min(
        min: number,
        { message }: EffectError = {
            message: `Min ${this.type} length is "${min}"`,
        }
    ) {
        return this.effect((value) => value.length >= min, message);
    }

    /**
     * The max length of the schema key
     * @param max The max length
     * @param param1 Optional error options message
     */
    public max(
        max: number,
        { message }: EffectError = {
            message: `Max ${this.type} length is "${max}"`,
        }
    ) {
        return this.effect((value) => value.length <= max, message);
    }

    /**
     * The exact length of the schema key
     * @param min The length
     * @param param1 Optional error options message
     */
    public length(
        length: number,
        { message }: EffectError = {
            message: `Length of the ${this.type} must be "${length}"`,
        }
    ) {
        return this.effect((value) => value.length === length, message);
    }
}
