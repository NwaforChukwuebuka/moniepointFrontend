import React, { memo } from 'react'
import { useGetAllProductsQuery } from "../../apis/fakeStoreApi"
import styles from "./products.module.css"
import { Link } from "react-router"

const Products = () => {
  const { data, isLoading, isError } = useGetAllProductsQuery()
  console.log(data)

  if (isLoading) return <p className={styles.status}>Loading products...</p>
  if (isError) return <p className={styles.status}>Failed to load products.</p>

  return (
    <div className={styles.products}>
      {data?.map((product) => (
        <div key={product.id} className={styles.product}>
            <Link to={`/product/${product.id}`} className={styles.link}>
                    <div className={styles.imageWrapper}>
            <img src={product.image} alt={product.title} />
          </div>
          <div className={styles.info}>
            <p className={styles.title}>{product.title}</p>
            <p className={styles.price}>&#8358;{product.price}</p>
            <p className={styles.description}>{product.description}</p>
            <div className={styles.footer}>
              <span className={styles.rating}>{product.rating?.rate}</span>
              <button className={styles.btn}>Add to Cart</button>
            </div>
          </div>
          </Link> 
        </div>
      ))}
    </div>
  )
}

export default memo(Products)
