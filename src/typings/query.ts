import { AnyObject, DeepPartial, Find, PartialRecord } from './utils';

export enum QueryOperators {
    //#region Any
    Equal = 'Equal',
    NotEqual = 'NotEqual',
    Comment = 'Comment',
    Where = 'Where',
    In = 'In',
    NotIn = 'NotIn',
    Or = 'Or',
    Type = 'Type',
    Exists = 'Exists',
    //#endregion

    //#region Numbers
    GreaterThan = 'GreaterThan',
    LessThan = 'LessThan',
    GreaterThanEqual = 'GreaterThanEqual',
    LessThanEqual = 'LessThanEqual',
    //#endregion

    //#region Strings
    Pattern = 'Pattern',
    Length = 'Length',
    //#endregion

    //#region Array
    AllIn = 'AllIn',
}

export interface QueryOperatorBased<D extends AnyObject> {
    /**
     * Matches any value that is equal
     */
    [QueryOperators.Equal]?: DeepPartial<D>;
    /**
     * Matches any value that is not equal
     */
    [QueryOperators.NotEqual]?: DeepPartial<D>;
    /**
     * Add a comment to the query
     *
     * @remarks This key is ignored when finding documents
     */
    [QueryOperators.Comment]?: string;
    /**
     * Matches any value that correpond to this Where function
     */
    [QueryOperators.Where]?: WhereQueryFn<D>;
    /**
     * Matches any value that is greater than or equal to the number
     */
    [QueryOperators.GreaterThanEqual]?: Partial<
        Pick<D, Find<D, number | undefined>>
    >;
    /**
     * Matches any value that is less than or equal to the number
     */
    [QueryOperators.LessThanEqual]?: Partial<
        Pick<D, Find<D, number | undefined>>
    >;
    /**
     * Matches any value that is greater than the number
     */
    [QueryOperators.GreaterThan]?: Partial<
        Pick<D, Find<D, number | undefined>>
    >;
    /**
     * Matches any value that is less than the number
     */
    [QueryOperators.LessThan]?: Partial<Pick<D, Find<D, number | undefined>>>;
    /**
     * Matches any value that correspond to the regexp
     */
    [QueryOperators.Pattern]?: PartialRecord<
        Find<D, string | undefined>,
        RegExp
    >;
    /**
     * Matches any value that the length is equal
     */
    [QueryOperators.Length]?: PartialRecord<
        Find<D, string | unknown[] | undefined>,
        number | undefined
    >;
    /**
     * Find documents that a value is in the array
     */
    [QueryOperators.In]?: PartialRecord<keyof D, D[keyof D][]>;
    /**
     * Find documents that a value is not in the array
     */
    [QueryOperators.NotIn]?: PartialRecord<keyof D, D[keyof D][]>;
    /**
     * Creates a OR clause
     */
    [QueryOperators.Or]?: QueryOptions<D>['query'][];
    /**
     * Find documents by a key type
     *
     * Available types:
     *
     * - string
     * - number
     * - bigint
     * - boolean
     * - object
     *
     * @example
     * users.findUnique({ query: { Type: { age: 'string' } } });
     */
    [QueryOperators.Type]?: PartialRecord<keyof D, string>;
    /**
     * Matches any value that exists or not
     *
     * @example
     * users.create({ name: 'John', age: 30 }, { name: 'Bob' });
     *
     * users.findUnique({
     *     query: {
     *         Exists: {
     *             name: true,
     *         },
     *     },
     * });
     *
     * // Find the first document that the property `name` exists
     */
    [QueryOperators.Exists]?: PartialRecord<keyof D, boolean>;
    /**
     * Matches any value where all array values are in the specified array
     */
    [QueryOperators.AllIn]?: PartialRecord<
        Find<D, unknown[]>,
        D[Find<D, unknown[]>]
    >;
}

export interface QueryOptions<D extends AnyObject> {
    /**
     * How many documents Vust must skip before querying
     */
    skip?: number;
    /**
     * The projection of the data
     */
    projection?: Projection<D>;
    /**
     * The query object to find the document(s)
     */
    query:
        | (DeepPartial<D> & { _uid?: string })
        | (QueryOperatorBased<D> & {
              [QueryOperators.Where]?: WhereQueryFn<D>;
          });
    /**
     * Whether should return the raw data of the document, or a instance of {@link Doc}
     */
    raw?: boolean;
}

export interface UpdateOperatorsBased<D extends AnyObject> {
    /**
     * Remove/Delete the keys that is in the array
     */
    [UpdateOperators.Remove]?: (keyof D)[];
    /**
     * Set the value of a key
     * @remarks `Set` operator will only update the keys that you passed, and not set the document value to that
     */
    [UpdateOperators.Set]?: Partial<D>;
    /**
     * Rename keys, this does not guarant valid documents
     */
    [UpdateOperators.Rename]?: PartialRecord<keyof D, string>;
    /**
     * Increment a value in a number-based key
     */
    [UpdateOperators.Increment]?: Partial<Pick<D, Find<D, number>>>;
    /**
     * Decrement a value in a number-based key
     */
    [UpdateOperators.Decrement]?: Partial<Pick<D, Find<D, number>>>;
    /**
     * Push a value in a array-based key
     */
    [UpdateOperators.Push]?: PartialRecord<
        Find<D, unknown[]>,
        D[Find<D, unknown[]>][number]
    >;
    /**
     * Add a item in an array only if the item is not in the array
     */
    [UpdateOperators.Unique]?: PartialRecord<
        Find<D, unknown[]>,
        D[Find<D, unknown[]>][number] | D[Find<D, unknown[]>]
    >;
    /**
     * Remove the first or the last item of an array
     */
    [UpdateOperators.Pop]?: PartialRecord<Find<D, unknown[]>, 1 | -1>;
    /**
     * Update the entire document data with the `Compose` function
     *
     * @remarks This operator will be the last to be executed, take care
     */
    [UpdateOperators.Compose]?: ComposeFn<D>;
}

export type UpdateOptions<D extends AnyObject> =
    | DeepPartial<D>
    | UpdateOperatorsBased<D>;

export enum UpdateOperators {
    Increment = 'Increment',
    Remove = 'Remove',
    Set = 'Set',
    Rename = 'Rename',
    Decrement = 'Decrement',
    Push = 'Push',
    Unique = 'Unique',
    Pop = 'Pop',
    Compose = 'Compose',
}

export type WhereQueryFn<D extends AnyObject> = (data: D) => unknown;
export type ComposeFn<D extends AnyObject> = (data: D) => unknown;

export type Projection<D extends AnyObject> = PartialRecord<keyof D, boolean>;
