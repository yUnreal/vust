import isPlainObject from 'is-plain-obj';
import uuid from 'uuid-random';
import {
    Infer,
    SchemaType,
    AnySchemaKey as AnySchemaKeyType,
    SchemaOptions,
} from '../typings/schema';
import { AnyObject } from '../typings/utils';
import { BigIntSchemaKey } from './schema/BigIntSchemaKey';
import { NumberSchemaKey } from './schema/NumberSchemaKey';
import { StringSchemaKey } from './schema/StringSchemaKey';
import { BooleanSchemaKey } from './schema/BooleanSchemaKey';
import { UUIDSchemaKey } from './schema/UUIDSchemaKey';
import { AnySchemaKey } from './schema/AnySchemaKey';
import { ObjectSchemaKey } from './schema/ObjectSchemaKey';
import { DateSchemaKey } from './schema/DateSchemaKey';
import { LiteralSchemaKey } from './schema/LiteralSchemaKey';
import { RecordSchemaKey } from './schema/RecordSchemaKey';

export class Schema<Shape extends AnyObject> {
    public constructor(
        public shape: Infer<Shape>,
        public options = <SchemaOptions>{}
    ) {
        shape['_uid'] ??= Schema.id();

        const VALID_ID_TYPES = [SchemaType.String, SchemaType.UUID];

        if (!VALID_ID_TYPES.includes(shape._uid.type))
            throw new Error(
                'Schema key "_uid" must be a UUID/string schema key'
            );
    }

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

    public static record<V extends AnySchemaKeyType>(value: V) {
        return new RecordSchemaKey(value, { type: SchemaType.Record });
    }

    public parse<V>(object: V) {
        if (!isPlainObject(object))
            throw new Error('Schema value must be an object');

        // @ts-expect-error Fuck it
        object['_uid'] ??= uuid();

        if (typeof object._uid !== 'string')
            throw new Error('Invalid unique id, must be a string');

        for (const [key, value] of Object.entries(object)) {
            const schema = this.shape[key];

            if (!schema) {
                if (this.options.strict)
                    throw new Error(`Unknown key "${key}" when parsing`);

                delete object[key];
            }

            if (schema.type !== SchemaType.Any && !schema.isSafe(value))
                throw new Error(
                    `Invalid schema key "${key}" type, expected "${schema.type}"`
                );

            schema.parse(object, value);
        }

        return <Shape & { _uid: string }>(<unknown>object);
    }

    public isValid(value: unknown): value is Shape {
        try {
            this.parse(value);

            return true;
        } catch {
            return false;
        }
    }

    public extend<Other extends AnyObject>(
        shape: Infer<Omit<Other, keyof Shape>>
    ) {
        this.shape = { ...this.shape, ...shape };

        return <Schema<Shape & Other>>this;
    }
}
