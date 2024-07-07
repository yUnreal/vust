import {
    AnySchemaKey,
    PropertyKeySchema,
    SchemaKeyDefinition,
    SchemaType,
} from '../../typings/schema';
import { AnyObject } from '../../typings/utils';
import { SchemaKey } from './SchemaKey';

export class VustRecord<
    Key extends PropertyKeySchema,
    Value extends AnySchemaKey,
> extends SchemaKey<SchemaType.Record> {
    public constructor(
        public key: Key,
        public value: Value,
        options: SchemaKeyDefinition<SchemaType.Record>
    ) {
        super(options);
    }

    public parse(fullData: AnyObject, object?: AnyObject | undefined) {
        super.parse(fullData, object);

        for (const [key, value] of Object.entries(<AnyObject>object)) {
            this.key.parse(fullData, key);
            this.value.parse(fullData, value);
        }

        return object;
    }
}
