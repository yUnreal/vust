import { Collection } from './structures/Collection';
import { Schema } from './structures/Schema';
import { AnyObject } from './typings/utils';

export { Collection } from './structures/Collection';
export { Schema } from './structures/Schema';
export { s } from './structures/s';

/**
 * Creates a new collection
 * @param name The name of the collection
 * @param schema The schema to use in this collection
 */
export const collection = <D extends AnyObject>(
    name: string,
    schema: Schema<D>
) => new Collection({ name }, schema);
