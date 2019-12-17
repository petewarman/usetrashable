# usetrashable

A custom hook to cancel unresolved promises when a component unmounts to prevent memory leaks.

Learn more about garbage collection and `trashable` and why you should use it [here](https://github.com/hjylewis/trashable).

## Installation

```
npm install --save usetrashable
```

## How to use

```
import useTrashable from 'usetrashable';

const Component = (props) => {
    const registerPromise = usePromise();
    registerPromise(apiCall()).then(() => {
            // ...
        }).catch(() => {
            // ...
        });
}
```

## Gotchas

You need to register the promise **before** you add your `then` and `catch` handlers. Otherwise, you will not get the garbage collection benefits.

```
// Do this
const registeredPromise = registerPromise(promise);
registeredPromise.then(() => {});

// NOT this
const handledPromise = promise.then(() => {});
registerPromise(handledPromise);
```
