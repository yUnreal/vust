import { EffectError, SchemaType } from '../../typings/schema';
import { SchemaKey } from './SchemaKey';

export class DateSchemaKey extends SchemaKey<SchemaType.Date> {
    /**
     * The min timestamp of the date schema key
     * @param value The min date check
     * @param param1 Optional error options message
     */
    public min(
        value: Date,
        { message }: EffectError = {
            message: `Date must be older than "${value.toDateString()}"`,
        }
    ) {
        return this.effect(
            (date) => date.getTime() >= value.getTime(),
            message
        );
    }

    /**
     * The max timestamp of the date schema key
     * @param value The max date to check
     * @param param1 Optional error options message
     */
    public max(
        value: Date,
        { message }: EffectError = {
            message: `Date must be newer than "${value.toDateString()}"`,
        }
    ) {
        return this.effect(
            (date) => date.getTime() <= value.getTime(),
            message
        );
    }
}
