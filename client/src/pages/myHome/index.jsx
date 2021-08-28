import { View, Button } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro, { useDidHide, useDidShow, usePullDownRefresh, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import dva from '../../utils/dva'
import chessImg from '../../assets/chess.png'
import styles from './index.module.less'
import fetch from '../../utils/request'
import getWs from '../../utils/websocket' 
import login from '../../utils/login'
import {appName, getShareImage} from '../../config/index'

const slp = async x => new Promise(r=>setTimeout(r,x))
const colors = ["transparent","#444693","#ffd400"]

// websocket链接
let ws 

const Index = () => {

  // 转发
  useShareAppMessage(res=>{
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: `${appName} 点击链接加入游戏！！！`,
      path: '/pages/myHome/index?id='+home.id,
      imageUrl: getShareImage()
    }
  })

  // 朋友圈
  useShareTimeline(()=>{
    console.log('onShareTimeline')
    return {
      title: `${appName} 点击链接加入游戏！！！`,
      path: '/pages/myHome/index?id='+home.id,
      imageUrl: getShareImage()
    }
  })

  const [chess, setChess] = useState([
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
  ])
  const [home,setHome] = useState()
  const [position,setPosition] = useState([-1,-1])
  const [win,setWin] = useState(false)
  const [join, setJoin] = useState(false)
  const [share,setShare] = useState(false)

  // 初始化房间的信息 操作函数
  const initHome = async({first, name})=>{
    // 0. 获取变量信息
    if (!name){
      const store = dva.getStore()
      const { user } = store.getState()
      name = user.name 
    }

    if (!name){
      Taro.showToast({title:'您还未创建游戏',icon:'none'})
      await slp(2000)
      Taro.switchTab({url:'/pages/createHome/index'})
      return
    }

    // 1. 获取当前用户的状态
    let res = await fetch({url:'/v1/state',method:'get',data:{user:name}})
    if (res instanceof Error)return 
    const {state, home} = res
    setHome(home)

    // 2. 根据用户当前状态的不同，进行不同的显示
    if (state == 'init'){
      Taro.showToast({title:'您还未创建游戏',icon:'none'})
      await slp(2000)
      Taro.switchTab({url:'/pages/createHome/index'})
      return
    }else if(state == 'one'){
      // if(first)Taro.showToast({title:'请分享本界面给你的好友',icon:'none'})
      setShare(true)
    }
    // 当前正在游戏中，建立ws链接。 若当前只有一个用户也没关系，在另一个用户加入到房间中后，本用户（建房间）能够收到置棋操作。
    ws = await getWs({url:`/v1/visit?user=${name}&id=${home.id}`})
    handleWs()
  }

  // 加入到房间中，但是不会进行提醒
  const joinHome = async ({id,name}) =>{
    const res = await fetch({url:`/v1/join?id=${id}&user=${name}`,method:'get',showToast:false})
    if (res instanceof Error)return 
  }

  // 进入房间初始化
  useDidShow(()=>{
    // 判断用户是否已经加入了房间
    let { id } = Taro.getCurrentInstance().router.params
    if (id){
      const store = dva.getStore()
      const { user } = store.getState()
      const {name} = user||{}
      if (!name){
        // 准备获取权限信息
        setJoin(true)
        return
      }else{
        joinHome({id,name})
      }  
    }
    initHome({first:true})
  })

  // 下拉刷新
  usePullDownRefresh(async()=>{
    if (ws)ws.close()
    await initHome({})
    Taro.stopPullDownRefresh()
  })
  
  // 隐藏
  useDidHide(()=>{
    if (ws){
      ws.close()
    }
  })
  

  // 游戏房间长链接
  const handleWs = () =>{
    ws.onOpen(()=>{
      console.log('ws 打开')
      setWin(false)
    })
    ws.onMessage(async res=>{
      // 不允许多次提示
      if (win) return 

      console.log('收到消息')
      const {status,msg,data}=JSON.parse(res.data)

      if (status != 200){
        Taro.showToast({title:msg,icon:'none'})
        return
      }
      console.log({status,msg,data})

      if (data){
        if (data.userB)setShare(false)
        setHome(data)
        setChess(data.chess.pieces)
        setPosition([-1,-1])
      }
    
      // 消息处理
      if (msg.indexOf('获得胜利')>=0){
        ws.close()
        setWin(msg)
      }
      if (msg.indexOf('手动销毁房间')>=0){
        Taro.showToast({title:'另一位玩家提前销毁了房间，您可以重新建一个游戏房间',icon:'none'})
        await slp(2000)
        Taro.switchTab({url:'/pages/createHome/index'})
      }
    })
    ws.onClose(e=>{
      console.log('ws 关闭',e)
    })
  }


  // 当用户选中了i j坐标
  const choose = async (i,j,v) =>{
    // 当前用户信息
    const store = dva.getStore()
    const { user } = store.getState()
    const {name} = user||{}
   
    if (!home||home.now!=name){
      Taro.showToast({title:'当前不该您置棋',icon:'none'})
      return 
    }

    // 第一次选择
    if (position[0]==-1&&position[1]==-1&&v!=0){
      setPosition([i,j])
    }
    // 取消选中之前的棋子
    else if (position[0]==i&&position[1]==j){
      setPosition([-1,-1])
    }
    // 第二次选择
    else if (v == 0){
      // 判断 i j 是不是可以落子的位置
      let ans = Math.abs(position[0]-i)+Math.abs(position[1]-j)
      if (ans == 1){
        console.log(chess)
        let nc = []
        for (let k =0;k<4;k++) nc.push([...chess[k]])
        nc[i][j] = nc[position[0]][position[1]]
        nc[position[0]][position[1]] = 0
        // 请求移动
        ws.send({
          data:JSON.stringify({
            user:name,
            startX:position[0],          
            startY:position[1],
            endX:i,
            endY:j,    
          })
        })
        // setChess(nc)
        // setPosition([-1,-1])
      }
    }

  }

  // 对棋盘进行翻转
  const reverse = chess =>{
    let ans = []
    for (let i =0;i<4;i++)ans.push([])
    for (let i=0;i<4;i++){
      for(let j=0;j<4;j++){
        ans[i][j]=chess[3-i][3-j]
      }
    }
    return ans
  }

  // 提前退出游戏
  const closeHome = async () =>{
    let res = await fetch({url:'/v1/delete',method:'get',data:{id:home.id}})
    if (res instanceof Error)return 
    Taro.switchTab({url:'/pages/createHome/index'})
  }


  return (
    <View className={styles.index}>
      <View className={styles.now}>
        <View>当前置棋方：【{home&&home.now||'-'}】</View>
        <View className={styles.homeId}>{home&&home.id}</View>
      </View>
      <View className={styles.adv}>
        玩家二：{home&&home.userB||'-'} 
        <View className={styles.piece} style={{ backgroundColor:colors[2]}}></View>
      </View>
      <View className={styles.img} src={chessImg} mode='widthFix'>
        <View className={styles.chess}>
          {
            chess.map((cs,i)=>(
              <View key={i} className={styles.line}>
                {cs.map((c,j)=>(
                  <View 
                    key={j} 
                    className={styles.cell} 
                    style={{
                      backgroundColor:colors[c],
                      borderColor: position[0]==i && position[1] == j && "red"
                    }}
                    onClick={()=>{choose(i,j,c)}}
                    
                  ></View>
                ))}
              </View>
            ))
          }
        </View>
        {home&&<View className={styles.closeHome} onClick={closeHome}>
          提前销毁游戏房间
        </View>}
      </View>
      <View className={styles.mi}>
        玩家一：{home&&home.userA}
        <View className={styles.piece} style={{ backgroundColor:colors[1]}}></View>
      </View>
      <AtModal isOpened={share} closeOnClickOverlay={false} >
        <AtModalHeader>分享游戏</AtModalHeader>
        <AtModalContent>
          <View className={styles.modal}>
            <View>请您点击右上角分享按钮</View>
            <View>或者是下方的分享按钮</View>
            <View>分享房间给好友</View>
          </View>
        </AtModalContent>
        <AtModalAction> 
          <Button onClick={closeHome} >销毁房间</Button> 
          <Button openType='share'>分享房间</Button> 
          </AtModalAction>
      </AtModal>
      <AtModal isOpened={win}>
        <AtModalHeader>游戏结束</AtModalHeader>
        <AtModalContent>
          <View className={styles.modal}>
            <View>{win}</View>
          </View>
        </AtModalContent>
        <AtModalAction> 
          <Button onClick={()=>{
            setWin(false)
            Taro.switchTab({url:'/pages/createHome/index'})
          }} 
          >确定</Button> 
          </AtModalAction>
      </AtModal>
      <AtModal isOpened={join}>
        <AtModalHeader>加入游戏</AtModalHeader>
        <AtModalContent>
          <View className={styles.modal}>
            <View>加入房间需要获取您的微信名和头像信息</View>
          </View>
        </AtModalContent>
        <AtModalAction> 
          <Button onClick={async()=>{
            let res = await login()
            if (res instanceof Error)return 
            const {name} = res
            let { id } = Taro.getCurrentInstance().router.params
            joinHome({id,name})
            setJoin(false)
            initHome({first:true,name})
          }} 
          >确定</Button> 
          </AtModalAction>
      </AtModal>
    </View>
  )
}

export default Index