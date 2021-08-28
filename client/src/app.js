/* dva */
import {Provider} from 'react-redux'
import 'taro-ui/dist/style/index.scss'

import dva from './utils/dva'
import models from './models/index'

import './app.less'

const dvaApp = dva.createApp( {
  initialState: {},
  models: models,
} );  
const store = dvaApp.getStore();

const App = props =>{

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  return (
    <Provider store={store} >
      {props.children }
    </Provider>
  )
}


export default App
