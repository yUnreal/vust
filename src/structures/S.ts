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
import { UnionSchemaKey } from './schema/UnionSchemaKey';
import { ArraySchemaKey } from './schema/ArraySchemaKey';

/**
 * Main class to create new schema keys
 */
export class S {
    /**
     * Creates a new string schema key
     */
    public static string() {
        return new StringSchemaKey({ type: SchemaType.String });
    }

    /**
     * Creates a new unique ID schema key
     */
    public static id() {
        return new UUIDSchemaKey({ type: SchemaType.UUID });
    }

    /**
     * Creates a new number schema key
     */
    public static number() {
        return new NumberSchemaKey({ type: SchemaType.Number });
    }

    /**
     * Creates a new bigint schema key
     */
    public static bigint() {
        return new BigIntSchemaKey({ type: SchemaType.BigInt });
    }

    /**
     * Creates a new boolean schema key
     */
    public static boolean() {
        return new BooleanSchemaKey({ type: SchemaType.Boolean });
    }

    /**
     * Creates a new object schema key
     */
    public static object<S extends Record<string, AnySchemaKeyType>>(shape: S) {
        return new ObjectSchemaKey(shape, { type: SchemaType.Object });
    }

    /**
     * Creates a new "any" schema key
     */
    public static any() {
        return new AnySchemaKey({ type: SchemaType.Any });
    }

    /**
     * Creates a new date schema key
     */
    public static date() {
        return new DateSchemaKey({ type: SchemaType.Date });
    }

    /**
     * Creates a new literal schema key
     */
    public static literal<V>(value: V) {
        return new LiteralSchemaKey(value, { type: SchemaType.Literal });
    }

    /**
     * Creates a new record schema key
     */
    public static record<
        K extends PropertyKeySchema,
        V extends AnySchemaKeyType,
    >(key: K, value: V) {
        return new RecordSchemaKey(key, value, { type: SchemaType.Record });
    }

    public static union<Unions extends AnySchemaKeyType[]>(...unions: Unions) {
        return new UnionSchemaKey(unions, { type: SchemaType.Union });
    }

    /**
     * Creates an array schema key
     * @param items The items of the array
     */
    public static array<Items extends AnySchemaKeyType[]>(...items: Items) {
        return new ArraySchemaKey(items, { type: SchemaType.Array });
    }

    /**
     * All types used in schema keys
     */
    public static get types() {
        return SchemaType;
    }
}
