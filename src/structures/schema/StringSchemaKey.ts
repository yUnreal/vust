import { EffectError, SchemaType } from '../../typings/schema';
import { LengthBasedKey } from './LengthBasedKey';

export class StringSchemaKey extends LengthBasedKey<SchemaType.String> {
    /**
     * Add a pattern/regexp effect to the string schema key
     * @param regex The pattern to match
     * @param param1 Optional error options message
     */
    public pattern(
        regex: RegExp,
        { message }: EffectError = {
            message: `String must match pattern "${regex.source}"`,
        }
    ) {
        return this.effect((string) => regex.test(string), message);
    }
}
