import React, { memo } from 'react'
import { useGetProductByIdQuery } from "../../apis/fakeStoreApi"
import { useParams } from "react-router"

const Product = () => {
    const {id} = useParams();

    const response = useGetProductByIdQuery(id)
    console.log(response)
  return (
    <div>Product</div>
  )
}

export default memo(Product)
