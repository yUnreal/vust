import { Projection, QueryOperators, QueryOptions } from '../typings/query';
import { AnyObject } from '../typings/utils';
import { execQuery } from '../utils/execQuery';
import { Collection } from './Collection';

export class Query<D extends AnyObject> {
    public constructor(
        public options: QueryOptions<D>,
        public collection: Collection<D>
    ) {}

    public project(projection: Projection<D>) {
        this.options.projection = projection;

        return this;
    }

    public skip(amount: number) {
        this.options.skip = amount;

        return this;
    }

    public set(key: keyof D, operator: QueryOperators, value: unknown) {
        Object.defineProperty(this.options.query, operator, {
            value: { [key]: value },
            enumerable: true,
        });

        return this;
    }

    public equal(key: keyof D, value: unknown) {
        return this.set(key, QueryOperators.Equal, value);
    }

    public notequal(key: keyof D, value: unknown) {
        return this.set(key, QueryOperators.NotEqual, value);
    }

    public gt(key: keyof D, value: number) {
        return this.set(key, QueryOperators.GreaterThan, value);
    }

    public lt(key: keyof D, value: number) {
        return this.set(key, QueryOperators.LessThan, value);
    }

    public greater(key: keyof D, value: number) {
        return this.set(key, QueryOperators.Less, value);
    }

    public less(key: keyof D, value: number) {
        return this.set(key, QueryOperators.Less, value);
    }

    public exec() {
        return <D | null>execQuery(this.options, this.collection.driver.read());
    }
}
