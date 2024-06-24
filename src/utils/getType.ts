import { SchemaType } from '../typings/schema';

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
        if (value instanceof Date) return SchemaType.Date;

        return [SchemaType.Object, SchemaType.Record];
    }
};
