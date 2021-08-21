import { View,Image } from '@tarojs/components'
import joinHomeBg from '../../assets/joinHome.png'
import { AtInput,AtForm,AtButton } from 'taro-ui'
import styles from './index.module.less'
import fetch from '../../utils/request'
import Taro,{ useDidShow } from '@tarojs/taro'
import { useState } from 'react'

const Index = () => {

  const [id,setId] = useState()

  useDidShow(async()=>{
    const res = await Taro.getClipboardData()
    if (res&&res.errMsg&&res.errMsg.indexOf('ok')>=0){
      const data = res.data || ""
      let ids = /房间号\[[0-9]*\]/.exec(data) || []
      if (ids.length == 1){
        Taro.showToast({title:"已自动为您填充",icon:'success'})
        setId(ids[0].substring(4,ids[0].length-1))
      }
    }
  })

  const joinHome = async ()=>{
    let res = await fetch({url:'/v1/join',method:'get',data:{id,user:'bing'}})
    if (res instanceof Error) return
    // Taro.showToast({title:'成功加入房间',icon:'success'})
    console.log(id)
    Taro.switchTab({url:'/pages/myHome/index?id='+id})
  }

  return (
    <View className={styles.index}>
      <Image
        src={joinHomeBg}
        mode='widthFix'
      >
      </Image>
      <AtForm className={styles.form} onSubmit={()=>false}>
        <AtInput className={styles.name} value={id} onChange={setId} name='user' title='您的房间号' placeholder='请输入好友给您的房间号' cursorSpacing={100}></AtInput>
        <AtButton className={styles.btn} type='primary' onClick={joinHome}>进入房间</AtButton>
      </AtForm>

    </View>
  )
}

export default Index