import { ValidationError } from '../../errors/ValidationError';
import { SchemaType } from '../../typings/schema';
import { AnyObject } from '../../typings/utils';
import { SchemaKey } from './SchemaKey';

export class UUIDSchemaKey extends SchemaKey<SchemaType.UUID> {
    public parse(fullData: AnyObject, value?: string | undefined) {
        super.parse(fullData, value);

        const UUID_V4_PATTERN =
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (!UUID_V4_PATTERN.test(<string>value))
            throw new ValidationError('Value is not a valid UUID', value);

        return value;
    }
}
