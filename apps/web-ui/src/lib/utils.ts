import { createSearchParams } from "react-router-dom"

export const createConditionalObject = (
   ...tuple: [string | number | symbol, any, boolean?][]
) => {
   const obj: any = {}

   for (let i = 0; i < tuple.length; i++) 
      if (tuple[i][2] === undefined || tuple[i][2]) obj[tuple[i][0]] = tuple[i][1]
   

   return obj
}

/**
 * @parameters ...[key, value, condition]
 */
export const createQuery = <T extends string | number = string | number>(
   ...tuple: Parameters<typeof createConditionalObject>
) => `?${createSearchParams(createConditionalObject(...tuple) as Record<T, string>)}`

/**
 * Sort: my01.jpg my02.jpg .. my10.jpg
 * Instead of: my01.jpg my10.jpg my02.jpg...
 * Usage: list.sort(sortAlphaNum);
 * @param a: string
 * @param b: string
 * @returns 0 | 1 | -1
 */
export const sortAlphaNum = (a: string, b: string) => {
   const alphaRegex = /[^a-zA-Z]/g
   const numRegex = /[^0-9]/g

   const aA = a.replace(alphaRegex, "")
   const bA = b.replace(alphaRegex, "")
   if (aA === bA) {
      const aN = parseInt(a.replace(numRegex, ""), 10)
      const bN = parseInt(b.replace(numRegex, ""), 10)
      return aN === bN ? 0 : aN > bN ? 1 : -1
   } 
      return aA > bA ? 1 : -1
   
}

/**
 * Alias for createConditionalObject
 */
export const cco = createConditionalObject

const appUtils = { createConditionalObject, cco, sortAlphaNum }

export default appUtils
