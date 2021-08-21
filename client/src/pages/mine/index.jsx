import { View,Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import styles from './index.module.less'

const index = () => {
    return (
      <View className={styles.index}>
        <View className={styles.bg}></View>
        <Image className={styles.user} mode='widthFix' src={require('../../assets/user.png')}></Image>
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

export default index