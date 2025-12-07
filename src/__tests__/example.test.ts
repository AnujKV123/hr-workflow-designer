import { describe, it } from 'vitest'
import * as fc from 'fast-check'

describe('fast-check setup verification', () => {
  it('should verify fast-check is working', () => {
    fc.assert(
      fc.property(
        fc.integer(),
        fc.integer(),
        (a, b) => {
          return a + b === b + a // commutative property
        }
      ),
      { numRuns: 100 }
    )
  })
})
