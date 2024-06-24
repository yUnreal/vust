import { JSONDriver } from '../drivers/JSONDriver';
import { CollectionOptions, CreateDocData } from '../typings/collection';
import { AnyObject } from '../typings/utils';
import { Doc } from './Doc';
import { Schema } from './Schema';

export class Collection<Shape extends AnyObject> {
    public constructor(
        public options: CollectionOptions<Shape>,
        public schema: Schema<Shape>
    ) {}

    public get name() {
        return this.options.name;
    }

    public get driver() {
        return (
            this.options.driver ?? new JSONDriver(`./vasp/${this.name}.json`)
        );
    }

    public create(data: CreateDocData<Shape>) {
        this.schema.parse(data);

        const { _uid } = data;

        this.driver.update((crrData) => {
            if (crrData[<string>_uid])
                throw new Error(`A document with id "${_uid}" already exists`);

            Object.defineProperty(crrData, <string>_uid, { value: data });
        });

        // @ts-expect-error This works
        return new Doc(data, this);
    }
}
