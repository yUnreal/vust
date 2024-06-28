import {
    AnySchemaKey,
    SchemaKeyDefinition,
    SchemaType,
} from '../../typings/schema';
import { AnyObject } from '../../typings/utils';
import { SchemaKey } from './SchemaKey';

export class TupleSchemaKey<
    Items extends AnySchemaKey[],
> extends SchemaKey<SchemaType.Tuple> {
    public constructor(
        public items: Items,
        options: SchemaKeyDefinition<SchemaType.Tuple>
    ) {
        super(options);
    }

    public parse(fullData: AnyObject, value?: [unknown, ...unknown[]]) {
        super.parse(fullData, value);

        for (const itemIndex in this.items) {
            const item = this.items[itemIndex];

            try {
                item.parse(fullData, value![itemIndex]);
            } catch (error) {
                error.message = `Tuple failed in item index "${itemIndex}": ${error.message}`;

                throw error as Error;
            }
        }

        return value;
    }
}
