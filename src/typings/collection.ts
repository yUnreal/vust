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
    _uid?: string;
};
