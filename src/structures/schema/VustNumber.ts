import { EffectError, SchemaType } from '../../typings/schema';
import { VustNumeric } from './VustNumeric';

export class VustNumber extends VustNumeric<SchemaType.Number> {
    public integer(
        { message }: EffectError = { message: 'Value must be an integer' }
    ) {
        return this.effect(Number.isSafeInteger, message);
    }

    public float(
        { message }: EffectError = { message: 'Number must be a float' }
    ) {
        return this.effect((number) => !Number.isInteger(number), message);
    }
}
