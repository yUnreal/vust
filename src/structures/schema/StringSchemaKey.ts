import { EffectError, SchemaType } from '../../typings/schema';
import { SchemaKey } from './SchemaKey';

export class StringSchemaKey extends SchemaKey<SchemaType.String> {
    public min(
        value: number,
        { message }: EffectError = {
            message: `Min string length is "${value}"`,
        }
    ) {
        return this.effect((string) => string.length >= value, message);
    }

    public max(
        value: number,
        { message }: EffectError = {
            message: `Max string length is "${value}"`,
        }
    ) {
        return this.effect((string) => string.length <= value, message);
    }

    public length(
        length: number,
        { message }: EffectError = {
            message: `String length is "${length}"`,
        }
    ) {
        return this.effect((string) => string.length === length, message);
    }

    public pattern(
        regex: RegExp,
        { message }: EffectError = {
            message: `String must match pattern "${regex.source}"`,
        }
    ) {
        return this.effect((string) => regex.test(string), message);
    }
}
