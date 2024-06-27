import { JSONDriver } from '../drivers/JSONDriver';
import { CollectionError } from '../errors/CollectionError';
import { CollectionOptions, CreateDocData } from '../typings/collection';
import { QueryOptions, UpdateOptions } from '../typings/query';
import { AnyObject } from '../typings/utils';
import { execUpdate } from '../utils/query/execUpdate';
import { Doc } from './Doc';
import { Query } from './Query';
import { Schema } from './Schema';
import { join } from 'path';

/**
 * Main class used to create/save/delete/update/find document(s) in a file
 */
export class Collection<Shape extends AnyObject> {
    public constructor(
        /**
         * The options used in this collection
         */
        public options: CollectionOptions<Shape>,
        /**
         * The schema that belongs to this document
         */
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

        for (const [key, value] of Object.entries(data)) {
            if (value instanceof Date)
                Object.defineProperty(data, key, {
                    value: { $date: value.getTime() },
                    enumerable: true,
                });
        }

        this.driver.update((crrData) => {
            if (crrData[<string>_uid])
                throw new CollectionError(
                    `A document with id "${_uid}" already exists`,
                    this
                );

            Object.defineProperty(crrData, <string>_uid, {
                value: data,
                enumerable: true,
            });
        });

        return new Doc(data, this);
    }

    public findUnique(
        options: QueryOptions<Shape> & { raw: true }
    ): (Shape & { _uid: string }) | null;
    public findUnique(options: QueryOptions<Shape>): Doc<Shape> | null;

    /**
     * Finds an unique document in the collection
     * @param options The options of the query
     */
    public findUnique(options: QueryOptions<Shape>) {
        const value = new Query(options, this).exec();

        if (!value) return null;

        return options.raw ? value : new Doc(value, this);
    }

    /**
     * Deletes one document of the collection
     * @param options The options of the query to delete the document
     */
    public deleteOne(options: QueryOptions<Shape>) {
        const doc = this.findUnique({
            ...options,
            projection: { _uid: true },
            raw: true,
        });

        if (!doc) return null;

        this.driver.update((crrData) => delete crrData[doc._uid]);

        return true;
    }

    /**
     * Updates a document of the collection
     * @param query The query to find the document
     * @param options The options that will be used to update the document
     *
     * @remarks Do **NOT** use projection in keys that you will update
     */
    public updateOne(
        query: QueryOptions<Shape>,
        options: UpdateOptions<Shape>
    ) {
        const doc = this.findUnique({ ...query, raw: true });

        if (!doc) return null;

        const updatedData = execUpdate(doc, options);

        this.driver.update((crrData) => (crrData[doc._uid] = updatedData));

        return new Doc(updatedData, this);
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
        const doc = this.findUnique({
            query,
            projection: { _uid: true },
            raw: true,
        });

        return Boolean(doc);
    }
}
