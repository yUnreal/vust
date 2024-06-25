import { Collection } from '../structures/Collection';
import { AnyObject } from '../typings/utils';
import { VustError } from './VustError';

export class CollectionError extends VustError {
    public constructor(
        message: string,
        /**
         * The collection that the error belongs to
         */
        public collection: Collection<AnyObject>
    ) {
        super(message);
    }
}
