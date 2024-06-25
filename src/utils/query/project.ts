import { VustError } from '../../errors/VustError';
import { Projection } from '../../typings/query';
import { AnyObject } from '../../typings/utils';

export const project = <D extends AnyObject>(
    data: D,
    projection: Projection<D>
): D => {
    const UNIQUE_DOC_ID_KEY = '_uid';

    if (UNIQUE_DOC_ID_KEY in data) return { _uid: data[UNIQUE_DOC_ID_KEY] };

    const newData: Partial<D> = {};

    if (
        Object.values(projection).some(Boolean) &&
        Object.values(projection).some((v) => !v)
    ) {
        throw new VustError(
            'Cannot use truthy/falsy projections in one projection'
        );
    }

    for (const [key, shouldInclude] of Object.entries(projection)) {
        if (shouldInclude) {
            Object.defineProperty(newData, key, {
                value: data[key],
                enumerable: true,
            });
        } else {
            delete data[key];
        }
    }

    return Object.keys(newData).length > 0 ? (newData as D) : data;
};
