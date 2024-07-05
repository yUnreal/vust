import isPlainObject from 'is-plain-obj';
import { UpdateOptions } from '../typings/query';
import { AnyObject, DeepPartial } from '../typings/utils';
import { Collection } from './Collection';
import { Expression } from '../typings/schema';

/**
 * Represents the class to manage the data found of a document
 */
export class Doc<Data extends AnyObject> {
    public constructor(
        /**
         * The data of this document
         */
        public data: Data,
        /**
         * The collection this document belongs to
         */
        public collection: Collection<Data>
    ) {
        for (const [key, value] of Object.entries(data)) {
            if (isPlainObject(value) && value[Expression.Date])
                Object.defineProperty(data, key, {
                    value: new Date(<number>value[Expression.Date]),
                });

            if (isPlainObject(value) && value[Expression.Buffer])
                Object.defineProperty(data, key, {
                    value: Buffer.from(<number[]>value[Expression.Buffer]),
                });
        }
    }

    /**
     * The unique UUID of this document
     */
    public get _uid() {
        return <string>this.data._uid;
    }

    /**
     * Update this document
     * @param options The options to update
     */
    public update(options: UpdateOptions<Data>) {
        return <Doc<Data>>(
            this.collection.updateOne({ query: { _uid: this._uid } }, options)
        );
    }

    /**
     * Deletes this document in the collection
     */
    public delete() {
        return this.collection.deleteOne({ query: { _uid: this._uid } });
    }

    /**
     * Saves in the collection the changes made in this document
     *
     * @example
     * ```ts
     * const person = persons.findUnique({ query: { name: 'Kauz' } });
     *
     * person.data.name = 'Drezzy';
     *
     * // Now the `name` of the document in the collection is `"Drezzy"`
     * person.save();
     * ```
     */
    public save() {
        this.collection.driver.update(
            (crrData) => (crrData[this._uid] = this.data)
        );

        return this;
    }

    /**
     * Replaces the entire data of the document and save in the database
     * @param data The new data for this document
     */
    public replace(data: DeepPartial<Data>) {
        return <Doc<Data>>(
            this.collection.replaceUnique({ query: { _uid: this._uid } }, data)
        );
    }

    public toString() {
        return this._uid;
    }
}
