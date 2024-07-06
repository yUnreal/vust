import { Path } from 'a-path';
import { EffectError } from '../../errors/EffectError';
import {
    Effect,
    EffectError as EffectErrorType,
    EffectFunction,
    IsParsableResult,
    MappedSchemaType,
    SchemaKeyDefinition,
    SchemaType,
} from '../../typings/schema';
import { AnyObject } from '../../typings/utils';
import { getType } from '../../utils/common/getType';
import isEqual from 'lodash.isequal';
import { ValidationError } from '../../errors/ValidationError';

export abstract class SchemaKey<Type extends SchemaType> {
    /**
     * The internal effect functions of the schema key
     */
    protected effects = <Effect<Type>[]>[];

    public constructor(
        /**
         * The options of the schema key
         */
        public options: SchemaKeyDefinition<Type>
    ) {}

    /**
     * The type of this schema keys
     */
    public get type() {
        return this.options.type;
    }

    /**
     * Creates a new effect in this schema key
     * @param fn The effect function to validate the value
     * @param message Optional error options message
     * @example
     * interface User {
     *     name: string;
     * }
     *
     * const name = S.string().effect((name) => name.normalize() === name, 'Invalid name!');
     *
     * const user = new Schema({
     *     name,
     * });
     */
    public effect(fn: EffectFunction<Type>, message: EffectErrorType | string) {
        this.effects.push({
            effect: fn,
            message: typeof message === 'string' ? message : message.message,
        });

        return this;
    }

    /**
     * Checks whether the value is safe to parse or not
     * @param value The value to check
     */
    public isSafe(value: unknown): value is MappedSchemaType[Type] {
        const type = getType(value);

        return Array.isArray(type)
            ? type.includes(this.type)
            : type === this.type;
    }

    /**
     * Whether the value is parsable by the schema key or not
     * @param fullData The full data received from the `<Schema>.parse` function
     * @param data The data to check
     */
    public isParsable(
        fullData: AnyObject,
        data?: MappedSchemaType[Type]
    ): IsParsableResult<MappedSchemaType[Type]> {
        try {
            this.parse(fullData, data);

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error as Error };
        }
    }

    /**
     * Parse the value checking the type and running all the effects
     * @param fullData The full data reiceved from the `<Schema>.parse` function
     * @param value The data to parse
     */
    public parse(fullData: AnyObject, value?: MappedSchemaType[Type]) {
        value ??= this.options.default
            ? this.options.default(fullData)
            : void 0;

        if (this.type !== SchemaType.Any && !this.isSafe(value))
            throw new Error(`Invalid schema key type, expected ${this.type}`);

        const { reference } = this.options;

        if (reference && !isEqual(Path.get(fullData, reference), value))
            throw new ValidationError(
                `Value must be a reference of key "${reference}"`,
                reference
            );

        for (const { effect, message } of this.effects) {
            // @ts-expect-error Ignore it
            if (!effect(value)) throw new EffectError(message, value, effect);
        }

        return value;
    }

    /**
     * Whether the schema key is optional or not
     */
    public isOptional() {
        return this.options.optional;
    }

    /**
     * Add a default value for the schema key
     * @param fn The function or default value
     *
     * @remarks You **DO NOT** need set the schema key as optional, `<SchemaKey>.default` will do it
     */
    public default<Data extends AnyObject>(
        fn: MappedSchemaType[Type] | ((data: Data) => MappedSchemaType[Type])
    ) {
        this.options.optional = true;
        this.options.default = typeof fn === 'function' ? fn : () => fn;

        return this;
    }

    /**
     * Set the schema key as optional
     */
    public optional() {
        this.options.optional = true;

        return this;
    }

    /**
     * Set the reference value of the schema key
     * @param path The path to set
     * @example
     * interface User {
     *     name: string;
     *     children: Record<string, { name: string; dad_name: string }>;
     * }
     * 
     * // `dad_name` property is the same name of the `name`
     * 
     * const user = new Schema({
     *     name: S.string(),
     *     children: S.record(S.string(), S.object({
     *         name: S.string(),
     *         dad_name: S.string().reference('name'),
     *     })),
     * });
     */
    public reference<D extends AnyObject>(path: Path<D>) {
        this.options.reference = path;

        return this;
    }

    public toString() {
        return this.type;
    }
}
