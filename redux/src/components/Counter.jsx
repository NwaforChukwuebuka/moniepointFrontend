import React, { memo } from 'react'
import { increment, decrement } from '../slice/counterSlice'
import { useDispatch, useSelector } from 'react-redux'

const Counter = () => {
    const value = useSelector((state) => state.counter.count);
    const dispatch = useDispatch();

  return (
    <div>
        <p>Count: {value}</p>
        <button onClick={() => dispatch(increment())}>increment+</button>
        <button onClick={() => dispatch(decrement())}>decrement-</button>
    </div>
  )
}

export default memo(Counter)
