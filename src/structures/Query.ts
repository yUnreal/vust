import { Projection, QueryOperators, QueryOptions } from '../typings/query';
import { AnyObject } from '../typings/utils';
import { execQuery } from '../utils/query/execQuery';
import { project } from '../utils/query/project';
import { Collection } from './Collection';

/**
 * Main class for building new query and executing them
 */
export class Query<D extends AnyObject> {
    public constructor(
        public options: QueryOptions<D>,
        public collection: Collection<D>
    ) {}

    /**
     * Projects how the document data will be returned
     * @param projection The projection to use
     */
    public project(projection: Projection<D>) {
        this.options.projection = projection;

        return this;
    }

    /**
     * Sets the amount of documents to skip before finding document(s)
     * @param amount The amount of times to skip
     */
    public skip(amount: number) {
        this.options.skip = amount;

        return this;
    }

    private set(key: keyof D, operator: QueryOperators, value: unknown) {
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

    public gte(key: keyof D, value: number) {
        return this.set(key, QueryOperators.GreaterThanEqual, value);
    }

    public lte(key: keyof D, value: number) {
        return this.set(key, QueryOperators.LessThanEqual, value);
    }


    /**
     * Execute the query in this Query instance
     * @exmaple
     * const query = new Query<User>().equal('name', 'John');
     *
     * console.log(query.exec({ ...data }));
     */
    public exec() {
        let data = <D | null>(
            execQuery(this.options, this.collection.driver.read())
        );

        if (data && this.options.projection)
            data = project(data, this.options.projection);

        return data;
    }
}
