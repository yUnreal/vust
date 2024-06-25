import { PropertyKeySchema, SchemaType } from '../typings/schema';
import { AnySchemaKey } from './schema/AnySchemaKey';
import { BigIntSchemaKey } from './schema/BigIntSchemaKey';
import { BooleanSchemaKey } from './schema/BooleanSchemaKey';
import { DateSchemaKey } from './schema/DateSchemaKey';
import { LiteralSchemaKey } from './schema/LiteralSchemaKey';
import { NumberSchemaKey } from './schema/NumberSchemaKey';
import { ObjectSchemaKey } from './schema/ObjectSchemaKey';
import { RecordSchemaKey } from './schema/RecordSchemaKey';
import { StringSchemaKey } from './schema/StringSchemaKey';
import { UUIDSchemaKey } from './schema/UUIDSchemaKey';
import { AnySchemaKey as AnySchemaKeyType } from '../typings/schema';

export class S {
    public static string() {
        return new StringSchemaKey({ type: SchemaType.String });
    }

    public static id() {
        return new UUIDSchemaKey({ type: SchemaType.UUID });
    }

    public static number() {
        return new NumberSchemaKey({ type: SchemaType.Number });
    }

    public static bigint() {
        return new BigIntSchemaKey({ type: SchemaType.BigInt });
    }

    public static boolean() {
        return new BooleanSchemaKey({ type: SchemaType.Boolean });
    }

    public static object<S extends Record<string, AnySchemaKeyType>>(shape: S) {
        return new ObjectSchemaKey(shape, { type: SchemaType.Object });
    }

    public static any() {
        return new AnySchemaKey({ type: SchemaType.Any });
    }

    public static date() {
        return new DateSchemaKey({ type: SchemaType.Date });
    }

    public static literal<V>(value: V) {
        return new LiteralSchemaKey(value, { type: SchemaType.Literal });
    }

    public static record<
        K extends PropertyKeySchema,
        V extends AnySchemaKeyType,
    >(key: K, value: V) {
        return new RecordSchemaKey(key, value, { type: SchemaType.Record });
    }

    public static get types() {
        return SchemaType;
    }
}
