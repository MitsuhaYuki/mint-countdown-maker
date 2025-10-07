/**
 * 视频导出工具
 * 使用 mp4-muxer 库将 Canvas 帧序列编码为 MP4 视频
 */

import { Muxer, ArrayBufferTarget } from 'mp4-muxer'

export class VideoExporter {
  constructor(canvas) {
    this.canvas = canvas
    this.muxer = null
    this.videoEncoder = null
    this.frameCount = 0
  }

  /**
   * 开始录制视频
   * @param {number} fps - 帧率
   * @param {number} bitrate - 比特率 (Mbps)
   * @returns {Promise<void>}
   */
  async startRecording(fps = 30, bitrate = 5) {
    this.frameCount = 0

    // 创建 MP4 Muxer
    this.muxer = new Muxer({
      target: new ArrayBufferTarget(),
      video: {
        codec: 'avc',
        width: this.canvas.width,
        height: this.canvas.height
      },
      fastStart: 'in-memory'
    })

    // 创建视频编码器
    this.videoEncoder = new VideoEncoder({
      output: (chunk, meta) => this.muxer.addVideoChunk(chunk, meta),
      error: (e) => console.error('VideoEncoder error:', e)
    })

    // 配置编码器
    this.videoEncoder.configure({
      codec: 'avc1.42001f', // H.264 Baseline Profile
      width: this.canvas.width,
      height: this.canvas.height,
      bitrate: bitrate * 1_000_000, // 转换为 bps (Mbps * 1,000,000)
      framerate: fps,
      // 降低延迟和内存使用
      latencyMode: 'quality', // 优先质量，减少GPU压力
      // 硬件加速设置
      hardwareAcceleration: 'prefer-hardware'
    })

    this.fps = fps
  }

  /**
   * 添加一帧到视频
   * @returns {Promise<void>}
   */
  async addFrame() {
    if (!this.videoEncoder) {
      throw new Error('录制未开始')
    }

    // 等待编码器队列有空间（背压控制）
    while (this.videoEncoder.encodeQueueSize > 5) {
      await new Promise(resolve => setTimeout(resolve, 10))
    }

    // 从 Canvas 创建 VideoFrame
    const frame = new VideoFrame(this.canvas, {
      timestamp: (this.frameCount * 1_000_000) / this.fps // 微秒
    })

    // 编码帧
    const keyFrame = this.frameCount % 30 === 0
    this.videoEncoder.encode(frame, { keyFrame })

    // 立即释放帧资源
    frame.close()

    this.frameCount++

    // 每100帧添加一个小延迟，给GPU时间恢复
    if (this.frameCount % 100 === 0) {
      await new Promise(resolve => setTimeout(resolve, 50))
    }
  }

  /**
   * 停止录制并返回视频 Blob
   * @returns {Promise<Blob>}
   */
  async stopRecording() {
    if (!this.videoEncoder || !this.muxer) {
      throw new Error('录制未开始')
    }

    // 完成编码
    await this.videoEncoder.flush()
    this.videoEncoder.close()

    // 完成混流
    this.muxer.finalize()

    // 获取 MP4 数据
    const { buffer } = this.muxer.target
    return new Blob([buffer], { type: 'video/mp4' })
  }

  /**
   * 下载视频文件
   * @param {Blob} blob - 视频数据
   * @param {string} filename - 文件名
   */
  static async downloadVideo(blob, filename = 'countdown.webm') {
    // 如果在 Electron 环境中，使用原生对话框
    if (window.api && window.api.saveVideoDialog) {
      const filePath = await window.api.saveVideoDialog()
      if (filePath) {
        // 读取 blob 数据
        const arrayBuffer = await blob.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // 使用 fs 写入文件（需要通过 IPC）
        // 注意：这里需要在 main 进程中实现文件写入
        return filePath
      }
    } else {
      // 浏览器环境，使用下载链接
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    }
  }
}

/**
 * 渲染倒计时帧
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 * @param {number} width - Canvas 宽度
 * @param {number} height - Canvas 高度
 * @param {Object} config - 配置对象
 * @param {number} remainingSeconds - 剩余秒数
 */
export function renderCountdownFrame(ctx, width, height, config, remainingSeconds) {
  // 清除画布
  ctx.clearRect(0, 0, width, height)

  // 绘制背景
  if (config.backgroundImage) {
    const img = new Image()
    img.src = config.backgroundImage

    // 计算 contain 模式的尺寸
    const imgRatio = img.width / img.height
    const canvasRatio = width / height

    let drawWidth, drawHeight, x, y

    if (imgRatio > canvasRatio) {
      drawWidth = width
      drawHeight = width / imgRatio
      x = 0
      y = (height - drawHeight) / 2
    } else {
      drawHeight = height
      drawWidth = height * imgRatio
      x = (width - drawWidth) / 2
      y = 0
    }

    ctx.drawImage(img, x, y, drawWidth, drawHeight)
  } else {
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, width, height)
  }

  // 计算时分秒
  const hours = Math.floor(remainingSeconds / 3600)
  const minutes = Math.floor((remainingSeconds % 3600) / 60)
  const seconds = remainingSeconds % 60

  // 格式化文本
  const parts = []

  if (config.hourFormat === 'show') {
    parts.push(hours.toString())
  } else if (config.hourFormat === 'show-2-digits') {
    parts.push(hours.toString().padStart(2, '0'))
  }

  if (config.minuteFormat === 'show') {
    parts.push(minutes.toString())
  } else if (config.minuteFormat === 'show-2-digits') {
    parts.push(minutes.toString().padStart(2, '0'))
  }

  if (config.secondFormat === 'show') {
    parts.push(seconds.toString())
  } else if (config.secondFormat === 'show-2-digits') {
    parts.push(seconds.toString().padStart(2, '0'))
  }

  const text = parts.join(config.separator || ':')

  // 设置字体
  ctx.font = `${config.fontSize}px "${config.fontFamily}"`
  ctx.fillStyle = config.fontColor || '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // 计算位置
  let posX, posY

  if (config.positionMode === 'center') {
    posX = width / 2
    posY = height / 2
  } else {
    const { corner, offsetX, offsetY } = config

    switch (corner) {
      case 'top-left':
        posX = offsetX
        posY = offsetY
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        break
      case 'top-right':
        posX = width - offsetX
        posY = offsetY
        ctx.textAlign = 'right'
        ctx.textBaseline = 'top'
        break
      case 'bottom-left':
        posX = offsetX
        posY = height - offsetY
        ctx.textAlign = 'left'
        ctx.textBaseline = 'bottom'
        break
      case 'bottom-right':
        posX = width - offsetX
        posY = height - offsetY
        ctx.textAlign = 'right'
        ctx.textBaseline = 'bottom'
        break
      default:
        posX = width / 2
        posY = height / 2
    }
  }

  // 绘制文本阴影
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 2

  ctx.fillText(text, posX, posY)
}
