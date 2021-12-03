import React from 'react'

import Layout from './Layout'
import PlayerPanel from './PlayerPanel'
import ButtonConnect from './buttons/ButtonConnect'

export default function Main({ contract }) {
    return (
        <div className="main">
            <Layout>
                <h1>Winter Fate</h1>
                <div>
                    {currentAccount ?
                        <PlayerPanel
                            contract={contract}
                            player={player}
                            workHandler={workHandler}
                            claimReward={claimReward} /> :
                        <ButtonConnect callable={connectWalletHandler} />}
                </div>
            </Layout>
        </div>
    )
}
