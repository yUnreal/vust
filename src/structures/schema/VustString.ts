import { EffectError, SchemaType } from '../../typings/schema';
import { VustLengthBased } from './VustLengthBased';

export class VustString extends VustLengthBased<SchemaType.String> {
    public pattern(
        regex: RegExp,
        { message }: EffectError = {
            message: `String must match pattern "${regex.source}"`,
        }
    ) {
        return this.effect((string) => regex.test(string), message);
    }
}
