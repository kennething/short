type Success<T> = {
  data: T;
  error?: never;
};
type Failure<E> = {
  data?: never;
  error: E;
};
export type Result<T, E = Error> = Success<T> | Failure<E>;

/** Implements try/catch for a given promise.
 *
 * If the promise resolves, returns an object with a `data` property. If the promise rejects, returns an object with an `error` property.
 * @template E - the type of error to return. Defaults to `Error`.
 * @param promise - the promise to implement try/catch for.
 * @example
 * const { data, error } = await tryCatch(getData());
 * if (error) return; // handle the error
 * doSomething(data); // data can now be used
 */
export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data };
  } catch (error) {
    return { error: error as E };
  }
}

/**
 * Returns a random integer between `min` and `max`.
 *
 * @param min - The minimum value of the random integer.
 * @param max - The maximum value of the random integer.
 * @example getRandomInt(1, 10) -> 5
 */
export function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

/**
 * Returns a random character from a string.
 *
 * @param iter - The string to get a random character from.
 * @example getRandomItem("abc") -> "b"
 */
export function getRandomItem(iter: string): string;
/**
 * Returns a random item from an array.
 *
 * @param iter - The array to get a random item from.
 * @example getRandomItem([1, 2, 3, 4, 5]) -> 3
 */
export function getRandomItem<T>(iter: T[]): T;
export function getRandomItem<T>(iter: T[] | string) {
  return iter[getRandomInt(0, iter.length - 1)];
}
