import { VustBigInt } from '../structures/schema/VustBigInt';
import { VustBoolean } from '../structures/schema/VustBoolean';
import { VustNumber } from '../structures/schema/VustNumber';
import { VustString } from '../structures/schema/VustString';
import { VustDocID } from '../structures/schema/VustDocID';
import { AnyObject, Find, IsLiteral, IsRecord, IsTuple } from './utils';
import { VustAny as ASK } from '../structures/schema/VustAny';
import { VustObject } from '../structures/schema/VustObject';
import { VustDate } from '../structures/schema/VustDate';
import { VustLiteral } from '../structures/schema/VustLiteral';
import { VustRecord } from '../structures/schema/VustRecord';
import { VustUnion } from '../structures/schema/VustUnion';
import { ArraySchemaKey } from '../structures/schema/VustArray';
import { VustTuple } from '../structures/schema/VustTuple';
import { VustBuffer } from '../structures/schema/VustBuffer';

/**
 * All types available in schema keys
 */
export enum SchemaType {
    String = 'string',
    Number = 'number',
    BigInt = 'bigint',
    Boolean = 'boolean',
    /**
     * Represents the type of the unique id (`_uid`) of a document
     */
    UUID = 'uuid',
    /**
     * Represents the type of **any** value
     */
    Any = 'any',
    Object = 'object',
    Date = 'date',
    /**
     * Represents the type of a literal value, e.g. when a property always has the same value
     */
    Literal = 'literal',
    /**
     * Represents the type of **any** object
     */
    Record = 'record',
    Union = 'union',
    Array = 'array',
    Tuple = 'tuple',
    Buffer = 'buffer',
}

export interface SchemaKeyDefinition<Type extends SchemaType> {
    /**
     * The type of this schema key
     */
    type: Type;
    /**
     * Whether the key is optional or not
     */
    optional?: true;
    /**
     * A function to make a default value when a value is not supplied
     *
     * @example
     * interface Person {
     *     name: string;
     *     age: number;
     *     description: string;
     * }
     *
     * const personSchema = new Schema<Person>({
     *     name: S.string(),
     *     age: S.number().integer(),
     *     description: S.string().default<Person>(({ name }) => `My name is ${name}`)
     * })
     */
    default?(data: AnyObject): MappedSchemaType[Type];
    /**
     * The reference key of the schema key
     *
     * @example
     * const posts = new Schema({
     *     title: S.string(),
     *     authorId: S.string(),
     *     author: S.object({
     *         name: S.string(),
     *         id: S.string().reference('authorId'),
     *     }),
     * });
     *
     * // Works
     * posts.parse({ title: 'Vust', authorId: '123', author: { name: 'John', id: '123' } });
     *
     * // Fails
     * posts.parse({ title: 'Vust', authorId: '321', author: { name: 'John', id: '123' } });
     */
    reference?: string;
}

/**
 * Used to infer the type of a object to create a new schema
 *
 * ```ts
 * interface Person {
 *     name: string;
 *     age: number;
 * }
 *
 * // { name: VustString; age: VustNumber; }
 * type T1 = Infer<Person>;
 * ```
 */
export type Infer<S extends Record<string, unknown>> = {
    [K in keyof S]: _infer<S[K]>;
} & { _uid?: VustDocID };

export type _infer<V> = V extends unknown[]
    ? IsTuple<V> extends true
        ? VustTuple<{ [K in keyof V]: _infer<V[K]> }>
        : ArraySchemaKey<_infer<V[number]>[]>
    : V extends Date
    ? VustDate
    : V extends Buffer
    ? VustBuffer
    : IsLiteral<V> extends true
    ? VustLiteral<V>
    : V extends AnyObject
    ? IsRecord<V> extends true
        ? VustRecord<
              InferPropertyKey<V>,
              MappedSchemaKeys[InferType<V[string]>]
          >
        : VustObject<Infer<V>>
    : MappedSchemaKeys[InferType<V>];

type InferPropertyKey<V extends AnyObject> = keyof V extends number
    ? VustNumber
    : VustString;

/**
 * Infer the schema type of a value
 */
export type InferType<V> = Find<MappedSchemaType, V>;

export interface MappedSchemaType {
    [SchemaType.String]: string;
    [SchemaType.Number]: number;
    [SchemaType.BigInt]: bigint;
    [SchemaType.Boolean]: boolean;
    [SchemaType.UUID]: string;
    [SchemaType.Any]: any;
    [SchemaType.Object]: AnyObject;
    [SchemaType.Date]: Date;
    [SchemaType.Literal]: unknown;
    [SchemaType.Record]: AnyObject;
    [SchemaType.Union]: Exclude<MappedSchemaType, SchemaType.Union>[Exclude<
        SchemaType,
        SchemaType.Union
    >];
    [SchemaType.Array]: unknown[];
    [SchemaType.Tuple]: [any, ...any];
    [SchemaType.Buffer]: Buffer;
}

export interface MappedSchemaKeys {
    [SchemaType.String]: VustString;
    [SchemaType.Number]: VustNumber;
    [SchemaType.BigInt]: VustBigInt;
    [SchemaType.Boolean]: VustBoolean;
    [SchemaType.UUID]: VustDocID;
    [SchemaType.Any]: ASK;
    [SchemaType.Object]: VustObject<{ [K in string]: AnySchemaKey }>;
    [SchemaType.Date]: VustDate;
    [SchemaType.Literal]: VustLiteral<unknown>;
    [SchemaType.Record]: VustRecord<PropertyKeySchema, AnySchemaKey>;
    [SchemaType.Union]: VustUnion<AnySchemaKey[]>;
    [SchemaType.Array]: ArraySchemaKey<AnySchemaKey[]>;
    [SchemaType.Tuple]: VustTuple<AnySchemaKey[]>;
    [SchemaType.Buffer]: VustBuffer;
}

export type AnySchemaKey =
    | VustString
    | VustNumber
    | VustBigInt
    | VustBoolean
    | VustDocID
    | ASK
    | VustObject<{ [K in string]: AnySchemaKey }>
    | VustDate
    | VustLiteral<unknown>
    | VustRecord<PropertyKeySchema, AnySchemaKey>
    | VustUnion<AnySchemaKey[]>
    | ArraySchemaKey<AnySchemaKey[]>
    | VustTuple<AnySchemaKey[]>
    | VustBuffer;

export type PropertyKeySchema = VustString | VustNumber;

/**
 * The effect function used to validate a value
 */
export type EffectFunction<Type extends SchemaType> = (
    value: MappedSchemaType[Type]
) => unknown;

export interface Effect<Type extends SchemaType> extends EffectError {
    /**
     * The effect function that will validate the value
     */
    effect: EffectFunction<Type>;
}

export interface EffectError {
    /**
     * The error message of the effect that will throw
     */
    message: string;
}

export interface SchemaOptions {
    /**
     * Whether the schema must be strict or not
     */
    strict?: boolean;
}
