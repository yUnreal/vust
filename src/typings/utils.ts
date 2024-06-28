// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>;

export type DeepPartial<T> = {
    [K in keyof T]?: DeepPartial<T[K]>;
};

export type PartialRecord<K extends PropertyKey, V> = {
    [Key in K]?: V;
};

export type IsLiteral<T> = [T] extends [string | boolean | number | bigint]
    ? string extends T
        ? false
        : boolean extends T
        ? false
        : number extends T
        ? false
        : bigint extends T
        ? false
        : true
    : false;

// eslint-disable-next-line @typescript-eslint/ban-types
export type IsRecord<R extends AnyObject> = {} extends R ? true : false;

export type Find<T, V> = {
    [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

export type IsUnion<T, U extends T = T> = T extends unknown
    ? [U] extends [T]
        ? false
        : true
    : false;

export type IsTuple<T> = T extends [any, ...any] ? true : false;
