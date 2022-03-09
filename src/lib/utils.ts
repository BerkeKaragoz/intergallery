import { createSearchParams } from "react-router-dom";

export const createConditionalObject = (
  ...tuple: [string | number | symbol, any, boolean?][]
) => {
  const obj: any = {};

  for (let i = 0; i < tuple.length; i++) {
    if (tuple[i][2] === undefined || tuple[i][2])
      obj[tuple[i][0]] = tuple[i][1];
  }

  return obj;
};

/**
 * @parameters ...[key, value, condition]
 */
export const createQuery = <T extends string | number = string | number>(
  ...tuple: Parameters<typeof createConditionalObject>
) =>
  `?${createSearchParams(
    createConditionalObject(...tuple) as Record<T, string>,
  )}`;

/**
 * Alias for createConditionalObject
 */
export const cco = createConditionalObject;

const appUtils = { createConditionalObject, cco };

export default appUtils;
