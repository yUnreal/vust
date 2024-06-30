import { Path } from 'a-path';
import { EffectError } from '../../errors/EffectError';
import {
    Effect,
    EffectError as EffectErrorType,
    EffectFunction,
    MappedSchemaType,
    SchemaKeyDefinition,
    SchemaType,
} from '../../typings/schema';
import { AnyObject } from '../../typings/utils';
import { getType } from '../../utils/common/getType';
import isEqual from 'lodash.isequal';
import { ValidationError } from '../../errors/ValidationError';
import { get } from 'lodash';

export abstract class SchemaKey<Type extends SchemaType> {
    protected effects = <Effect<Type>[]>[];

    public constructor(public options: SchemaKeyDefinition<Type>) {}

    public get type() {
        return this.options.type;
    }

    public effect(fn: EffectFunction<Type>, message: EffectErrorType | string) {
        this.effects.push({
            effect: fn,
            message: typeof message === 'string' ? message : message.message,
        });

        return this;
    }

    public isSafe(value: unknown): value is MappedSchemaType[Type] {
        const type = getType(value);

        return Array.isArray(type)
            ? type.includes(this.type)
            : type === this.type;
    }

    public isParsable(fullData: AnyObject, value?: MappedSchemaType[Type]) {
        try {
            this.parse(fullData, value);

            return true;
        } catch {
            return false;
        }
    }

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

    public isOptional() {
        return this.options.optional;
    }

    public default<Data extends AnyObject>(
        fn: MappedSchemaType[Type] | ((data: Data) => MappedSchemaType[Type])
    ) {
        this.options.optional = true;
        this.options.default = typeof fn === 'function' ? fn : () => fn;

        return this;
    }

    public optional() {
        this.options.optional = true;

        return this;
    }

    public reference<D extends AnyObject>(path: Path<D>) {
        this.options.reference = path;

        return this;
    }
}
