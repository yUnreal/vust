import isPlainObject from 'is-plain-obj';
import uuid from 'uuid-random';
import { Infer, SchemaType, SchemaOptions } from '../typings/schema';
import { AnyObject } from '../typings/utils';
import { S } from './S';
import { SchemaError } from '../errors/SchemaError';
import { ValidationError } from '../errors/ValidationError';

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
            throw new SchemaError(
                'Schema key "_uid" must be a UUID/string schema key',
                this
            );
    }

    /**
     * Parses an object with the schema shape, the object may change
     * @param object The object to parse
     */
    public parse<V>(object: V) {
        if (!isPlainObject(object))
            throw new ValidationError('Schema value must be an object', object);

        // @ts-expect-error Fuck it
        object['_uid'] ??= uuid();

        if (typeof object._uid !== 'string')
            throw new ValidationError(
                'Invalid unique id, must be a string',
                object._uid
            );

        for (const [key, value] of Object.entries(object)) {
            const schema = this.shape[key];

            if (!schema) {
                if (this.options.strict)
                    throw new ValidationError(
                        `Unknown key "${key}" when parsing`,
                        key
                    );

                delete object[key];
            }

            if (
                ![SchemaType.Any, SchemaType.Union].includes(schema.type) &&
                !schema.isSafe(value)
            )
                throw new ValidationError(
                    `Invalid schema key "${key}" type, expected "${schema.type}"`,
                    value
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
