import { AnyObject } from '../typings/utils';
import { Collection } from './Collection';

export class Doc<Data extends AnyObject> {
    public constructor(
        public data: Data,
        public collection: Collection<Data>
    ) {}
}
