/* eslint-disable indent */
import { VustError } from '../../errors/VustError';
import { QueryOperators, QueryOptions } from '../../typings/query';
import { AnyObject } from '../../typings/utils';
import isEqual from 'lodash.isequal';

export const execQuery = (
    { query, skip }: QueryOptions<AnyObject>,
    data: Record<string, AnyObject>
) => {
    for (const doc of Object.values(data).slice(skip ?? 0)) {
        let isMatch = true;

        for (const [key, value] of Object.entries(query)) {
            switch (key) {
                case QueryOperators.Comment:
                    continue;
                case QueryOperators.Or: {
                    const foundDoc = value.find(
                        (operation: QueryOptions<AnyObject>['query']) =>
                            execQuery({ query: operation }, data)
                    );

                    return foundDoc ?? null;
                }
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
                case QueryOperators.GreaterThanEqual:
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
                case QueryOperators.LessThanEqual:
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
                        if (!(crrValue instanceof RegExp))
                            throw new VustError(
                                `Expected a regular expression in key "${crrKey}" in operator "${QueryOperators.Pattern}"`
                            );

                        if (!crrValue.test(doc[crrKey])) {
                            isMatch = false;

                            break;
                        }
                    }

                    break;
                case QueryOperators.In:
                    for (const [crrKey, crrValue] of Object.entries(value)) {
                        if (!Array.isArray(crrValue))
                            throw new VustError(
                                `Expected an array in key "${crrKey}" in operator "${QueryOperators.In}"`
                            );
                        if (!crrValue.includes(doc[crrKey])) {
                            isMatch = false;

                            break;
                        }
                    }

                    break;
                case QueryOperators.NotIn:
                    for (const [crrKey, crrValue] of Object.entries(value)) {
                        if (!Array.isArray(crrValue))
                            throw new VustError(
                                `Expected an array in key "${crrKey}" in operator "${QueryOperators.NotIn}"`
                            );
                        if (crrValue.includes(doc[crrKey])) {
                            isMatch = false;

                            break;
                        }
                    }

                    break;
                case QueryOperators.Type:
                    for (const [crrKey, crrValue] of Object.entries(value)) {
                        if (typeof crrValue !== 'string')
                            throw new VustError(
                                `Expected the type name in key "${crrKey}" in operator "${QueryOperators.Type}"`
                            );

                        if (typeof doc[crrKey] !== crrValue) {
                            isMatch = false;

                            break;
                        }
                    }

                    break;
                case QueryOperators.Exists:
                    for (const [crrKey, exists] of Object.entries(value)) {
                        if (
                            (exists && !(crrKey in doc)) ||
                            (!exists && crrKey in doc)
                        ) {
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
