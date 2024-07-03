import isPlainObject from 'is-plain-obj';
import { PartialRecord } from '../../typings/utils';
import {
    BitwiseUpdateOperators,
    BitwiseUpdateOptions,
} from '../../typings/query';

export const isBitwiseUpdateOptions = (
    value: unknown
): value is PartialRecord<keyof BitwiseUpdateOptions, number> =>
    isPlainObject(value) &&
    (BitwiseUpdateOperators.Or in value ||
        BitwiseUpdateOperators.And in value ||
        BitwiseUpdateOperators.Xor in value);
