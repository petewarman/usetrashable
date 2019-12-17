import React, { useEffect } from "react";
import makeTrashable from "trashable";

const genUid = () =>
  "_" +
  Math.random()
    .toString(36)
    .substr(2, 9);

function usePromise() {
  const promiseStore = {};

  const addToStore = (key, promise) => {
    promiseStore[key] = promise;
  };

  const removeFromStore = key => {
    delete promiseStore[key];
  };

  useEffect(
    () => () => {
      Object.entries(promiseStore).forEach(([key, wrappedPromise]) => {
        wrappedPromise.trash();
        removeFromStore(key);
      });
    },
    []
  );

  return promise => {
    const key = genUid();
    const wrappedPromise = makeTrashable(promise);
    addToStore(key, wrappedPromise);
    return wrappedPromise.then(
      val => {
        removeFromStore(key);
        return val;
      },
      err => {
        removeFromStore(key);
        return err;
      }
    );
  };
}

export default usePromise;
