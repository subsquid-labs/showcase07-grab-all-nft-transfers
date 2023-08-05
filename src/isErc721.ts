import * as ethers from 'ethers'
import * as erc721 from './abi/erc721'

/**
 * A rather crude test for whether a deployed contract implements ERC721. Limitations:
 * - will return a false negative on proxy contracts;
 * - will return a false positive on contracts deliberately pretending to comply to
 *   ERC721 using constants (see https://ethereum.stackexchange.com/questions/124084/).
 *
 * If your use case requires good performance on these types of contracts, consider
 * implementing solutions based on the estimateGas call or contract simulation
 * (e.g. https://ethereum.stackexchange.com/a/152147).
 */
export function isErc721(bytecode: string): boolean {
    for (let fname in erc721.functions) {
        let fsighash = erc721.functions[fname as keyof typeof erc721.functions].sighash.slice(2, 10)
        if (!bytecode.includes(fsighash)) {
            return false
        }
    }
    return true
}
