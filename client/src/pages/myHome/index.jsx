import { View, Image } from '@tarojs/components'
import Taro,{ useShareAppMessage } from '@tarojs/taro'
import { useState } from 'react'
import chessImg from '../../assets/chess.png'
import styles from './index.module.less'

const Index = () => {

  const {id} = Taro.getCurrentInstance().router.params
  console.log(id)


  /**
   * 进入到本界面，然后创建一个wss链接，离开界面时销毁
   * 需要后端不断返回Home的最新的棋盘的信息
   * 
   * 
   */
  const [chess, setChess] = useState([
    [1,1,1,1],
    [1,0,0,1],
    [2,0,0,2],
    [2,2,2,2]
  ])
  const colors = ["transparent","#444693","#ffd400"]

  // 用户当前选中的位置
  const [position,setPosition] = useState([-1,-1])

  // 当用户选中了i j坐标
  const choose = (i,j,v) =>{
    console.log(i,j,v)

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
        setChess(nc)
        setPosition([-1,-1])
      }
    }
  }

  return (
    <View className={styles.index}>
      <View className={styles.adv}>对手：bing</View>
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
      </View>
      <View className={styles.mi}>
        我方：yuan
      </View>
    </View>
  )
}

export default Index