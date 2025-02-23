import { providers } from 'ethers'
import { writeFile } from 'fs/promises'

import {
  ACROSS_BRIDGE_NAME,
  getAcrossBridgeParameters,
} from '../projects/acrossBridge'
import { ARBITRUM_NAME, getArbitrumParameters } from '../projects/arbitrum'
import { AZTEC_NAME, getAztecParameters } from '../projects/aztec'
import { CBRIDGE_NAME, getCBridgeParameters } from '../projects/cBridge'
import { DYDX_NAME, getDydxParameters } from '../projects/dYdX'
import { getHopParameters, HOP_NAME } from '../projects/hop'
import {
  getLayer2FinanceZkParameters,
  L2FZK_NAME,
} from '../projects/layer2FinanceZk'
import { getLoopringParameters, LOOPRING_NAME } from '../projects/loopring'
import { getNovaParameters, NOVA_NAME } from '../projects/nova'
import {
  getOmgNetworkParameters,
  OMG_NETWORK_NAME,
} from '../projects/omgNetwork'
import { getOptimismParameters, OPTIMISM_NAME } from '../projects/optimism'
import {
  getOrbitBridgeParameters,
  ORBIT_BRIDGE_NAME,
} from '../projects/orbitBridge'
import {
  getPolynetworkBridgeParameters,
  POLYNETWORK_BRIDGE_NAME,
} from '../projects/polynetworkBridge'
import {
  getSolletBridgeParameters,
  SOLLET_BRIDGE_NAME,
} from '../projects/solletBridge'
import { getStarkNetParameters, STARK_NET_NAME } from '../projects/starknet'
import { getSynapseParameters, SYNAPSE_NAME } from '../projects/synapse'
import { getZkSpaceParameters, ZK_SPACE_NAME } from '../projects/zkSpace'
import { getZkSwap1Parameters, ZK_SWAP_1_NAME } from '../projects/zkSwap1'
import { getZkSwap2Parameters, ZK_SWAP_2_NAME } from '../projects/zkSwap2'
import { getZkSyncParameters, ZK_SYNC_NAME } from '../projects/zkSync'
import { ProjectParameters } from '../types'
import { getEnv } from './getEnv'
import { exitWithUsage } from './usage'

type GetParameters = (
  provider: providers.JsonRpcProvider,
) => Promise<ProjectParameters>

export async function analyze(projects: string[]) {
  const provider = new providers.AlchemyProvider(
    'mainnet',
    getEnv('ALCHEMY_API_KEY'),
  )

  const items: [string, GetParameters][] = [
    [ZK_SYNC_NAME, getZkSyncParameters],
    [ZK_SWAP_1_NAME, getZkSwap1Parameters],
    [ZK_SWAP_2_NAME, getZkSwap2Parameters],
    [ZK_SPACE_NAME, getZkSpaceParameters],
    [ARBITRUM_NAME, getArbitrumParameters],
    [STARK_NET_NAME, getStarkNetParameters],
    [HOP_NAME, getHopParameters],
    [LOOPRING_NAME, getLoopringParameters],
    [OPTIMISM_NAME, getOptimismParameters],
    [NOVA_NAME, getNovaParameters],
    [DYDX_NAME, getDydxParameters],
    [POLYNETWORK_BRIDGE_NAME, getPolynetworkBridgeParameters],
    [SOLLET_BRIDGE_NAME, getSolletBridgeParameters],
    [ORBIT_BRIDGE_NAME, getOrbitBridgeParameters],
    [SYNAPSE_NAME, getSynapseParameters],
    [CBRIDGE_NAME, getCBridgeParameters],
    [AZTEC_NAME, getAztecParameters],
    [OMG_NETWORK_NAME, getOmgNetworkParameters],
    [L2FZK_NAME, getLayer2FinanceZkParameters],
    [ACROSS_BRIDGE_NAME, getAcrossBridgeParameters],
  ]

  const unknownArguments = projects.filter(
    (x) => !items.some((y) => y[0] === x),
  )

  if (unknownArguments.length > 0) {
    exitWithUsage(`Unknown argument ${unknownArguments[0]}`)
  }

  const filtered = items.filter(
    (x) => projects.length === 0 || projects.some((y) => y === x[0]),
  )

  const results = await Promise.all(filtered.map((x) => x[1](provider)))

  for (const project of results) {
    await writeFile(
      `dist/${project.name}.json`,
      JSON.stringify(project, null, 2),
    )
  }
}
