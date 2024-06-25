/* eslint-disable indent */
import { UpdateOperators, UpdateOptions } from '../../typings/query';
import { AnyObject } from '../../typings/utils';

export const execUpdate = <D extends AnyObject>(
    data: D,
    options: UpdateOptions<D>
) => {
    for (const [operator, value] of Object.entries(options)) {
        switch (operator) {
            case UpdateOperators.Set:
                data = { ...data, ...value };

                break;
            case UpdateOperators.Remove:
                for (const key of value) delete data[key];

                break;
            case UpdateOperators.Rename:
                for (const [key, newKey] of Object.entries(value)) {
                    Object.defineProperty(data, <string>newKey, {
                        value: data[key],
                        enumerable: true,
                    });

                    delete data[key];
                }

                break;
            case UpdateOperators.Increment:
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
