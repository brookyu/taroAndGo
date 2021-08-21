import { View, Image } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import styles from './index.module.less'
// dispatch
import dva from '../../utils/dva'
import { useEffect } from 'react'
const dispatch = dva.getDispatch()
const store = dva.getStore()
const { common } = store.getState()



// import {connect } from 'react-redux'

// @connect(({common   /* 需要哪些模块都写在这里 */    }) => ({
//   accessToken: common.accessToken,   // 这里定义的值会传给页面的props
// }))    // connect必须写在class 前面(中间也可以有其他装饰器)

const Index = () => {

  
  // dispatch({
  //   type: 'common/saveStorageSync',
  //   payload: {
  //     accessToken: '123',
  //     isSubscribe: false,
  //   },
  //   cb: ()=>{
  //     // 执行回调函数
  //   }
  // })
  


  useDidShow(()=>{
    setTimeout(()=>{
      Taro.switchTab({
        url: '/pages/createHome/index'
      })
    },3000)
  })

  
  return (
    <View className={styles.index}>
      <View className={styles.title}>那年夏天</View>
      <Image src={require('../../assets/summer.png')} mode='widthFix'></Image>
      <View className={styles.text}>
        <View>...</View>
        <View>怀念啊我们的青春啊</View>
        <View>昨天在记忆里生根发芽</View>
        <View>爱情滋养心中那片土地</View>
        <View>绽放出美丽不舍的泪花</View>
        <View>...</View>
      </View>
    </View>
  )
}
 
export default Index