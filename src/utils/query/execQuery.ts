/* eslint-disable indent */
import isPlainObject from 'is-plain-obj';
import { QueryOperators, QueryOptions } from '../../typings/query';
import { AnyObject } from '../../typings/utils';
import isEqual from 'lodash.isequal';
import { VustError } from '../../errors/VustError';

export const execQuery = (
    { query, skip }: QueryOptions<AnyObject>,
    data: Record<string, AnyObject>
) => {
    for (const doc of Object.values(data).slice(skip ?? 0)) {
        let isMatch = true;

        for (const [key, value] of Object.entries(query)) {
            if (
                (key === QueryOperators.Where && typeof value !== 'function') ||
                (key !== QueryOperators.Where &&
                    Object.values(QueryOperators).includes(
                        <QueryOperators>key
                    ) &&
                    !isPlainObject(value))
            )
                throw new VustError(`Invalid operator "${key}" query`);

            switch (key) {
                case QueryOperators.Comment:
                    continue;
                case QueryOperators.Equal:
                    for (const [crrKey, crrValue] of Object.entries(value)) {
                        if (!isEqual(doc[crrKey], crrValue)) {
                            isMatch = false;

                            break;
                        }
                    }
                    break;
                case QueryOperators.NotEqual:
                    for (const [crrKey, crrValue] of Object.entries(value)) {
                        if (isEqual(doc[crrKey], crrValue)) {
                            isMatch = false;

                            break;
                        }
                    }
                    break;
                case QueryOperators.Greater:
                    for (const [crrKey, crrValue] of Object.entries(value)) {
                        if (doc[crrKey] < Number(crrValue)) {
                            isMatch = false;

                            break;
                        }
                    }

                    break;
                case QueryOperators.GreaterThan:
                    for (const [crrKey, crrValue] of Object.entries(value)) {
                        if (doc[crrKey] <= Number(crrValue)) {
                            isMatch = false;

                            break;
                        }
                    }

                    break;
                case QueryOperators.LessThan:
                    for (const [crrKey, crrValue] of Object.entries(value)) {
                        if (doc[crrKey] >= Number(crrValue)) {
                            isMatch = false;

                            break;
                        }
                    }

                    break;
                case QueryOperators.Less:
                    for (const [crrKey, crrValue] of Object.entries(value)) {
                        if (doc[crrKey] > Number(crrValue)) {
                            isMatch = false;

                            break;
                        }
                    }

                    break;
                case QueryOperators.Length:
                    for (const [crrKey, crrValue] of Object.entries(value)) {
                        if (doc[crrKey].length !== crrValue) {
                            isMatch = false;

                            break;
                        }
                    }

                    break;
                case QueryOperators.Pattern:
                    for (const [crrKey, crrValue] of Object.entries(value)) {
                        if (!crrValue.test(doc[crrKey])) {
                            isMatch = false;

                            break;
                        }
                    }

                    break;
                case QueryOperators.Where:
                    if (!value(doc)) {
                        isMatch = false;

                        break;
                    }

                    break;
                default:
                    if (!isEqual(doc[key], value)) isMatch = false;

                    break;
            }

            if (!isMatch) break;
        }

        if (isMatch) return doc;
    }

    return null;
};
