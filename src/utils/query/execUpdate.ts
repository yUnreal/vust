/* eslint-disable indent */
import isPlainObject from 'is-plain-obj';
import { UpdateOperators, UpdateOptions } from '../../typings/query';
import { AnyObject } from '../../typings/utils';

export const execUpdate = <D extends AnyObject>(
    data: D,
    options: UpdateOptions<D>
) => {
    for (const [operator, value] of Object.entries(options)) {
        switch (operator) {
            case UpdateOperators.Set:
                if (!isPlainObject(value))
                    throw new Error(
                        `Invalid value for "${UpdateOperators.Set}" operator`
                    );

                data = { ...data, ...value };

                break;
            case UpdateOperators.Remove:
                if (!Array.isArray(value))
                    throw new Error(
                        `Expected an array in operator "${UpdateOperators.Remove}"`
                    );

                for (const key of value) delete data[key];

                break;
            case UpdateOperators.Rename:
                if (!isPlainObject(value))
                    throw new Error(
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
                    throw new Error(
                        `Expected a mapped object of numbers in operator "${UpdateOperators.Increment}"`
                    );

                for (const [key, amount] of Object.entries(value)) {
                    if (typeof amount !== 'number')
                        throw new Error('Cannot increment non-number values');
                    if (amount < 1)
                        throw new Error('Cannot increment less than "1"');
                    if (typeof data[key] !== 'number')
                        throw new Error(
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
                    throw new Error(
                        `Expected a mapped object of numbers in operator "${UpdateOperators.Decrement}"`
                    );

                for (const [key, amount] of Object.entries(value)) {
                    if (typeof amount !== 'number')
                        throw new Error('Cannot decrement non-number values');
                    if (amount < 1)
                        throw new Error('Cannot decrement less than "1"');
                    if (typeof data[key] !== 'number')
                        throw new Error(
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

    return data;
};
