import { View, Input, Button } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { AtTextarea,AtInput, AtButton } from 'taro-ui'
import fetch from '../../utils/request'
import styles from './index.module.less'

const slp = async x => new Promise(r=>setTimeout(r,x))

const Index = () =>{

    const [question, setQuestion] = useState("")
    const [contract, setContract] = useState("")
    const sendFeedBack = async () =>{
        let res = await fetch({url:'/v1/feedback',method:"post",data:{question,contract}})
        if (res instanceof Error)return 
        Taro.showToast({
            icon:'success',
            title:'反馈成功'
        })
        await slp(500)
        Taro.navigateBack()
    }

    return (<View className={styles.index}>
        <AtTextarea
          value={question}
          onChange={setQuestion}
          placeholder='请在此输入您遇到的问题...'
          height={300}
        />
        <AtInput type='text' placeholder='请输入您的一项联系方式（qq wx email）' value={contract} onChange={setContract} />
        <AtButton type='primary' onClick={sendFeedBack}>提交</AtButton>
    </View>)
}

export default Index