import { ValidationError } from '../../errors/ValidationError';
import {
    AnySchemaKey,
    SchemaKeyDefinition,
    SchemaType,
} from '../../typings/schema';
import { AnyObject } from '../../typings/utils';
import { SchemaKey } from './SchemaKey';

export class VustUnion<
    Unions extends AnySchemaKey[],
> extends SchemaKey<SchemaType.Union> {
    public constructor(
        public unions: Unions,
        options: SchemaKeyDefinition<SchemaType.Union>
    ) {
        super(options);

        if (unions.length < 2)
            throw new Error(
                'Cannot use union schema key with fewer than 2 unions'
            );
    }

    public parse(fullData: AnyObject, value?: unknown) {
        if (!this.unions.some((schema) => schema.isParsable(fullData, value)))
            throw new ValidationError(
                `Value failed in ${this.unions.length} unions schema`,
                value
            );

        return value;
    }
}
