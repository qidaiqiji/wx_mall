微信小程序
#npm 安装项目依赖
1. npm install

2. 点击开发者工具栏： 工具--->构建npm （确认node_modules 在小程序的根目录下）

3. 点击详情-->勾选“使用npm模块”

4. 引入ui组件，在该页面或者组件的json文件中引入即可（这里以引入button按钮为例）
{
  "usingComponents": {
    "van-button": "../../miniprogram_npm/vant-weapp/button/index"
  }
}

5. 接着就可以在 wxml 中直接使用组件
<van-button type="primary">按钮</van-button>

6. 然后点击编译就可以查看效果