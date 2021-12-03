import React from 'react'

export default function WorkButton(props) {

    const { ethereum } = window;


    if (props.player.canWork) {
        return (
            <button onClick={() => { props.functionCall(ethereum) }} className='connected-btn'> Work </button>
        )
    } else {
        return (
            <button disabled onClick={() => { props.functionCall(ethereum) }} className='disabled-btn'> Work </button>
        )
    }


}
