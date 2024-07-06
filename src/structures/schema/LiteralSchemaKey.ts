import { SchemaKeyDefinition, SchemaType } from '../../typings/schema';
import { SchemaKey } from './SchemaKey';

export class LiteralSchemaKey<V> extends SchemaKey<SchemaType.Literal> {
    public constructor(
        /**
         * The literal value to check
         */
        public readonly value: V,
        options: SchemaKeyDefinition<SchemaType.Literal>
    ) {
        super(options);
    }

    public parse(_fullData: unknown, value?: unknown) {
        if (value !== this.value)
            throw new Error(
                `Invalid literal value, expected "${JSON.stringify(value)}"`
            );

        return value;
    }
}
