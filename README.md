# ggkwh-front-end

> 公共库维护前端（demo）

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 项目说明
### 总体说明
1. 模块化搭建的vue项目，首先确保安装了[node.js](https://nodejs.org/zh-cn/)，请按照[Build Setup](#Build Setup)来本地运行项目。
2. 使用了[axios](https://github.com/axios/axios)向后端请求数据，请求的url在*main.js*的*Vue.prototype.apiUrl*中定义，
引入*websocket*实现保存所有结果进度条加载 
3. 使用了[ElementUI](http://element-cn.eleme.io/#/zh-CN/component/installation)来构建前端  
4. 目前主要实现了中科院，工程院，长江学者公共库的维护与更新
5. [api文档](https://docs.qq.com/doc/BqI21X2yZIht15KNMU0dC08g0ev0tg1N54I42NrF4K1ONwO73IQmKC2Cjyb92O8xq00FpNte0vqpPK1D7MU24)
6. 使用了[vue-router](https://router.vuejs.org/zh/)，处于history模式，部署参考[history模式下的部署](https://router.vuejs.org/zh/guide/essentials/history-mode.html)

### Done  
- [x] 公共库列表展示
- [x] 公共库现有数据管理，增删改
- [x] 公共库自动更新设置
- [x] 获取最新数据
- [x] 侧导航栏
- [x] 查看更新结果
- [x] 对更新结果的操作
- [x] 结果检索

### 代码结构说明
文件路径   |   说明 |
-------- | ---------|
src/main.js  | 定义了基本的设置，引入了elementui，axios，定义了后端url|
src/components/LibraryList.vue| 展示所有公共库列表，多数指向长江学者|
src/components/AsideMenu.vue| 侧导航栏组件，在公共库之间快速切换切换|
src/components/GeneralAdmin.vue| 对公共库现有数据的管理组件，包括增删改|
src/components/GeneralUpdatedResults.vue| 公共库更新结果界面|

