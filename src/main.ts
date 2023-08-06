import {TypeormDatabase} from '@subsquid/typeorm-store'
import {Contract, Transfer} from './model'
import {processor} from './processor'
import {isErc721} from './isErc721'
import * as erc721 from './abi/erc721'

processor.run(new TypeormDatabase({supportHotBlocks: false}), async (ctx) => {
    const knownNftContractsArray: Contract[] = await ctx.store.find(Contract, { where: { isAErc721Duck: true } })
    const knownNftContracts: Map<string, Contract> = new Map(knownNftContractsArray.map(c => [ c.address, c ]))
    const newNftContracts: Map<string, Contract> = new Map()

    const transfers: Transfer[] = []

    for (let block of ctx.blocks) {
        for (let trc of block.traces) {
            if (trc.type === 'create' && trc.result?.code && isErc721(trc.result.code)) {
                if (!trc.transaction) {
                    ctx.log.fatal(`ERROR: trace came without a parent transaction`)
                    console.log(trc)
                    process.exit(0)
                }
                let address = trc.result.address
                ctx.log.info(`Detected an NFT contract deployment at ${address}`)
                newNftContracts.set(address, new Contract({
                    id: address,
                    deploymentHeight: block.header.height,
                    deploymentTxn: trc.transaction.hash,
                    address,
                    isAErc721Duck: true
                }))
            }
        }
        for (let log of block.logs) {
            if (log.topics[0] === erc721.events.Transfer.topic) {
                let contract: Contract | undefined = knownNftContracts.get(log.address) ?? newNftContracts.get(log.address)
                if (contract) {
                    let {from, to, tokenId} = erc721.events.Transfer.decode(log)
                    transfers.push(new Transfer({
                        id: log.id,
                        contract,
                        from,
                        to,
                        tokenId
                    }))
                }
            }
        }
    }

    await ctx.store.upsert([...newNftContracts.values()])
    await ctx.store.upsert(transfers)
})
