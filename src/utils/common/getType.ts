/* eslint-disable indent */
import { VustError } from '../../errors/VustError';
import { SchemaType } from '../../typings/schema';
import { inspect } from 'util';

export const getType = (value: unknown) => {
    switch (typeof value) {
        case 'bigint':
            return SchemaType.BigInt;
        case 'number':
            return SchemaType.Number;
        case 'boolean':
            return SchemaType.Boolean;
        case 'string':
            return [SchemaType.String, SchemaType.UUID];
        case 'object':
            if (Array.isArray(value))
                return [SchemaType.Array, SchemaType.Tuple];
            if (value instanceof Date) return SchemaType.Date;

            return [SchemaType.Object, SchemaType.Record];
        default:
            throw new VustError(
                `Could not get type from "${inspect(value, { colors: true })}"`
            );
    }
};
