import { EffectError, SchemaType } from '../../typings/schema';
import { SchemaKey } from './SchemaKey';

export class DateSchemaKey extends SchemaKey<SchemaType.Date> {
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
