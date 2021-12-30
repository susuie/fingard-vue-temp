# 项目搭建框架
* vue-cli 4.0
* vue 2.6
* vue-router 3.0
## UI框架
* element 

## 项目创建命令：
* vue create project-name

# 项目结构说明
## src 文件夹下：
* assets--存放静态资源文件
* components--存放项目封装可复用的组件
* router--存放路由文件
* http--前后端交互接口文件，本项目使用axios进行交互
* utils--公共的方法存放文件
* store--vuex数据管理文件
* views--项目页面
* App.vue--项目根组件
* main.js--项目入口文件
## tests文件夹下：
* unit--单元测试
* e2e--端对端测试，黑盒测试

## 其他配置文件
* babel.config.js--ES6转ES5配置文件
* package.json--项目说明文件，包含项目名，项目版本，项目依赖等信息
* vue.config.js--项目配置文件，包括生产，开发，测试环境的配置
* commitlint.config.js--项目git提交message规范配置文件
* .eslintrc.js--项目编码规范配置文件


# 项目运行说明
* 首先请确保你的本地node版本在8.11.0 +
* git clone 克隆项目到本地
* 运行 yarn 或者 npm i 安装项目依赖
* 运行 npm run serve 启动项目

# git commit message 规范解释
feat: 新功能（feature）
fix: 修补bug
docs: 文档（documentation）
style: 格式（不影响代码运行的变动）
refactor: 重构（即不是新增功能，也不是修改bug的代码变动）
test: 增加测试
chore: 构建过程或辅助工具的变动

* 示例：feat: 添加企业新功能开发
       docs: 修改配置文档
