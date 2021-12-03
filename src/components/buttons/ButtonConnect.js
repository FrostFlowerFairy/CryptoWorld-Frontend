import React from 'react'

export default function ButtonConnect({ callable }) {
    return (
        <div>
            <button onClick={callable} className='connected-btn'> Connect Metamask </button>
        </div>
    )
}
