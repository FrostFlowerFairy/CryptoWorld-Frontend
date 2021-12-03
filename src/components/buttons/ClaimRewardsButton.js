import React from 'react'

export default function ClaimRewardsButton(props) {

    const { ethereum } = window;

    if (props.player.unclaimedRewards != "No rewards accumulated.") {
        return (
            <button onClick={() => { props.functionCall(ethereum) }} className='connected-btn'> Claim Rewards </button>
        )
    } else {
        return (
            <button disabled onClick={() => { props.functionCall(ethereum) }} className='disabled-btn'> Claim Rewards </button>
        )
    }


}
