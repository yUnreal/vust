import { ValidationError } from '../../errors/ValidationError';
import {
    AnySchemaKey,
    SchemaKeyDefinition,
    SchemaType,
} from '../../typings/schema';
import { AnyObject } from '../../typings/utils';
import { LengthBasedKey } from './LengthBasedKey';

export class ArraySchemaKey<
    Items extends AnySchemaKey[],
> extends LengthBasedKey<SchemaType.Array> {
    public constructor(
        /**
         * The items of the array schema key
         */
        public items: Items,
        options: SchemaKeyDefinition<SchemaType.Array>
    ) {
        super(options);
    }

    public parse(fullData: AnyObject, value: unknown[]) {
        super.parse(fullData, value);

        if (
            !value.every((item) =>
                this.items.some(
                    (schema) => schema.isParsable(fullData, item).success
                )
            )
        )
            throw new ValidationError(
                'Value does not match any array schema item',
                value
            );
        if (
            !this.items.some(
                (schema, crrIndex) =>
                    schema.isParsable(fullData, value![crrIndex]).success
            )
        )
            1;

        return value;
    }
}
