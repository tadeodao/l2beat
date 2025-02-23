import { EthereumAddress } from '@l2beat/types'
import { utils } from 'ethers'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { ContractValue } from '../../types'
import { Handler, HandlerResult } from '../Handler'
import { callMethod } from '../utils/callMethod'
import { toFunctionFragment } from '../utils/toFunctionFragment'

export class LimitedArrayHandler implements Handler {
  readonly field: string
  private readonly fragment: utils.FunctionFragment

  constructor(
    fragment: string | utils.FunctionFragment,
    private readonly limit = 5,
  ) {
    this.fragment =
      typeof fragment === 'string' ? toFunctionFragment(fragment) : fragment
    this.field = this.fragment.name
  }

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    const results = await Promise.all(
      Array.from({ length: this.limit }).map((_, index) =>
        callMethod(provider, address, this.fragment, [index]),
      ),
    )
    const value: ContractValue[] = []
    let error: string | undefined
    for (const result of results) {
      if (result.error !== undefined) {
        if (result.error !== 'Execution reverted') {
          error = result.error
        }
        break
      } else {
        value.push(result.value)
      }
    }

    if (!error) {
      if (value.length === this.limit) {
        return {
          field: this.field,
          value,
          error: 'Too many values. Update configuration explore fully',
        }
      } else {
        return { field: this.field, value }
      }
    }

    return { field: this.field, error }
  }
}
