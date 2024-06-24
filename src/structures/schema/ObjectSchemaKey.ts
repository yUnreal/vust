import {
    AnySchemaKey,
    SchemaKeyDefinition,
    SchemaType,
} from '../../typings/schema';
import { AnyObject } from '../../typings/utils';
import { SchemaKey } from './SchemaKey';

export class ObjectSchemaKey<
    Shape extends Record<string, AnySchemaKey>,
> extends SchemaKey<SchemaType.Object> {
    public constructor(
        public shape: Shape,
        options: SchemaKeyDefinition<SchemaType.Object>
    ) {
        super(options);
    }

    public parse(fullData: AnyObject, value?: AnyObject | undefined) {
        super.parse(fullData, value);

        for (const [key, crrValue] of Object.entries(<AnyObject>value)) {
            const schema = this.shape[key];

            if (!schema) throw new Error(`Unknown key "${key}" when parsing`);

            schema.parse(fullData, crrValue);
        }

        return value;
    }
}