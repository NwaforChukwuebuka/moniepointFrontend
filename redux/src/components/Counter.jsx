import React, { memo } from 'react'
import { increment, decrement } from '../slice/counterSlice'
import { useDispatch, useSelector } from 'react-redux'

const Counter = () => {
    const value = useSelector((state) => state.counter.count);
    console.log(value)
  return (
    <div>
        <p>Count: 0</p>
        <button>+</button>
        <button>-</button>
    </div>
  )
}

export default memo(Counter)
