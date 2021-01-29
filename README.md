# weapp-qrcode-canvas-2d

 [weapp-qrcode-canvas-2d](https://github.com/DoctorWei/weapp-qrcode-canvas-2d) 是使用新版canvas-2d接口在微信小程序中生成二维码（外部二维码）的js包。canvas 2d 接口支持同层渲染且性能更佳，可大幅提升生成图片的速度。

# 仓库地址
-  [weapp-qrcode-canvas-2d【码云gitee】](https://gitee.com/w386888618/weapp-qrcode-canvas-2d)
-  [weapp-qrcode-canvas-2d【github】](https://github.com/DoctorWei/weapp-qrcode-canvas-2d)

<!-- ![weapp-qrcode-canvas-2d](https://wx4.sinaimg.cn/mw690/77d4598fly1gn4nqmgayzj205k05kgli.jpg) -->

# 测试环境
- 微信小程序基础库版本：2.10.4
- 开发者工具版本：Stable 1.03.2101150

# Usage

先在 wxml 文件中，创建绘制的 `canvas`，并定义好 `width`, `height`, `id` , `type` ，其中type的值必须为`2d`

```html
<canvas type="2d" style="width: 260px; height: 260px;" id="myQrcode"></canvas>
```

## 安装方法1：直接引入 js 文件
直接引入 js 文件，使用 `drawQrcode()` 绘制二维码

```js
// 将 dist 目录下，weapp.qrcode.esm.js 复制到项目中。路径根据实际引用的页面路径自行改变

import drawQrcode from '../../utils/weapp.qrcode.esm.js'
```

## 安装方法2：npm安装

```
npm install weapp-qrcode-canvas-2d --save
```
// 然后需要在小程序开发者工具中：构建npm

```js
import drawQrcode from 'weapp-qrcode-canvas-2d'
```

## 安装完成后调用

### 例子1：没有使用叠加图片
```js
const query = wx.createSelectorQuery()
query.select('#myQrcode')
    .fields({
        node: true,
        size: true
    })
    .exec((res) => {
        var canvas = res[0].node

        // 调用方法drawQrcode生成二维码
        drawQrcode({
            canvas: canvas,
            canvasId: 'myQrcode',
            width: 260,
            padding: 30,
            background: '#ffffff',
            foreground: '#000000',
            text: '大王顶真帅',
        })

        // 获取临时路径（得到之后，想干嘛就干嘛了）
        wx.canvasToTempFilePath({
            canvasId: 'myQrcode',
            canvas: canvas,
            x: 0,
            y: 0,
            width: 260,
            height: 260,
            destWidth: 260,
            destHeight: 260,
            success(res) {
                console.log('二维码临时路径：', res.tempFilePath)
            },
            fail(res) {
                console.error(res)
            }
        })
    })
```

### 例子2：使用叠加图片(在二维码中加logo)
```js
const query = wx.createSelectorQuery()

query.select('#myQrcode')
    .fields({
        node: true,
        size: true
    })
    .exec(async (res) => {
        var canvas = res[0].node

        var img = canvas.createImage();
        img.src = "/image/logo.png"

        img.onload = function () {
            // img.onload完成后才能调用 drawQrcode方法

            var options = {
                canvas: canvas,
                canvasId: 'myQrcode',
                width: 260,
                padding: 30,
                paddingColor: '#fff',
                background: '#fff',
                foreground: '#000000',
                text: qrcodeText,
                image: {
                    imageResource: img,
                    width: 80, // 建议不要设置过大，以免影响扫码
                    height: 80 // 建议不要设置过大，以免影响扫码
                    round: true // Logo图片是否为圆形
                }
            }

            drawQrcode(options)

            // 获取临时路径（得到之后，想干嘛就干嘛了）
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: 260,
                height: 260,
                destWidth: 600,
                destHeight: 600,
                canvasId: 'myQrcode',
                canvas: canvas,
                success(res) {
                    console.log('二维码临时路径为：', res.tempFilePath)
                },
                fail(res) {
                    console.error(res)
                }
            })

        };
    })
```


# API
## drawQrcode([options])
### options

Type: Object

| 参数 | 必须 | 说明 | 示例|
| ------ | ------ | ------ | ------ |
| canvas | 必须 | 画布标识，传入 canvas 组件实例 |  |
| canvasId | 非 | 绘制的`canvasId` | `'myQrcode'` |
| text | 必须 | 二维码内容 | 'https://github.com/DoctorWei/weapp-qrcode-canvas-2d' |
| width | 非 | 二维码宽度，与`canvas`的`width`保持一致 | 260 |
| padding | 非 | 空白内边距 | 20 |
| paddingColor | 非 | 内边距颜色 | 默认与background一致 |
| background | 非 | 二维码背景颜色，默认值白色 | `'#ffffff'` |
| foreground | 非 | 二维码前景色，默认值黑色 | `'#000000'` |
| typeNumber | 非| 二维码的计算模式，默认值-1 | 8 |
| correctLevel | 非| 二维码纠错级别，默认值为高级，取值：`{ L: 1, M: 0, Q: 3, H: 2 }` | 1 |
| image | 非 | 在 canvas 上绘制图片，层级高于二维码，v1.1.1+版本支持。具体使用见：下方例子2 | `{imageResource: '', width:80, height: 80, round: true}` |
# TIPS

weapp-qrcode-canvas-2d 参考以下源码

- 参考 [weapp-qrcode](https://github.com/yingye/weapp-qrcode)
- 参考 [jquery-qrcode](https://github.com/jeromeetienne/jquery-qrcode)