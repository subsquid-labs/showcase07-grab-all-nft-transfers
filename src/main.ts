import {TypeormDatabase} from '@subsquid/typeorm-store'
import {Burn} from './model'
import {processor} from './processor'
import {isErc721} from './isErc721'

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {

    if (isErc721(baycbytecode)) {
        console.log('is a 721')
    } else {
        console.log('is not a 721')
    }
    process.exit(0)
/*
    const burns: Burn[] = []
    for (let c of ctx.blocks) {
        for (let tx of c.transactions) {
            // decode and normalize the tx data
            burns.push(
                new Burn({
                    id: tx.id,
                    block: c.header.height,
                    address: tx.from,
                    value: tx.value,
                    txHash: tx.hash,
                })
            )
        }
    }
    // apply vectorized transformations and aggregations
    const burned = burns.reduce((acc, b) => acc + b.value, 0n) / 1_000_000_000n
    const startBlock = ctx.blocks.at(0)?.header.height
    const endBlock = ctx.blocks.at(-1)?.header.height
    ctx.log.info(`Burned ${burned} Gwei from ${startBlock} to ${endBlock}`)

    // upsert batches of entities with batch-optimized ctx.store.save
    await ctx.store.upsert(burns)
*/
})
