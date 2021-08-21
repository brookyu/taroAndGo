import { create } from 'dva-core';
import { createLogger } from 'redux-logger';
import createLoading from 'dva-loading';
let app;
let store;
let dispatch;

function createApp(opt) {
  // redux日志
  // opt.onAction = [createLogger()];
  app = create(opt);
  app.use(createLoading({}));

  if (!global.registered) opt.models.forEach(model => app.model(model));
  global.registered = true;
  app.start();

  store = app._store;
  app.getStore = () => store;

  dispatch = store.dispatch;

  app.dispatch = dispatch;
  return app;
}
export default {
  createApp,
  getDispatch() {
    return app.dispatch;
  },
  getStore() { // 这个是在非组件的文件中获取Store的方法, 不需要可以不暴露
    return app.getStore();
  },
}