import { View,Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import styles from './index.module.less'
import dva from '../../utils/dva'
import { useDidShow } from '@tarojs/taro'
import { useState } from 'react'

const Index = () => {

  const [user,setUser] = useState({})

  useDidShow(()=>{
    const store = dva.getStore()
    setUser(store.getState().user)
  })
  
  return (
    <View className={styles.index}>
      <View className={styles.bg}></View>
      <View className={styles.user}>
        <Image  mode='widthFix' src={user.avatar}></Image>
        <View className={styles.name}>{user.name}</View>
      </View>
      <View className={styles.infos}>
        <View className={styles.info}>
          <View className={styles.line}>
            <View className={styles.title}>
              <Image src={require('../../assets/ls.png')} mode='widthFix' ></Image>
              对战历史
            </View>
            <AtIcon className={styles.icon} value='chevron-right'></AtIcon>
          </View>
        </View>
        <View className={styles.info}>
          <View className={styles.line}>
            <View className={styles.title}>
              <Image src={require('../../assets/fk.png')} mode='widthFix' ></Image>
              用户反馈
            </View>
            <AtIcon className={styles.icon} value='chevron-right'></AtIcon>
          </View>
          <View className={styles.line}>
            <View className={styles.title}>
              <Image src={require('../../assets/gywm.png')} mode='widthFix' ></Image>
              关于6
            </View>
            <AtIcon className={styles.icon} value='chevron-right'></AtIcon>
          </View>
          <View className={styles.line}>
            <View className={styles.title}>
              <Image src={require('../../assets/zz.png')} mode='widthFix' ></Image>
              作者信息
            </View>
            <AtIcon className={styles.icon} value='chevron-right'></AtIcon>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Index