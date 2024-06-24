import { AnyObject } from './utils';

export interface CollectionOptions<D extends AnyObject> {
    name: string;
    driver?: BaseDriver<D>;
}

export interface BaseDriver<D extends AnyObject> {
    new (...args: unknown[]): this;
    update(fn: (data: Record<string, D>) => unknown): this;
    read(): D;
}

export type CreateDocData<Data> = Data & { _uid?: string };
