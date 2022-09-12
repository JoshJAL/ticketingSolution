import React from 'react'
import styles from './LoadingSpinner.module.css'

function LoadingSpinner() {
  return (
    <div className={styles.ldsGrid} ><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  )
}

export default LoadingSpinner
