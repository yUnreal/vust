import { VustError } from '../../errors/VustError';
import { SchemaType } from '../../typings/schema';
import { AnyObject } from '../../typings/utils';
import { VustLengthBased } from './VustLengthBased';

export class VustBuffer extends VustLengthBased<SchemaType.Buffer> {
    /**
     * The reference key from the buffer
     */
    public fromKey?: string;

    public parse(fullData: AnyObject, buffer: Buffer) {
        const { fromKey } = this;

        if (fromKey) {
            const value = fullData[fromKey];

            if (!buffer.equals(Buffer.from(value)))
                throw new VustError(
                    `Buffer must be a buffer from key "${fromKey}"`
                );

            return buffer;
        }

        return super.parse(fullData, buffer);
    }

    /**
     * Makes the buffer be from a some key
     * @param key The key name
     * @example
     * const users = new Schema({
     *     name: S.string(),
     *     bufferName: S.buffer().from('name'),
     * });
     *
     * const name = 'Bob Willson';
     *
     * users.parse({ name, buffer: Buffer.from(name) }); // Works
     *
     * users.parse({ name: 'Willson Bob', buffer: Buffer.from([])) }); // Fails
     */
    public from(key: string) {
        this.fromKey = key;

        return this;
    }
}
