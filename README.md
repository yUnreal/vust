# Vust

The modern and secure local TypeScript database

## Why?

This local database aims to guide new developers to learn how to use NoSQL database

-   You need to have the [Node.js](http://nodejs.org/) installed

Next step is install the wasp library:

```bash
npm install wasp --save
```

## Create a Schema

Vust has full support to TypeScript, so you can create a schema based in a interface or type. Schemas are the way how Vust must manage/validate the data.

```ts
interface User {
    name: string;
    age: number;
}

const userSchema = new Schema<User>({
    name: S.string(),
    age: S.number().integer({ message: 'Age must be an integer!' }),
});
```

Now we have our schema that has 2 keys (`name` and `age`), that is how our data will be saved. Now we have to create our collection to save/read/find/update the data.

```ts
const users = collection('users', userSchema);
```

The collection is where the magic happens, where our documents will be saved, created, updated, deleted and found. Each document has all properties declared in the Schema and an unique identifier (`_uid`) used in the collection.

Let's create a new user:

```ts
const { data } = users.create({
    username: 'Drezzy',
    age: 18,
});

console.log(`User name is: ${data.username}`);
```

Finding the user:

```ts
const drezzy = users.findUnique({ query: { username: 'Drezzy' } });

console.log(drezzy.data.age);
```

Deleting the user:

```ts
users.deleteOne({ _uid: drezzy._uid });

// Or we can just delete by the user document

drezzy.delete();
```

Updating the user:

```ts
const { data: newDrezzy } = users.updateOne(
    { query: { Greater: { age: 17 } } },
    { Increment: { age: 1 } }
);

console.log(`Now "${newDrezzy.username}" is ${newDrezzy.age} years old!`);
```

### Congrats

Now you know how to manage any data with Vust!

## Managing the data by yourself

Vust let you to manage the data by yourself, like reading and updating any data in a JSON file. For it, use `JSONDriver` driver.

```ts
import { JSONDriver } from 'vust';

const users = new JSONDriver('./database/users.json');

users.update((currentData) => (currentData['Me'] = { username: 'John' }));

// Will print something like: `{ "Me": { "username": "John" } }`
console.log(users.read());
```

## Schema

As you read above, schemas are the way that Vust knows how to save the data in the database.

### Types

Vust has a huge variety of types for schemas:

-   Any: `S.any()` (Represents any value)
-   BigInt: `S.bigint()` (Represents a bigint)
-   Boolean: `S.boolean()` (Represents a boolean)
-   Date: `S.date()` (Represents any valid date)
-   Literal: `S.literal(<V>)` (Reprents a literal value, a value that never change)
-   Number: `S.number()` (Represents a number, float or integer)
-   Object: `S.object(<Shape>)` (Represents a shaped object)
-   Record: `S.record(<Key>, <Value>)` (Represents **any** object)
-   String: `S.string()` (Represents a string)
-   UUID: `S.id()` (Represents the unique identifier of a document)
-   Unions: `S.union(...<Unions>)` (Represents a union of values)
-   Array: `S.array(...<Items>)` (Represents an array)
-   Tuple: `S.tuple(...<Items>)` (Represents a tuple)
-   Buffer: `S.buffer()` (Represents a buffer)

#### Unions

Unions are custom schema keys that can be of a type or another type. Example:

```ts
interface User {
    name: string;
    age: number | string;
}

new Schema<User>({
    name: S.string(),
    age: S.union(S.string(), S.number()),
});
```

-   Here the key `age` can be a string or a number.

#### Literal

Literal schema key reprents a literal value, a value that never changes

```ts
interface Me {
    name: 'John';
    age: number;
}

new Schema<Me>({
    age: S.literal('John'),
    age: S.number().integer(),
});
```

#### Object

Object schema key represents a shaped object

```ts
interface Post {
    content: string;
    author: {
        id: string;
        name: string;
    };
}

new Schema<Post>({
    content: S.string().min(50),
    author: S.object({
        id: S.string(),
        name: S.string(),
    }),
});
```

#### Record

Record schema key represents **any** object

```ts
interface User {
    name: string;
    children: Record<string, { age: number }>;
}

new Schema<User>({
    name: S.string(),
    children: S.record(S.string(), S.object({ age: S.number() })),
});
```

#### Array

Array schema key represents any array

```ts
interface StartWars {
    jedis: ({ name: string } | string)[];
}

new Schema<StarWars>({
    jedis: S.array(S.object({ name: S.string() }), S.string()),
});
```

#### Tuple

Tuple schema key represents a tuple

```ts
interface Candy {
    name: string;
    specs: [is_sweet: true, ingredients: string];
}

new Schema<Candy>({
    name: S.string(),
    specs: S.tuple(S.literal(true), S.string()),
});
```

## Congrats

Now you know the basic of Vust!

## Support

If you need help with Vust, join in our [Discord Server](https://discord.gg/J2YBETNw)!
