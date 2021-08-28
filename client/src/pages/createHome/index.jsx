import { View,Image,Button } from '@tarojs/components'
import { AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import Taro, { useDidShow, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import fetch from '../../utils/request'
import styles from './index.module.less'
import { useState } from 'react'
import login from '../../utils/login'
import dva from '../../utils/dva'
import {appName,shareImages,getShareImage} from '../../config/index'

const slp = async x => new Promise(r=>setTimeout(r,x))

const Index = () => {
  
  // 转发
  useShareAppMessage(res=>{
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: `${appName} 致敬曾经逝去的青春和年华！！！`,
      path: '/pages/createHome/index',
      imageUrl: getShareImage()
    }
  })

  // 朋友圈
  useShareTimeline(()=>{
    console.log('onShareTimeline')
  })

  // 获取当前用户状态
  useDidShow(async()=>{
    let store = dva.getStore()
    let { user } = store.getState()
    let { name } = user || {}

    
    if (name){
      let res = await fetch({url:'/v1/state',method:"get",data:{user:name}})
      if (res instanceof Error)return 
      const {home,state} = res
      if (state != 'init'){
        Taro.showToast({title:'您有正在进行的游戏',icon:'none'})
        await slp(2000) 
        Taro.switchTab({url:'/pages/myHome/index'})
      }
    }
  })

  const [open,setOpen] = useState(false)
  const [home,setHome] = useState()

  // 创建游戏房间
  const createHome = async() =>{
    let store = dva.getStore()
    let { user } = store.getState()
    let { name } = user || {}

    if (!name) {
      login()
      return 
    }else{
      let res = await fetch({url:'/v1/create',method:'get',data:{user:name}})
      if (res instanceof Error)return 
      setHome(res)
      setOpen(true)
    }
  }

  // 复制房间号
  const setClip = async () =>{
    if (!home) return 
    const {id,userA} = home
    await Taro.setClipboardData({
      data: `搜索小程序"${appName}，输入房间号[`+id+']即可加入游戏房间，您的好友['+userA+']正在等您',
    })
    setOpen(false)
    Taro.switchTab({url:'/pages/myHome/index'})
  }

  return (
    <View className={styles.index}>
      <View className="at-article">
        <View className="at-article__h1">
          六子棋游戏
        </View>
        <View className='at-article__info'>
          2021-08-20&nbsp;&nbsp;&nbsp; https://github.com/zju-zry/
        </View>
        <View className='at-article__p'>
          六子棋的走法。六子棋是流传于中国民间的一类版图游戏。是一种双人对弈搏杀的一种游戏，交战双方棋子数均为六颗，故称六子棋。六子棋的棋盘为3乘以3的方格。棋子可信手拿来，只要互相区分即可。
        </View>
        <View className='at-article__content'>
          <View className='at-article__section'>
            <View className='at-article__h2'>棋盘</View>
            <View className='at-article__p'>
              棋子摆放比较自由。假设以一条平行于底线的横线将棋盘对半而分，对战双方可以将自己所持的6子任意的摆放在己方半边3个方格的8个顶点的任意6个顶点上。
            </View>
            <Image 
              className='at-article__img' 
              src='https://zhangruiyuan.oss-cn-hangzhou.aliyuncs.com/picGo/images/20210820231334.png' 
              mode='widthFix' 
            ></Image>
            <View className='at-article__h2'>规则</View>
            <View className='at-article__p'>
              <View><View className={styles.hign}>吃子。</View>设对战双方各持黑子与白子。以黑子吃掉白子为例，若黑子的行棋应当在棋盘上形成某条棋盘线上两个黑子紧靠着顶着一个紧挨着某个黑子的白子，且同一条棋盘线上只有那两个黑子和一个白子，那么白子将被吃掉。若由于白子的行走造成的双黑字顶一个白子，则不构成黑子吃白子的条件。反之，白子吃黑字亦然。</View>
              <View><View className={styles.hign}>胜负。</View>行棋一方两个棋子夹住对方的一个棋子时，则可吃对方该子（称为抬子）。</View>
              <View>旧时，农闲时，或是在人们在地里劳动停下来休息时，大家在地上画方格为棋盘，拾碎石、折树枝作为棋子，以对弈。</View>
            </View>
          </View>
        </View>
      </View>
      {/* <AtFab className={styles.create}>
        <Text className='at-fab__icon at-icon at-icon-add'></Text>
      </AtFab> */}
      <AtButton type='primary' className={styles.btn} onClick={createHome}>创建游戏</AtButton>
      <AtModal isOpened={open}>
        <AtModalHeader>创建游戏房间成功</AtModalHeader>
        <AtModalContent>
          <View>游戏房间号为{home&&home.id}</View>
          <View>点击「确定」按钮，将复制房间号到您的剪切板，请您分享给您的朋友。</View>
        </AtModalContent>
        <AtModalAction> <Button onClick={setClip}>确定</Button> </AtModalAction>
      </AtModal>
    </View>
  )
}

export default Index