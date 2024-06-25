import { Collection } from './structures/Collection';
import { Schema } from './structures/Schema';
import { AnyObject } from './typings/utils';

export { Collection } from './structures/Collection';
export { Schema } from './structures/Schema';
export { S } from './structures/S';

export const collection = <D extends AnyObject>(
    name: string,
    schema: Schema<D>
) => new Collection({ name }, schema);
