import { BaseDriver } from '../typings/collection';
import { AnyObject } from '../typings/utils';
import { VustError } from './VustError';

export class DriverError extends VustError {
    public constructor(
        message: string,
        /**
         * The driver that the error belongs to
         */
        public driver: BaseDriver<AnyObject>
    ) {
        super(message);
    }
}
