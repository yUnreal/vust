import { JSONDriver } from '../drivers/JSONDriver';
import { CollectionOptions, CreateDocData } from '../typings/collection';
import { QueryOptions } from '../typings/query';
import { AnyObject } from '../typings/utils';
import { Doc } from './Doc';
import { Query } from './Query';
import { Schema } from './Schema';
import { join } from 'path';

/**
 * Main class used to create/save/delete/update/find document(s) in a file
 */
export class Collection<Shape extends AnyObject> {
    public constructor(
        public options: CollectionOptions<Shape>,
        public schema: Schema<Shape>
    ) {}

    /**
     * The name of this collection
     */
    public get name() {
        return this.options.name;
    }

    /**
     * The driver used to read/update data saved in this collection
     */
    public get driver() {
        return (
            this.options.driver ??
            new JSONDriver(join(__dirname, `../../${this.name}.json`))
        );
    }

    /**
     * Creates a new document in this collection
     * @param data The data to save
     */
    public create(data: CreateDocData<Shape>) {
        this.schema.parse(data);

        const { _uid } = data;

        this.driver.update((crrData) => {
            if (crrData[<string>_uid])
                throw new Error(`A document with id "${_uid}" already exists`);

            Object.defineProperty(crrData, <string>_uid, {
                value: data,
                enumerable: true,
            });
        });

        return new Doc(data, this);
    }

    /**
     * Finds an unique document in the collection
     * @param options The options of the query
     */
    public findUnique(options: QueryOptions<Shape>) {
        const value = new Query(options, this).exec();

        return value && new Doc(value, this);
    }

    /**
     * Deletes one document of the collection
     * @param options The options of the query to delete the document
     */
    public deleteOne(options: QueryOptions<Shape>) {
        const doc = this.findUnique({ ...options, projection: { _uid: true } });

        if (!doc) return null;

        this.driver.update((crrData) => delete crrData[doc._uid]);

        return true;
    }

    /**
     * Count all documents saved in the collection
     */
    public count() {
        const data = this.driver.read();

        return Object.keys(data).length;
    }

    /**
     * Checks if a document exists in the collection by query
     * @param query The query to used to find the document
     */
    public exists(query: QueryOptions<Shape>['query']) {
        const doc = this.findUnique({ query, projection: { _uid: true } });

        return Boolean(doc);
    }
}
