import {View, Image} from '@tarojs/components'
import joinHomeBg from '../../assets/joinHome.png'
import {AtInput, AtForm, AtButton} from 'taro-ui'
import styles from './index.module.less'
import fetch from '../../utils/request'
import Taro, {useDidShow, useShareAppMessage, useShareTimeline} from '@tarojs/taro'
import {useState} from 'react'
import {appName, getShareImage} from '../../config/index'
import dva from '../../utils/dva'
import login from '../../utils/login'

const slp = async x => new Promise(r => setTimeout(r, x))

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

    // 用户想加入的房间号
    const [id, setId] = useState()

    // 查看当前用户状态
    useDidShow(async () => {
        const store = dva.getStore()
        const {user} = store.getState()
        const {name} = user || {}
        if (name){
            const res = await fetch({
                url: '/v1/state',
                method: 'get',
                data: {
                    user: name
                }
            })
            if (res instanceof Error)return
            const {state}= res
            if (state!='init'){
              Taro.showToast({title:'您有正在进行的游戏',icon:"none"})
              await slp(2000)
              Taro.switchTab({url:'/pages/myHome/index'})
            }
        }
    })

    useDidShow(async () => {
        const res = await Taro.getClipboardData()
        if (res && res.errMsg && res.errMsg.indexOf('ok') >= 0) {
            const data = res.data || ""
            let ids = /房间号\[[0-9]*\]/.exec(data) || []
            if (ids.length == 1) {
                Taro.showToast({title: "已自动为您填充", icon: 'success'})
                setId(ids[0].substring(4, ids[0].length - 1))
            }
        }
    })

    const joinHome = async () => {
        const store = dva.getStore()
        const {user} = store.getState()
        const {name} = user || {}
        if (!name){
            login()
        }else{
            let res = await fetch({
                url: '/v1/join',
                method: 'get',
                data: {
                    id,
                    user: name
                }
            })
            if (res instanceof Error) 
                return
               
            Taro.switchTab({url: '/pages/myHome/index'})
        }
        
    }

    return (
        <View className={styles.index}>
            <Image src={joinHomeBg} mode='widthFix'></Image>
            <AtForm className={styles.form} onSubmit={() => false}>
                <AtInput
                  className={styles.name}
                  value={id}
                  onChange={setId}
                  name='user'
                  title='您的房间号'
                  placeholder='请输入好友给您的房间号'
                  cursorSpacing={100} 
                ></AtInput>
                <AtButton className={styles.btn} type='primary' onClick={joinHome}>进入房间</AtButton>
            </AtForm>

        </View>
    )
}

export default Index