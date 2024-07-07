import { PropertyKeySchema, SchemaType } from '../typings/schema';
import { VustAny } from './schema/VustAny';
import { VustBigInt } from './schema/VustBigInt';
import { VustBoolean } from './schema/VustBoolean';
import { VustDate } from './schema/VustDate';
import { VustLiteral } from './schema/VustLiteral';
import { VustNumber } from './schema/VustNumber';
import { VustObject } from './schema/VustObject';
import { VustRecord } from './schema/VustRecord';
import { VustString } from './schema/VustString';
import { VustDocID } from './schema/VustDocID';
import { AnySchemaKey as AnySchemaKeyType } from '../typings/schema';
import { VustUnion } from './schema/VustUnion';
import { ArraySchemaKey } from './schema/VustArray';
import { VustTuple } from './schema/VustTuple';
import { VustBuffer } from './schema/VustBuffer';

/**
 * Main class to create new vust types
 */
export class s {
    /**
     * Creates a new string schema key
     */
    public static string() {
        return new VustString({ type: SchemaType.String });
    }

    /**
     * Creates a new unique ID schema key
     */
    public static id() {
        return new VustDocID({ type: SchemaType.UUID });
    }

    /**
     * Creates a new number schema key
     */
    public static number() {
        return new VustNumber({ type: SchemaType.Number });
    }

    /**
     * Creates a new bigint schema key
     */
    public static bigint() {
        return new VustBigInt({ type: SchemaType.BigInt });
    }

    /**
     * Creates a new boolean schema key
     */
    public static boolean() {
        return new VustBoolean({ type: SchemaType.Boolean });
    }

    /**
     * Creates a new object schema key
     */
    public static object<S extends Record<string, AnySchemaKeyType>>(shape: S) {
        return new VustObject(shape, { type: SchemaType.Object });
    }

    /**
     * Creates a new "any" schema key
     */
    public static any() {
        return new VustAny({ type: SchemaType.Any });
    }

    /**
     * Creates a new date schema key
     */
    public static date() {
        return new VustDate({ type: SchemaType.Date });
    }

    /**
     * Creates a new literal schema key
     */
    public static literal<V>(value: V) {
        return new VustLiteral(value, { type: SchemaType.Literal });
    }

    /**
     * Creates a new record schema key
     */
    public static record<
        K extends PropertyKeySchema,
        V extends AnySchemaKeyType,
    >(key: K, value: V) {
        return new VustRecord(key, value, { type: SchemaType.Record });
    }

    /**
     * Creates a union type of schema key types
     * @param unions The unions
     */
    public static union<Unions extends AnySchemaKeyType[]>(...unions: Unions) {
        return new VustUnion(unions, { type: SchemaType.Union });
    }

    /**
     * Creates an array schema key
     * @param items The items of the array
     */
    public static array<Items extends AnySchemaKeyType[]>(...items: Items) {
        return new ArraySchemaKey(items, { type: SchemaType.Array });
    }

    /**
     * Creates a tuple schema key
     * @param items The items of the tuple
     */
    public static tuple<Items extends AnySchemaKeyType[]>(...items: Items) {
        return new VustTuple(items, { type: SchemaType.Tuple });
    }

    /**
     * Creates a new buffer schema key
     */
    public static buffer() {
        return new VustBuffer({ type: SchemaType.Buffer });
    }

    /**
     * All types used in schema keys
     */
    public static get types() {
        return SchemaType;
    }
}
