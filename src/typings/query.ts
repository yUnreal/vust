import { AnyObject, DeepPartial, PartialRecord } from './utils';

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

export interface QueryOptions<D extends AnyObject> {
    skip?: number;
    projection?: Projection<D>;
    query:
        | (DeepPartial<D> & { _uid?: string })
        | (QueryOperatorBased<D> & {
              [QueryOperators.Where]?: WhereQueryFn<D>;
          });
}

export type Projection<D extends AnyObject> = PartialRecord<keyof D, boolean>;

export type QueryOperatorBased<D extends AnyObject> = PartialRecord<
    Exclude<QueryOperators, QueryOperators.Where>,
    DeepPartial<D>
>;

export type WhereQueryFn<D extends AnyObject> = (data: D) => unknown;
