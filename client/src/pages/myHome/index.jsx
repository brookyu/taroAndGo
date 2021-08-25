import { View, Button } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro, { useDidHide, useDidShow } from '@tarojs/taro'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import dva from '../../utils/dva'
import chessImg from '../../assets/chess.png'
import styles from './index.module.less'
import fetch from '../../utils/request'
import getWs from '../../utils/websocket' 
import { window } from '@tarojs/runtime'

const slp = async x => new Promise(r=>setTimeout(r,x))
const colors = ["transparent","#444693","#ffd400"]

// websocket链接
let ws 

const Index = () => {

  const [chess, setChess] = useState([
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
  ])
  const [home,setHome] = useState()
  // 用户当前选中的位置
  const [position,setPosition] = useState([-1,-1])

  // modal的刷新也会影响
  useDidShow(()=>{
    (async()=>{
      // 0. 获取变量信息
      const store = dva.getStore()
      const { user } = store.getState()
      const {name} = user||{}

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
        Taro.showToast({title:'请将您的房间号分享给你的好友',icon:'none'})
      }
      // 当前正在游戏中，建立ws链接。 若当前只有一个用户也没关系，在另一个用户加入到房间中后，本用户（建房间）能够收到置棋操作。
      ws = await getWs({url:`/v1/visit?user=${name}&id=${home.id}`})
      handleWs()
    })()
  })
  
  useDidHide(()=>{
    if (ws){
      ws.close()
    }
  })
  

  const [win,setWin] = useState(false)

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
      setWin(false)
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

  const store = dva.getStore()
  const { user } = store.getState()
  const {name} = user||{}
  return (
    <View className={styles.index}>
      <View className={styles.now}>
        <View>当前置棋方：【{(home&&home.now)||name}】</View>
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
      <AtModal isOpened={win}>
        <AtModalHeader>游戏结束</AtModalHeader>
        <AtModalContent>
          <View className={styles.modal}>
            <View>{win}</View>
          </View>
        </AtModalContent>
        <AtModalAction> 
          <Button onClick={()=>{
            Taro.switchTab({url:'/pages/createHome/index'})
          }} 
          >确定</Button> 
          </AtModalAction>
      </AtModal>
    </View>
  )
}

export default Index