import bs58 from 'bs58'
import { BigNumber } from 'ethers'
import { task, types } from 'hardhat/config'
import { ActionType, HardhatRuntimeEnvironment } from 'hardhat/types'

import { EndpointId } from '@layerzerolabs/lz-definitions'

interface TaskArguments {
    delegate: string
    contractName: string
}

const action: ActionType<TaskArguments> = async (
    { delegate, contractName },
    hre: HardhatRuntimeEnvironment
) => {
    const signer = await hre.ethers.getNamedSigner('deployer')
    // @ts-ignore
    const token = (await hre.ethers.getContract(contractName)).connect(signer)

    console.log("Preparing to set delegate to: ", delegate)
    
    const estimatedGas = await token.estimateGas.setDelegate(delegate)
    
    console.log(estimatedGas)
    
    
    const txResponse = await token.functions.setDelegate(delegate)
    const txReceipt = await txResponse.wait()
    console.log(`Set delegate: ${delegate} at tx hash: ${txReceipt.transactionHash}`)
}

task('setDelegate', 'Set ', action)
    .addParam('delegate, 'Delegating oapp configuration permissions to this address', undefined, types.string, false)
    .addOptionalParam('contractName', 'Name of the contract in deployments folder', 'MyOFT', types.string)
