import { DriverError } from '../errors/DriverError';
import { AnyObject } from '../typings/utils';
import { readFileSync, writeFileSync, existsSync } from 'fs';

export class JSONDriver<Data extends AnyObject> {
    public constructor(public readonly path: string) {
        if (!path.endsWith('.json'))
            throw new DriverError('Driver path must end with ".json"', this);
        if (!existsSync(path)) writeFileSync(path, '{}', 'utf8');
    }

    public read() {
        const data = readFileSync(this.path, 'utf8');

        return <Record<string, Data>>JSON.parse(data);
    }

    public update(fn: (data: Record<string, Data>) => unknown) {
        const data = this.read();

        fn(data);

        writeFileSync(this.path, JSON.stringify(data, null, '\t'), 'utf8');

        return this;
    }
}
