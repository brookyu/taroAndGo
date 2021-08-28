import Taro from '@tarojs/taro';

export default {
  namespace: 'user', // 这是模块名
  state: { // 初始化数据
    name: Taro.getStorageSync('name') || '',
    avatar: Taro.getStorageSync('avatar') || '',
  },

  effects: { 
    // 异步方法, 在这里可以用put调用同步的方法
    // generator  这里的方法第二个参数都是{call, put }, call调用异步方法, put 可以调用reducers中的方法
    * saveStorageSync({payload, cb }, {call, put }) {
      for (let index = 0; index <  Object.keys(payload).length; index++) {
        yield call(Taro.setStorageSync, 
          Object.keys(payload)[index],
          payload[Object.keys(payload)[index]]
        );
      }
      cb && cb();
      yield put({
        type: 'save', // 方法名
        payload,// 参数
      })
    },
  },

  reducers: { // 同步方法
    // state是状态信息，pyload是函数参数
    save(state, {payload }) {
      return {...state, ...payload };
    },
    zry(state) {
      console.log('zry reduce')
      return {...state ,name:'zry'+Math.random()*10};
    },
  },
};