import { useState, useEffect, useRef } from 'react'
import CountdownPreview from './components/CountdownPreview'
import CountdownConfig from './components/CountdownConfig'
import { VideoExporter, renderCountdownFrame } from './utils/videoExporter'
import './App.css'

function App() {
  // 默认配置
  const [config, setConfig] = useState({
    fontFamily: 'Arial',
    fontSize: 144,
    fontColor: '#000000',
    textShadowEnabled: false,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowBlur: 10,
    textShadowOffsetX: 2,
    textShadowOffsetY: 2,
    blendMode: 'none',
    formatMode: 'classic',
    hourFormat: 'auto',
    minuteFormat: 'two-digits',
    secondFormat: 'two-digits',
    separator: ':',
    totalSeconds: 60,
    startDelay: 0,
    backgroundColor: '#ffffff',
    backgroundImage: null,
    backgroundSize: 'cover',
    positionMode: 'center',
    corner: 'top-left',
    offsetX: 50,
    offsetY: 50,
    fps: 12,
    bitrate: 5
  })

  // 当前倒计时状态
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 1,
    seconds: 0
  })

  const [isPlaying, setIsPlaying] = useState(false)
  const [isInDelay, setIsInDelay] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const intervalRef = useRef(null)
  const canvasRef = useRef(null)

  // 更新倒计时显示
  // 重置倒计时到初始状态
  const resetCountdown = () => {
    const totalSeconds = config.totalSeconds
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    setCountdown({ hours, minutes, seconds })
  }

  useEffect(() => {
    resetCountdown()
  }, [config.totalSeconds])

  // 播放/停止倒计时预览
  const togglePlay = () => {
    if (isPlaying) {
      // 停止播放并重置
      clearInterval(intervalRef.current)
      setIsPlaying(false)
      setIsInDelay(false)
      resetCountdown()
    } else {
      // 开始播放
      setIsPlaying(true)

      // 延迟阶段：保持初始时间不变
      let delayRemaining = config.startDelay
      let countdownRemaining = config.totalSeconds

      // 如果有延迟，设置延迟状态
      if (delayRemaining > 0) {
        setIsInDelay(true)
      }

      intervalRef.current = setInterval(() => {
        if (delayRemaining > 0) {
          // 延迟期间，保持显示初始倒计时时间
          delayRemaining -= 1
          // 倒计时数字不变，保持初始状态

          // 延迟结束时，取消延迟状态
          if (delayRemaining === 0) {
            setIsInDelay(false)
          }
        } else {
          // 延迟结束，开始真正的倒计时
          countdownRemaining -= 1

          if (countdownRemaining < 0) {
            clearInterval(intervalRef.current)
            setIsPlaying(false)
            setIsInDelay(false)
            resetCountdown()
            return
          }

          const hours = Math.floor(countdownRemaining / 3600)
          const minutes = Math.floor((countdownRemaining % 3600) / 60)
          const seconds = countdownRemaining % 60

          setCountdown({ hours, minutes, seconds })
        }
      }, 1000)
    }
  }

  // 导出视频
  const handleExportVideo = async () => {
    if (isExporting) return

    setIsExporting(true)
    setExportProgress(0)

    try {
      // 创建一个临时 canvas 用于录制
      const tempCanvas = document.createElement('canvas')
      const container = document.querySelector('.countdown-preview')

      if (!container) {
        throw new Error('预览区域未找到')
      }

      tempCanvas.width = container.clientWidth
      tempCanvas.height = container.clientHeight
      const ctx = tempCanvas.getContext('2d')

      // 创建视频导出器
      const exporter = new VideoExporter(tempCanvas)

      // 预加载背景图片
      let backgroundImg = null
      if (config.backgroundImage) {
        backgroundImg = new Image()
        await new Promise((resolve, reject) => {
          backgroundImg.onload = resolve
          backgroundImg.onerror = reject
          backgroundImg.src = config.backgroundImage
        })
      }

      // 开始录制
      await exporter.startRecording(config.fps, config.bitrate)

      // 辅助函数：绘制背景
      const drawBackground = () => {
        ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height)

        // 先填充背景颜色
        ctx.fillStyle = config.backgroundColor || '#ffffff'
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

        // 如果有背景图片，在背景颜色上绘制图片
        if (backgroundImg) {
          const imgRatio = backgroundImg.width / backgroundImg.height
          const canvasRatio = tempCanvas.width / tempCanvas.height

          let drawWidth, drawHeight, x, y

          // 根据 backgroundSize 选择不同的显示模式
          const size = config.backgroundSize || 'cover'

          if (size === 'cover') {
            // Cover 模式：填满画布，可能裁剪图片
            if (imgRatio > canvasRatio) {
              // 图片更宽，以高度为准
              drawHeight = tempCanvas.height
              drawWidth = tempCanvas.height * imgRatio
              x = (tempCanvas.width - drawWidth) / 2
              y = 0
            } else {
              // 图片更高，以宽度为准
              drawWidth = tempCanvas.width
              drawHeight = tempCanvas.width / imgRatio
              x = 0
              y = (tempCanvas.height - drawHeight) / 2
            }
          } else {
            // Contain 模式：完整显示图片，可能留白
            if (imgRatio > canvasRatio) {
              // 图片更宽，以宽度为准
              drawWidth = tempCanvas.width
              drawHeight = tempCanvas.width / imgRatio
              x = 0
              y = (tempCanvas.height - drawHeight) / 2
            } else {
              // 图片更高，以高度为准
              drawHeight = tempCanvas.height
              drawWidth = tempCanvas.height * imgRatio
              x = (tempCanvas.width - drawWidth) / 2
              y = 0
            }
          }

          ctx.drawImage(backgroundImg, x, y, drawWidth, drawHeight)
        }
      }

      // 辅助函数：绘制倒计时文本
      const drawCountdownText = (remainingSeconds) => {
        const hours = Math.floor(remainingSeconds / 3600)
        const minutes = Math.floor((remainingSeconds % 3600) / 60)
        const seconds = remainingSeconds % 60

        let text = ''

        // 纯数字模式：直接显示剩余秒数
        if (config.formatMode === 'pure-number') {
          text = remainingSeconds.toString()
        } else {
          // 经典格式模式
          const parts = []
          const values = { hours, minutes, seconds }
          const formats = {
            hours: config.hourFormat,
            minutes: config.minuteFormat,
            seconds: config.secondFormat
          }
          const order = ['hours', 'minutes', 'seconds']

          // 找到最高位（第一个非零的位）
          let highestNonZero = -1
          for (let i = 0; i < order.length; i++) {
            if (values[order[i]] > 0) {
              highestNonZero = i
              break
            }
          }

          // 处理每一位
          order.forEach((unit, index) => {
            const value = values[unit]
            const format = formats[unit]

            if (format === 'auto') {
              // 自动模式
              if (highestNonZero === -1) {
                // 所有位都是0，显示0
                if (index === order.length - 1) {
                  parts.push('0')
                }
              } else if (index < highestNonZero) {
                // 高于最高非零位，不显示
                return
              } else if (index === highestNonZero) {
                // 是最高非零位，显示
                parts.push(value.toString())
              } else {
                // 低于最高非零位
                const prevUnit = order[index - 1]
                const prevFormat = formats[prevUnit]
                if (prevFormat === 'auto') {
                  parts.push(value.toString())
                } else {
                  parts.push(value.toString())
                }
              }
            } else if (format === 'show') {
              // 显示：不补0
              parts.push(value.toString())
            } else if (format === 'two-digits') {
              // 两位数字：补0
              parts.push(value.toString().padStart(2, '0'))
            }
          })

          text = parts.join(config.separator || ':')
        }

        // 设置字体 - 清理字体名称中的引号
        const cleanFontFamily = config.fontFamily.replace(/["']/g, '')
        ctx.font = `${config.fontSize}px "${cleanFontFamily}"`
        ctx.fillStyle = config.fontColor || '#ffffff'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // 计算位置
        let posX, posY

        if (config.positionMode === 'center') {
          posX = tempCanvas.width / 2
          posY = tempCanvas.height / 2
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
              posX = tempCanvas.width - offsetX
              posY = offsetY
              ctx.textAlign = 'right'
              ctx.textBaseline = 'top'
              break
            case 'bottom-left':
              posX = offsetX
              posY = tempCanvas.height - offsetY
              ctx.textAlign = 'left'
              ctx.textBaseline = 'bottom'
              break
            case 'bottom-right':
              posX = tempCanvas.width - offsetX
              posY = tempCanvas.height - offsetY
              ctx.textAlign = 'right'
              ctx.textBaseline = 'bottom'
              break
            default:
              posX = tempCanvas.width / 2
              posY = tempCanvas.height / 2
          }
        }

        // 绘制文本阴影
        if (config.textShadowEnabled) {
          ctx.shadowColor = config.textShadowColor || 'rgba(0, 0, 0, 0.8)'
          ctx.shadowBlur = config.textShadowBlur || 10
          ctx.shadowOffsetX = config.textShadowOffsetX || 2
          ctx.shadowOffsetY = config.textShadowOffsetY || 2
        } else {
          ctx.shadowColor = 'transparent'
          ctx.shadowBlur = 0
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 0
        }

        // 应用混合模式
        if (config.blendMode && config.blendMode !== 'none') {
          ctx.globalCompositeOperation = config.blendMode
        } else {
          ctx.globalCompositeOperation = 'source-over'
        }

        ctx.fillText(text, posX, posY)

        // 重置混合模式
        ctx.globalCompositeOperation = 'source-over'
      }

      // 计算总帧数（延迟帧 + 倒计时帧）
      const delayFrames = config.startDelay * config.fps
      const countdownFrames = config.totalSeconds * config.fps
      const totalFrames = delayFrames + countdownFrames

      // 1. 渲染延迟帧（显示初始倒计时时间，但不倒数）
      for (let frameCount = 0; frameCount < delayFrames; frameCount++) {
        drawBackground()
        drawCountdownText(config.totalSeconds) // 显示初始时间
        await exporter.addFrame()
        setExportProgress(Math.floor(((frameCount + 1) / totalFrames) * 100))

        // 每30帧让渡控制权，保持UI响应
        if (frameCount % 30 === 0) {
          await new Promise(resolve => setTimeout(resolve, 0))
        }
      }

      // 2. 渲染倒计时帧（开始真正的倒计时）
      for (let frameCount = 0; frameCount < countdownFrames; frameCount++) {
        const currentSecond = Math.floor(frameCount / config.fps)
        const remainingSeconds = config.totalSeconds - currentSecond

        drawBackground()
        drawCountdownText(remainingSeconds)
        await exporter.addFrame()

        // 更新进度（延迟帧 + 当前倒计时帧）
        const currentTotalFrame = delayFrames + frameCount + 1
        setExportProgress(Math.floor((currentTotalFrame / totalFrames) * 100))

        // 每30帧让渡控制权，保持UI响应
        if (frameCount % 30 === 0) {
          await new Promise(resolve => setTimeout(resolve, 0))
        }
      }

      // 停止录制并获取视频
      const blob = await exporter.stopRecording()

      // 保存文件
      const filePath = await window.api.saveVideoDialog()
      if (filePath) {
        // 将 blob 转换为 buffer 并保存
        const arrayBuffer = await blob.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        // 通过 IPC 保存文件
        const result = await window.api.saveVideoFile(filePath, buffer)
        if (result.success) {
          console.log('视频导出完成:', filePath)
          alert('视频导出成功！')
        } else {
          throw new Error(result.error || '保存文件失败')
        }
      }

    } catch (error) {
      console.error('导出视频失败:', error)
      alert('导出视频失败: ' + error.message)
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  return (
    <div className="app-container">
      <div className="preview-section">
        <div className="preview-header">
          <h2>预览</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isInDelay && (
              <span style={{
                fontSize: '14px',
                color: '#ffa500',
                fontWeight: 'bold',
                padding: '4px 12px',
                backgroundColor: 'rgba(255, 165, 0, 0.1)',
                borderRadius: '4px',
                border: '1px solid rgba(255, 165, 0, 0.3)'
              }}>
                ⏱ 开始前延迟中...
              </span>
            )}
            <button onClick={togglePlay} className="play-button">
              {isPlaying ? '⏹ 停止' : '▶ 播放'}
            </button>
          </div>
        </div>
        <CountdownPreview config={config} countdown={countdown} />
      </div>

      <div className="config-panel">
        <CountdownConfig
          config={config}
          onConfigChange={setConfig}
          onExportVideo={handleExportVideo}
        />

        {isExporting && (
          <div className="export-overlay">
            <div className="export-progress">
              <h3>正在导出视频...</h3>
              <div className="export-progress-desc">此界面可能会在100%停留一会，是正常现象，请稍作等待</div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
              <p>{exportProgress}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
