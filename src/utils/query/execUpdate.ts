/* eslint-disable indent */
import isPlainObject from 'is-plain-obj';
import { UpdateOperators, UpdateOptions } from '../../typings/query';
import { AnyObject } from '../../typings/utils';
import { VustError } from '../../errors/VustError';

export const execUpdate = <D extends AnyObject>(
    data: D,
    options: UpdateOptions<D>
) => {
    for (const [operator, value] of Object.entries(options)) {
        switch (operator) {
            case UpdateOperators.Compose:
                break;
            case UpdateOperators.Set:
                if (!isPlainObject(value))
                    throw new VustError(
                        `Invalid value for "${UpdateOperators.Set}" operator`
                    );

                data = { ...data, ...value };

                break;
            case UpdateOperators.Push:
                for (const [crrKey, crrValue] of Object.entries(value))
                    data[crrKey].push(crrValue);

                break;
            case UpdateOperators.Unique:
                for (const [crrKey, crrValue] of Object.entries(value)) {
                    if (Array.isArray(crrValue)) {
                        for (const item of crrValue) {
                            if (!data[crrKey].includes(item))
                                data[crrKey].push(item);
                        }

                        break;
                    }

                    if (!data[crrKey].includes(crrValue))
                        data[crrKey].push(crrValue);
                }

                break;
            case UpdateOperators.Pop:
                for (const [crrKey, crrValue] of Object.entries(value)) {
                    if (!Array.isArray(data[crrKey]))
                        throw new VustError(
                            `Key "${crrKey}" must be an array to use "${UpdateOperators.Pop}" operator`
                        );
                    if (crrValue !== 1 && crrValue !== -1)
                        throw new VustError(
                            `Invalid value for "${UpdateOperators.Pop}", expected "1" or "-1"`
                        );

                    const method = crrValue === 1 ? 'shift' : 'pop';

                    data[crrKey][method]();
                }

                break;
            case UpdateOperators.Remove:
                if (!Array.isArray(value))
                    throw new VustError(
                        `Expected an array in operator "${UpdateOperators.Remove}"`
                    );

                for (const key of value) delete data[key];

                break;
            case UpdateOperators.Rename:
                if (!isPlainObject(value))
                    throw new VustError(
                        `Expected a mapped object of strings in operator "${UpdateOperators.Rename}"`
                    );

                for (const [key, newKey] of Object.entries(value)) {
                    Object.defineProperty(data, <string>newKey, {
                        value: data[key],
                        enumerable: true,
                    });

                    delete data[key];
                }

                break;
            case UpdateOperators.Increment:
                if (!isPlainObject(value))
                    throw new VustError(
                        `Expected a mapped object of numbers in operator "${UpdateOperators.Increment}"`
                    );

                for (const [key, amount] of Object.entries(value)) {
                    if (typeof amount !== 'number')
                        throw new VustError(
                            'Cannot increment non-number values'
                        );
                    if (amount < 1)
                        throw new VustError('Cannot increment less than "1"');
                    if (typeof data[key] !== 'number')
                        throw new VustError(
                            `Key "${key}" is not a number to increment`
                        );

                    Object.defineProperty(data, key, {
                        value: data[key] + amount,
                        enumerable: true,
                    });
                }

                break;
            case UpdateOperators.Decrement:
                if (!isPlainObject(value))
                    throw new VustError(
                        `Expected a mapped object of numbers in operator "${UpdateOperators.Decrement}"`
                    );

                for (const [key, amount] of Object.entries(value)) {
                    if (typeof amount !== 'number')
                        throw new VustError(
                            'Cannot decrement non-number values'
                        );
                    if (amount < 1)
                        throw new VustError('Cannot decrement less than "1"');
                    if (typeof data[key] !== 'number')
                        throw new VustError(
                            `Key "${key}" is not a number to decrement`
                        );

                    Object.defineProperty(data, key, {
                        value: data[key] - amount,
                        enumerable: true,
                    });
                }

                break;
            default:
                Object.defineProperty(data, operator, {
                    value,
                    enumerable: true,
                });
        }
    }

    if (typeof options[UpdateOperators.Compose] === 'function')
        options[UpdateOperators.Compose](data);

    return data;
};
