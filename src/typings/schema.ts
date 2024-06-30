import { BigIntSchemaKey } from '../structures/schema/BigIntSchemaKey';
import { BooleanSchemaKey } from '../structures/schema/BooleanSchemaKey';
import { NumberSchemaKey } from '../structures/schema/NumberSchemaKey';
import { StringSchemaKey } from '../structures/schema/StringSchemaKey';
import { UUIDSchemaKey } from '../structures/schema/UUIDSchemaKey';
import { AnyObject, Find, IsLiteral, IsRecord, IsTuple } from './utils';
import { AnySchemaKey as ASK } from '../structures/schema/AnySchemaKey';
import { ObjectSchemaKey } from '../structures/schema/ObjectSchemaKey';
import { DateSchemaKey } from '../structures/schema/DateSchemaKey';
import { LiteralSchemaKey } from '../structures/schema/LiteralSchemaKey';
import { RecordSchemaKey } from '../structures/schema/RecordSchemaKey';
import { UnionSchemaKey } from '../structures/schema/UnionSchemaKey';
import { ArraySchemaKey } from '../structures/schema/ArraySchemaKey';
import { TupleSchemaKey } from '../structures/schema/TupleSchemaKey';
import { BufferSchemaKey } from '../structures/schema/BufferSchemaKey';

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
 * // { name: StringSchemaKey; age: NumberSchemaKey; }
 * type T1 = Infer<Person>;
 * ```
 */
export type Infer<S extends Record<string, unknown>> = {
    [K in keyof S]: _infer<S[K]>;
} & { _uid?: UUIDSchemaKey };

export type _infer<V> = V extends unknown[]
    ? IsTuple<V> extends true
        ? TupleSchemaKey<{ [K in keyof V]: _infer<V[K]> }>
        : ArraySchemaKey<_infer<V[number]>[]>
    : V extends Date
    ? DateSchemaKey
    : V extends Buffer
    ? BufferSchemaKey
    : IsLiteral<V> extends true
    ? LiteralSchemaKey<V>
    : V extends AnyObject
    ? IsRecord<V> extends true
        ? RecordSchemaKey<
              InferPropertyKey<V>,
              MappedSchemaKeys[InferType<V[string]>]
          >
        : ObjectSchemaKey<Infer<V>>
    : MappedSchemaKeys[InferType<V>];

type InferPropertyKey<V extends AnyObject> = keyof V extends number
    ? NumberSchemaKey
    : StringSchemaKey;

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
    [SchemaType.String]: StringSchemaKey;
    [SchemaType.Number]: NumberSchemaKey;
    [SchemaType.BigInt]: BigIntSchemaKey;
    [SchemaType.Boolean]: BooleanSchemaKey;
    [SchemaType.UUID]: UUIDSchemaKey;
    [SchemaType.Any]: ASK;
    [SchemaType.Object]: ObjectSchemaKey<{ [K in string]: AnySchemaKey }>;
    [SchemaType.Date]: DateSchemaKey;
    [SchemaType.Literal]: LiteralSchemaKey<unknown>;
    [SchemaType.Record]: RecordSchemaKey<PropertyKeySchema, AnySchemaKey>;
    [SchemaType.Union]: UnionSchemaKey<AnySchemaKey[]>;
    [SchemaType.Array]: ArraySchemaKey<AnySchemaKey[]>;
    [SchemaType.Tuple]: TupleSchemaKey<AnySchemaKey[]>;
    [SchemaType.Buffer]: BufferSchemaKey;
}

export type AnySchemaKey =
    | StringSchemaKey
    | NumberSchemaKey
    | BigIntSchemaKey
    | BooleanSchemaKey
    | UUIDSchemaKey
    | ASK
    | ObjectSchemaKey<{ [K in string]: AnySchemaKey }>
    | DateSchemaKey
    | LiteralSchemaKey<unknown>
    | RecordSchemaKey<PropertyKeySchema, AnySchemaKey>
    | UnionSchemaKey<AnySchemaKey[]>
    | ArraySchemaKey<AnySchemaKey[]>
    | TupleSchemaKey<AnySchemaKey[]>
    | BufferSchemaKey;

export type PropertyKeySchema = StringSchemaKey | NumberSchemaKey;

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
