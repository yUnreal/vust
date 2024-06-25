import { AnyObject, DeepPartial, Find, PartialRecord } from './utils';

export enum QueryOperators {
    //#region Any
    Equal = 'Equal',
    NotEqual = 'NotEqual',
    Comment = 'Comment',
    Where = 'Where',
    //#endregion

    //#region Numbers
    GreaterThan = 'GreaterThan',
    LessThan = 'LessThan',
    Greater = 'Greater',
    Less = 'Less',
    //#endregion

    //#region Strings
    Pattern = 'Pattern',
    Length = 'Length',
    //#endregion
}

export interface QueryOperatorBased<D extends AnyObject> {
    [QueryOperators.Equal]?: DeepPartial<D>;
    [QueryOperators.NotEqual]?: DeepPartial<D>;
    [QueryOperators.Comment]?: string;
    [QueryOperators.Where]?: WhereQueryFn<D>;
    [QueryOperators.Greater]?: Partial<Pick<D, Find<D, number>>>;
    [QueryOperators.Less]?: Partial<Pick<D, Find<D, number>>>;
    [QueryOperators.GreaterThan]?: Partial<Pick<D, Find<D, number>>>;
    [QueryOperators.LessThan]?: Partial<Pick<D, Find<D, number>>>;
    [QueryOperators.Pattern]?: PartialRecord<Find<D, string>, RegExp>;
    [QueryOperators.Length]?: PartialRecord<Find<D, string>, number>;
}

export interface QueryOptions<D extends AnyObject> {
    skip?: number;
    projection?: Projection<D>;
    query:
        | (DeepPartial<D> & { _uid?: string })
        | (QueryOperatorBased<D> & {
              [QueryOperators.Where]?: WhereQueryFn<D>;
          });
}

export interface UpdateOperatorsBased<D extends AnyObject> {
    [UpdateOperators.Remove]?: (keyof D)[];
    [UpdateOperators.Set]?: Partial<D>;
    [UpdateOperators.Rename]?: PartialRecord<keyof D, string>;
    [UpdateOperators.Increment]?: Partial<Pick<D, Find<D, number>>>;
    [UpdateOperators.Decrement]?: Partial<Pick<D, Find<D, number>>>;
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
}

export type Projection<D extends AnyObject> = PartialRecord<keyof D, boolean>;

export type WhereQueryFn<D extends AnyObject> = (data: D) => unknown;
