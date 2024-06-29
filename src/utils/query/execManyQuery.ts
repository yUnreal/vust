import { DeleteManyOptions, FindManyOptions } from '../../typings/collection';
import { AnyObject } from '../../typings/utils';
import { execQuery } from './execQuery';

export const execManyQuery = (
    query: FindManyOptions<AnyObject> | DeleteManyOptions<AnyObject>,
    data: Record<string, AnyObject>,
    docs: AnyObject[] = []
): AnyObject[] => {
    const foundDoc = execQuery(query, data);

    if (!foundDoc) return docs;

    const { doc, index } = foundDoc;

    docs.push(doc);

    if (query.limit === docs.length || index === Object.keys(data).length - 1)
        return docs;

    return execManyQuery({ ...query, skip: index + 1 }, data, docs);
};
