import React from 'react'
import { ethers } from 'ethers';

export default function ButtonSimpleRPC({ contract, player, method }) {

    const { ethereum } = window;

    const rpcMethod = async () => {
        try {
            // Get provider through ethers using ethereum provided by Metamask.
            const provider = new ethers.providers.Web3Provider(ethereum);

            // Get current signer (user) from Metamask through the provider
            const signer = provider.getSigner();
            const signerAddress = await signer.getAddress();

            // Instantiate the application contract
            const tokenContract = new ethers.Contract(contract.contractAddress, contract.abi, signer);

            // Connect and sign contract using signer
            const signedContract = tokenContract.connect(signer);

            // Initializing transaction requested
            console.log("Initializing transaction...")
            let transaction = await signedContract[method]();

            console.log(transaction);

        }
        catch (err) {
            console.error(err);
        }
    }


    return (
        <div>
            <button onClick={rpcMethod} className='connected-btn mock-btn'> Log [{method}] </button>
        </div>
    )


}
