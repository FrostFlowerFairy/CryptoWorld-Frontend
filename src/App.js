import { useEffect, useState, useCallback } from 'react';
import './App.css';
import { ethers } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber';

// Contract and ABI Import
import contractJSON from "./contracts/DarkIce.json";


import Layout from './components/Layout';
import PlayerPanel from './components/PlayerPanel';
import ButtonConnect from './components/buttons/ButtonConnect';
import Loading from './components/Loading';




const contractAddress = "0x729A45a9fd2Da1a266765b7f8422D5722FBa0803";
const abi = contractJSON.abi;
const contract = { contractAddress, abi }

// Constants
const BSC_TXN_DETAILS_URL = "https://testnet.bscscan.com/tx/"

function App() {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [isWalletConnected, setIsWalletConnected] = useState(false);

    const [playerBalance, setPlayerBalance] = useState(0);
    const [playerRewards, setPlayerRewards] = useState(0);
    const [player, setPlayer] = useState(0);
    const [isLoading, setIsLoading] = useState(0);


    const checkWalletIsConnected = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Needs metamask intalled.")
            return;

        } else {
            console.log("Wallet detected.")
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account.");
            setIsWalletConnected(true);
            setCurrentAccount(account);
        } else {
            console.log("No authorized account found");
        }
    }

    const connectWalletHandler = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            alert("Please install metamask.");
        }

        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Found an account: ", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (err) {
            console.log(err)
        }
    }

    const claimReward = async (ethereum) => {
        try {
            // Get provider through ethers using ethereum provided by Metamask.
            const provider = new ethers.providers.Web3Provider(ethereum);

            // Get current signer (user) from Metamask through the provider
            const signer = provider.getSigner();
            const signerAddress = await signer.getAddress();

            // Instantiate the application contract
            const tokenContract = new ethers.Contract(contractAddress, abi, signer);

            // Connect and sign contract using signer
            const signedContract = tokenContract.connect(signer);

            // Verify allowance
            console.log("Verifying signer allowance...")
            let allowance_txn = await signedContract.allowance(signerAddress, tokenContract.address)
            const power = BigNumber.from(10).pow(18)
            const allowance = BigNumber.from(allowance_txn).div(power).toString()

            // If user has 0 allowance, make a request to it.
            if (allowance === "0") {
                console.log("Sending approval request for signer")
                let total_supply = await signedContract.totalSupply();
                let approve_txn = await signedContract.approve(tokenContract.address, total_supply)
                await approve_txn.wait();
                console.log(`Allowance transaction successful: ${BSC_TXN_DETAILS_URL}${approve_txn.hash}`)
            }

            // Redundancy verify of allowance
            console.log("Allowance updated?")
            console.log("Verifying signer allowance...")
            const _allowance_txn = await signedContract.allowance(signerAddress, tokenContract.address)

            const _allowance = BigNumber.from(_allowance_txn).div(power).toString()

            console.log(_allowance)

            // Initializing transaction requested
            console.log("Initializing transaction...")
            // let value = BigNumber.from(10).pow(18).mul(5);
            let transaction = await signedContract.claimReward();

            // Wait transaction log
            console.log(`Waiting for transaction to be mined.`);
            await transaction.wait();

            console.log(`Transaction mined successfully:\nURL: ${BSC_TXN_DETAILS_URL}${transaction.hash}`);
            updatePlayerValues();
        }
        catch (err) {
            console.log(`Error caught:`)
            console.log(err)
        }
    }

    const workHandler = async (ethereum) => {
        try {
            // Get provider through ethers using ethereum provided by Metamask.
            const provider = new ethers.providers.Web3Provider(ethereum);

            // Get current signer (user) from Metamask through the provider
            const signer = provider.getSigner();

            // Instantiate the application contract
            const tokenContract = new ethers.Contract(contractAddress, abi, signer);

            // Connect and sign contract using signer
            const signedContract = tokenContract.connect(signer);

            // Initializing transaction requested
            console.log("Initializing transaction...")

            // let value = BigNumber.from(10).pow(18).mul(5);
            let transaction = await signedContract.work();

            // Wait transaction log
            console.log(`Waiting for transaction to be mined.`);
            await transaction.wait();

            console.log(transaction)

            console.log(`Transaction mined successfully:\nURL: ${BSC_TXN_DETAILS_URL}${transaction.hash}`);

            updatePlayerValues();
        }
        catch (err) {
            console.log(`Error caught:`)
            console.log(err)
        }
    }


    const updatePlayerValues = async () => {


        const { ethereum } = window;
        if (!ethereum) {
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const signerAddress = await signer.getAddress();
            const tokenContract = new ethers.Contract(contractAddress, abi, signer);
            const signerContract = tokenContract.connect(signer);

            let balance = await signerContract.balanceOf(signerAddress);

            console.log(balance)

            const power = BigNumber.from(10).pow(18)
            const decPow = BigNumber.from(10).pow(14)

            const _balance = BigNumber.from(balance).div(power).toString()
            const balanceDecimals = BigNumber.from(balance).div(decPow).toString()
            const _balanceDecimals = balanceDecimals.substring(balanceDecimals.length - 4, balanceDecimals.length)


            let rewardsTxn = await signerContract.accumulatedRewards(signerAddress)


            const _rewards = BigNumber.from(rewardsTxn).div(power).toString()
            const rewardsDecimals = BigNumber.from(rewardsTxn).div(decPow).toString()
            const _rewardsDecimals = rewardsDecimals.substring(rewardsDecimals.length - 4, rewardsDecimals.length)


            let getPlayerTxn = await signerContract.players(signerAddress)
            let canWork = await signerContract.canWork(signerAddress)


            let balanceDisplay;
            if (_balance == "0") balanceDisplay = "Out of stock of Black Ice."
            else balanceDisplay = _balance + _balanceDecimals + " grams of Dark Ice."

            let rewardDisplay;
            if (_rewards == "0") rewardDisplay = "No rewards accumulated."
            else rewardDisplay = _rewards + "." + _rewardsDecimals + " grams of Dark Ice."

            setPlayer({
                level: getPlayerTxn.level,
                economicLevel: getPlayerTxn.economicLevel,
                lastWorked: getPlayerTxn.lastWorked,
                balance: balanceDisplay,
                unclaimedRewards: rewardDisplay,
                canWork
            });

        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        checkWalletIsConnected();
    }, []);


    useEffect(() => {
        setIsLoading(true);
        updatePlayerValues();
        setIsLoading(false);
    }, [isWalletConnected]);



    return (
        <div className='main-app'>
            <Layout>
                <h1>Winter Fate</h1>
                {
                    isLoading ?
                        <Loading /> :
                        <div>
                            {currentAccount ?
                                <PlayerPanel
                                    contract={contract}
                                    player={player}
                                    workHandler={workHandler}
                                    claimReward={claimReward}
                                    isLoading={isLoading} /> :
                                <ButtonConnect callable={connectWalletHandler} />}
                        </div>

                }

            </Layout>
        </div >

    )
}

export default App;
