import { useEffect, useRef } from 'react'
import './CountdownPreview.css'

function CountdownPreview({ config, countdown }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const imageRef = useRef(null)
  const imageLoadedRef = useRef(false)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const container = containerRef.current

    // Set canvas size to match container
    canvas.width = container.clientWidth
    canvas.height = container.clientHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 先填充背景颜色
    ctx.fillStyle = config.backgroundColor || '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 绘制背景图片（如果存在）
    const drawBackgroundAndCountdown = () => {
      // 如果有背景图片且已加载，绘制它
      if (imageRef.current && imageLoadedRef.current) {
        const img = imageRef.current
        const imgRatio = img.width / img.height
        const canvasRatio = canvas.width / canvas.height

        let drawWidth, drawHeight, x, y

        if (imgRatio > canvasRatio) {
          drawWidth = canvas.width
          drawHeight = canvas.width / imgRatio
          x = 0
          y = (canvas.height - drawHeight) / 2
        } else {
          drawHeight = canvas.height
          drawWidth = canvas.height * imgRatio
          x = (canvas.width - drawWidth) / 2
          y = 0
        }

        ctx.drawImage(img, x, y, drawWidth, drawHeight)
      }

      drawCountdown()
    }

    // 处理背景图片加载
    if (config.backgroundImage) {
      // 如果图片 URL 改变了，重新加载
      if (!imageRef.current || imageRef.current.src !== config.backgroundImage) {
        imageLoadedRef.current = false
        const img = new Image()
        img.onload = () => {
          imageRef.current = img
          imageLoadedRef.current = true
          // 重新绘制以显示加载完成的图片
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.fillStyle = config.backgroundColor || '#ffffff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          drawBackgroundAndCountdown()
        }
        img.onerror = () => {
          console.error('背景图片加载失败')
          imageRef.current = null
          imageLoadedRef.current = false
          drawCountdown()
        }
        img.src = config.backgroundImage

        // 如果图片已经缓存，可能立即触发 onload
        if (img.complete) {
          drawBackgroundAndCountdown()
        }
      } else {
        // 图片已加载，直接绘制
        drawBackgroundAndCountdown()
      }
    } else {
      // 没有背景图片
      imageRef.current = null
      imageLoadedRef.current = false
      drawCountdown()
    }

    function drawCountdown() {
      // Format countdown text
      const text = formatCountdownText(countdown, config)

      if (!text) return

      // Set font - 清理字体名称中的引号
      const cleanFontFamily = config.fontFamily.replace(/["']/g, '')
      ctx.font = `${config.fontSize}px "${cleanFontFamily}"`
      ctx.fillStyle = config.fontColor || '#ffffff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Calculate position
      let posX, posY

      if (config.positionMode === 'center') {
        posX = canvas.width / 2
        posY = canvas.height / 2
      } else {
        // Calculate based on corner and offset
        const { corner, offsetX, offsetY } = config

        switch (corner) {
          case 'top-left':
            posX = offsetX
            posY = offsetY
            ctx.textAlign = 'left'
            ctx.textBaseline = 'top'
            break
          case 'top-right':
            posX = canvas.width - offsetX
            posY = offsetY
            ctx.textAlign = 'right'
            ctx.textBaseline = 'top'
            break
          case 'bottom-left':
            posX = offsetX
            posY = canvas.height - offsetY
            ctx.textAlign = 'left'
            ctx.textBaseline = 'bottom'
            break
          case 'bottom-right':
            posX = canvas.width - offsetX
            posY = canvas.height - offsetY
            ctx.textAlign = 'right'
            ctx.textBaseline = 'bottom'
            break
          default:
            posX = canvas.width / 2
            posY = canvas.height / 2
        }
      }

      // Draw text with shadow for better visibility
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

      ctx.fillText(text, posX, posY)
    }
  }, [config, countdown])

  function formatCountdownText(countdown, config) {
    const { hours, minutes, seconds } = countdown
    const { hourFormat, minuteFormat, secondFormat, separator } = config

    const parts = []
    const values = { hours, minutes, seconds }
    const formats = { hours: hourFormat, minutes: minuteFormat, seconds: secondFormat }
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

      if (format === 'hide') {
        // 隐藏：不显示
        return
      } else if (format === 'auto') {
        // 自动模式：当该位是最高位且有值时显示
        // 但是如果低于最高位的上级不是自动模式，则依旧显示
        if (highestNonZero === -1) {
          // 所有位都是0，显示0
          if (index === order.length - 1) {
            // 最后一位，显示0
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
          // 检查上一位是否是自动模式
          const prevUnit = order[index - 1]
          const prevFormat = formats[prevUnit]
          if (prevFormat === 'auto') {
            // 上一位是自动，且该位是自动，显示
            parts.push(value.toString())
          } else {
            // 上一位不是自动，该位显示（补0或不补0取决于上级格式）
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

    return parts.join(separator || ':')
  }

  return (
    <div className="countdown-preview" ref={containerRef}>
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}

export default CountdownPreview
