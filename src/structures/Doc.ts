import { AnyObject } from '../typings/utils';
import { Collection } from './Collection';

export class Doc<Data extends AnyObject> {
    public constructor(
        public data: Data,
        public collection: Collection<Data>
    ) {}

    public get _uid() {
        return <string>this.data._uid;
    }

    public delete() {
        return this.collection.deleteOne({ query: { _uid: this._uid } });
    }

    public save() {
        this.collection.driver.update(
            (crrData) => (crrData[this._uid] = this.data)
        );

        return this;
    }
}
