import { EffectError, SchemaType } from '../../typings/schema';
import { NumericSchemaKey } from './NumericSchemaKey';

export class NumberSchemaKey extends NumericSchemaKey<SchemaType.Number> {
    /**
     * Add the integer effect
     * @param param0 Optional error options message
     */
    public integer(
        { message }: EffectError = { message: 'Value must be an integer' }
    ) {
        return this.effect(Number.isSafeInteger, message);
    }

    /**
     * Add the float effect
     * @param param0 Optional error options message
     */
    public float(
        { message }: EffectError = { message: 'Number must be a float' }
    ) {
        return this.effect((number) => !Number.isInteger(number), message);
    }
}
