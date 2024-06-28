import { EffectError, SchemaType } from '../../typings/schema';
import { LengthBasedKey } from './LengthBasedKey';

export class StringSchemaKey extends LengthBasedKey<SchemaType.String> {
    public pattern(
        regex: RegExp,
        { message }: EffectError = {
            message: `String must match pattern "${regex.source}"`,
        }
    ) {
        return this.effect((string) => regex.test(string), message);
    }
}
