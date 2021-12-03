import ButtonComplexRPC from "./buttons/ButtonComplexRPC";
import ButtonSimpleRPC from "./buttons/ButtonSimpleRPC";
import WorkButton from "./buttons/WorkButton";
import ClaimRewardsButton from "./buttons/ClaimRewardsButton";

export default function PlayerPanel({ contract, player, workHandler, claimReward }) {
    console.log(player)
    return (
        <div>
            <div className="player-info-panel">
                <p><strong>Balance</strong>: {player.balance}</p>
                <p><strong>Unclaimed Rewards</strong>: {player.unclaimedRewards}</p>
            </div>
            <div className='buttons-clm'>
                <WorkButton player={player} functionCall={workHandler} />
                <ClaimRewardsButton player={player} functionCall={claimReward} />

                <ButtonComplexRPC contract={contract} method={'players'} />
                <ButtonComplexRPC contract={contract} method={'canWork'} />

                <ButtonSimpleRPC contract={contract} method={'getUnixDay'} />
                <ButtonSimpleRPC contract={contract} method={'devResetWork'} />
            </div>
        </div>
    )
}