import extend from 'extend'
import {
  QRCode,
  QRErrorCorrectLevel
} from './qrcode'

// support Chinese
function utf16to8(str) {
  var out, i, len, c
  out = ''
  len = str.length
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i)
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i)
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    }
  }
  return out
}

function drawQrcode(options) {
  options = options || {}
  options = extend(true, {
    canvasId: 'myQrcode',
    // canvas: canvas,
    text: '爱一个人就要勇敢说出来',
    width: 260,
    height: 260,
    padding: 20,
    typeNumber: -1,
    correctLevel: QRErrorCorrectLevel.H,
    background: '#ffffff',
    foreground: '#000000',
    image: {
      imageResource: '',
      dx: 0,
      dy: 0,
      dWidth: 100,
      dHeight: 100
    }
  }, options)

  if (!options.canvasId && !options.canvas) {
    console.warn('please set canvasId or canvas!')
    return
  }

  createCanvas()
  var qrcode = new QRCode(options.typeNumber, options.correctLevel)
  qrcode.addData(utf16to8(options.text))
  qrcode.make()

  function createCanvas() {
    // create the qrcode itself
    var qrcode = new QRCode(options.typeNumber, options.correctLevel)
    qrcode.addData(utf16to8(options.text))
    qrcode.make()

    const dpr = wx.getSystemInfoSync().pixelRatio
    var canvas = options.canvas
    const ctx = canvas.getContext('2d')
    canvas.width = options.width * dpr
    canvas.height = options.width * dpr
    const width = canvas.width

    // 背景色
    ctx.fillStyle = options.background
    ctx.fillRect(0, 0, width + options.padding * 2, width + options.padding * 2);
    ctx.stroke();

    var tileW = (width - options.padding * 2) / qrcode.getModuleCount()
    var tileH = (width - options.padding * 2) / qrcode.getModuleCount()

    // 开始画二维码
    for (var row = 0; row < qrcode.getModuleCount(); row++) {
      for (var col = 0; col < qrcode.getModuleCount(); col++) {
        if (qrcode.isDark(row, col)) {
          ctx.fillStyle = options.foreground
          var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW))
          var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW))
          ctx.fillRect(Math.round(col * tileW) + options.padding, Math.round(row * tileH) + options.padding, w, h);
        }
      }
    }
    ctx.stroke();


  }
}

export default drawQrcode
