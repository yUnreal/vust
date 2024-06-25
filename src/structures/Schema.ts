import isPlainObject from 'is-plain-obj';
import uuid from 'uuid-random';
import { Infer, SchemaType, SchemaOptions } from '../typings/schema';
import { AnyObject } from '../typings/utils';
import { S } from './S';

/**
 * Main class to parse/validate values when received in collections
 */
export class Schema<Shape extends AnyObject> {
    public constructor(
        public shape: Infer<Shape>,
        public options = <SchemaOptions>{}
    ) {
        shape['_uid'] ??= S.id();

        const VALID_ID_TYPES = [SchemaType.String, SchemaType.UUID];

        if (!VALID_ID_TYPES.includes(shape._uid.type))
            throw new Error(
                'Schema key "_uid" must be a UUID/string schema key'
            );
    }

    /**
     * Parses an object with the schema shape, the object may change
     * @param object The object to parse
     */
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

    /**
     * Checks wheter the value is a compatible with the schema
     * @param value The value to validate
     */
    public isValid(value: unknown): value is Shape {
        try {
            this.parse(value);

            return true;
        } catch {
            return false;
        }
    }

    /**
     * Extends the current schema with another schema
     * @param shape The shape to extend with
     * @example
     * const user = new User({
     *     name: S.string(),
     *     age: S.number().integer()
     * });
     *
     * const employer = user.extend({
     *     role: S.string()
     * });
     */
    public extend<Other extends AnyObject>(
        shape: Infer<Omit<Other, keyof Shape>>
    ) {
        this.shape = { ...this.shape, ...shape };

        return <Schema<Shape & Other>>this;
    }
}
