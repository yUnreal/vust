import { QueryOptions } from './query';
import { Expression } from './schema';
import { AnyObject } from './utils';

export interface CollectionOptions<D extends AnyObject> {
    /**
     * The name of the collection
     */
    name: string;
    /**
     * The driver to manage the data of the collection
     */
    driver?: BaseDriver<D>;
}

export interface BaseDriver<D extends AnyObject> {
    new (...args: unknown[]): this;
    update(fn: (data: Record<string, D>) => unknown): this;
    read(): D;
}

export type CreateDocData<Data> = Data & {
    /**
     * The unique identifier of the document
     */
    [Expression.UniqueID]?: string;
};

export interface InternalQueryResult<D extends AnyObject = AnyObject> {
    doc: D;
    index: number;
}

export interface DeleteManyOptions<D extends AnyObject>
    extends Omit<QueryOptions<D>, 'projection' | 'raw'> {
    /**
     * The limit of documents to delete
     */
    limit?: number;
}

export interface FindManyOptions<D extends AnyObject> extends QueryOptions<D> {
    /**
     * The limit of documents to return
     */
    limit?: number;
}

export interface UpdateManyOptions<D extends AnyObject>
    extends QueryOptions<D> {
    /**
     * The limit of documents to update
     */
    limit?: number;
}

export interface DeleteManyResult {
    /**
     * The number of documents deleted
     */
    deletedCount: number;
    /**
     * The unique ID of the documents that was deleted
     */
    _uids: string[];
}

export type DeleteOneResult = {
    /**
     * The unique ID of the document that was deleted
     */
    [Expression.UniqueID]: string;
} | null;
