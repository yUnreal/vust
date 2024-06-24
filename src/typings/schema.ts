import { BigIntSchemaKey } from '../structures/schema/BigIntSchemaKey';
import { BooleanSchemaKey } from '../structures/schema/BooleanSchemaKey';
import { NumberSchemaKey } from '../structures/schema/NumberSchemaKey';
import { StringSchemaKey } from '../structures/schema/StringSchemaKey';
import { UUIDSchemaKey } from '../structures/schema/UUIDSchemaKey';
import { AnyObject, IsLiteral, IsRecord } from './utils';
import { AnySchemaKey as ASK } from '../structures/schema/AnySchemaKey';
import { ObjectSchemaKey } from '../structures/schema/ObjectSchemaKey';
import { DateSchemaKey } from '../structures/schema/DateSchemaKey';
import { LiteralSchemaKey } from '../structures/schema/LiteralSchemaKey';
import { RecordSchemaKey } from '../structures/schema/RecordSchemaKey';

export enum SchemaType {
    String = 'string',
    Number = 'number',
    BigInt = 'bigint',
    Boolean = 'boolean',
    UUID = 'uuid',
    Any = 'any',
    Object = 'object',
    Date = 'date',
    Literal = 'literal',
    Record = 'record',
}

export interface SchemaKeyDefinition<Type extends SchemaType> {
    type: Type;
    optional?: true;
    default?(data: AnyObject): MappedSchemaType[Type];
}

export type Infer<S extends Record<string, unknown>> = {
    [K in keyof S]: S[K] extends Date
        ? DateSchemaKey
        : IsLiteral<S[K]> extends true
        ? LiteralSchemaKey<S[K]>
        : S[K] extends AnyObject
        ? IsRecord<S[K]> extends true
            ? RecordSchemaKey<
                  StringSchemaKey,
                  MappedSchemaKeys[InferType<S[K][string]>]
              >
            : ObjectSchemaKey<Infer<S[K]>>
        : MappedSchemaKeys[InferType<S[K]>];
} & { _uid?: UUIDSchemaKey };

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
    | RecordSchemaKey<PropertyKeySchema, AnySchemaKey>;

export type PropertyKeySchema = StringSchemaKey | NumberSchemaKey;

type Find<T extends MappedSchemaType, V> = {
    [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

export type EffectFunction<Type extends SchemaType> = (
    value: MappedSchemaType[Type]
) => unknown;

export interface Effect<Type extends SchemaType> {
    effect: EffectFunction<Type>;
    message: string;
}

export interface EffectError {
    message: string;
}

export interface SchemaOptions {
    strict?: true;
}
