import {
    Effect,
    EffectError,
    EffectFunction,
    MappedSchemaType,
    SchemaKeyDefinition,
    SchemaType,
} from '../../typings/schema';
import { AnyObject } from '../../typings/utils';
import { getType } from '../../utils/getType';

export abstract class SchemaKey<Type extends SchemaType> {
    protected effects = <Effect<Type>[]>[];

    public constructor(public options: SchemaKeyDefinition<Type>) {}

    public get type() {
        return this.options.type;
    }

    public effect(fn: EffectFunction<Type>, message: EffectError | string) {
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

    public parse(
        fullData: AnyObject,
        value = this.options.default ? this.options.default(fullData) : void 0
    ) {
        if (this.type !== SchemaType.Any && !this.isSafe(value))
            throw new Error(`Invalid schema key type, expected ${this.type}`);

        for (const { effect, message } of this.effects) {
            if (!effect(value)) throw new Error(message);
        }

        return value;
    }

    public isOptional() {
        return Boolean(this.options.optional);
    }

    public optional() {
        this.options.optional = true;

        return this;
    }

    public default<Data extends AnyObject>(
        fn: (data: Data) => MappedSchemaType[Type]
    ) {
        this.options.default = fn;

        return this;
    }
}
