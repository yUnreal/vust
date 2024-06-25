import isPlainObject from 'is-plain-obj';
import { UpdateOptions } from '../typings/query';
import { AnyObject } from '../typings/utils';
import { Collection } from './Collection';

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
            const DATE_KEY = '$date';

            if (isPlainObject(value) && value[DATE_KEY])
                Object.defineProperty(data, key, {
                    value: new Date(<number>value[DATE_KEY]),
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
}
