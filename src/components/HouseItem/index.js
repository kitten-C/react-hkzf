import React from 'react'

import styles from './index.module.scss'

import {BASE_URL} from '../../utils'

const HouseItem = ({item, style, onClick}) => {
  return (
    <div
      className={styles.house}
      style={style}
      onClick={() => {
        onClick(item.houseCode)
      }}
    >
      <div className={styles.imgWrap}>
        <img
          className={styles.img}
          src={`${BASE_URL}${item.houseImg}`}
          alt=""
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{item.title}</h3>
        <div className={styles.desc}>{item.desc}</div>
        <div>
          {item.tags.map((tag, index) => {
            const tagClass = `tag${index > 2 ? '3' : index + 1}` // tag1 or tag2 or tag3
            return (
              <span
                key={index}
                className={[styles.tag, styles[tagClass]].join(' ')}
              >
                {tag}
              </span>
            )
          })}
        </div>
        <div className={styles.price}>
          <span className={styles.priceNum}>{item.price}</span> 元/月
        </div>
      </div>
    </div>
  )
}
export default HouseItem
