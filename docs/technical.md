# 倒计时视频生成器 - 技术实现文档

## 项目架构

### 技术栈
- **Electron**: 桌面应用框架
- **React**: UI 框架
- **Canvas API**: 图形渲染
- **MediaRecorder API**: 视频录制
- **font-list**: 系统字体获取

### 项目结构
```
src/
├── main/               # 主进程
│   └── index.js        # 主进程入口，IPC 处理
├── preload/            # 预加载脚本
│   └── index.js        # 暴露安全的 API 给渲染进程
└── renderer/           # 渲染进程
    └── src/
        ├── App.jsx                  # 主应用组件
        ├── App.css                  # 主应用样式
        ├── components/
        │   ├── CountdownPreview.jsx # 倒计时预览组件
        │   ├── CountdownPreview.css
        │   ├── CountdownConfig.jsx  # 配置面板组件
        │   └── CountdownConfig.css
        └── utils/
            └── videoExporter.js     # 视频导出工具
```

## 核心功能实现

### 1. 系统字体获取

#### 主进程 (main/index.js)
使用 `font-list` 库获取系统字体：
```javascript
ipcMain.handle('get-system-fonts', async () => {
  try {
    const fonts = await fontList.getFonts()
    return fonts
  } catch (error) {
    console.error('Error getting fonts:', error)
    return []
  }
})
```

#### 预加载脚本 (preload/index.js)
暴露安全的 API：
```javascript
const api = {
  getSystemFonts: () => ipcRenderer.invoke('get-system-fonts')
}
```

#### 渲染进程 (CountdownConfig.jsx)
在配置组件中加载并显示字体：
```javascript
const [fonts, setFonts] = useState([])

useEffect(() => {
  const loadFonts = async () => {
    const systemFonts = await window.api.getSystemFonts()
    setFonts(systemFonts)
  }
  loadFonts()
}, [])
```

字体下拉菜单中应用字体样式：
```jsx
<select className="font-select">
  {fonts.map((font) => (
    <option key={font} value={font} style={{ fontFamily: font }}>
      {font}
    </option>
  ))}
</select>
```

### 2. 倒计时预览

#### CountdownPreview 组件
使用 Canvas 实时渲染倒计时效果：

**关键功能**：
1. 背景图片渲染（contain 模式）
2. 倒计时文本格式化
3. 位置计算（居中/自定义）
4. 文本阴影效果

**背景图片 contain 模式实现**：
```javascript
const imgRatio = img.width / img.height
const canvasRatio = canvas.width / canvas.height

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
```

**倒计时文本格式化**：
```javascript
function formatCountdownText(countdown, config) {
  const { hours, minutes, seconds } = countdown
  const { hourFormat, minuteFormat, secondFormat, separator } = config

  const parts = []

  if (hourFormat === 'show') {
    parts.push(hours.toString())
  } else if (hourFormat === 'show-2-digits') {
    parts.push(hours.toString().padStart(2, '0'))
  }
  // 同样处理 minutes 和 seconds

  return parts.join(separator || ':')
}
```

### 3. 视频导出

#### MediaRecorder API
使用浏览器原生的 MediaRecorder API 录制 Canvas 内容：

**VideoExporter 类**：
```javascript
export class VideoExporter {
  async startRecording(fps = 30) {
    // 从 Canvas 创建媒体流
    const stream = this.canvas.captureStream(fps)

    // 创建 MediaRecorder
    const options = {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 5000000
    }

    this.mediaRecorder = new MediaRecorder(stream, options)

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data)
      }
    }

    this.mediaRecorder.start()
  }

  stopRecording() {
    return new Promise((resolve, reject) => {
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, {
          type: 'video/webm'
        })
        resolve(blob)
      }
      this.mediaRecorder.stop()
    })
  }
}
```

#### 视频生成流程

1. **创建临时 Canvas**：
```javascript
const tempCanvas = document.createElement('canvas')
tempCanvas.width = container.clientWidth
tempCanvas.height = container.clientHeight
```

2. **逐帧渲染**：
```javascript
const totalFrames = config.totalSeconds * config.fps
for (let frameCount = 0; frameCount < totalFrames; frameCount++) {
  const currentSecond = Math.floor(frameCount / config.fps)
  const remainingSeconds = config.totalSeconds - currentSecond

  // 绘制背景和倒计时文本
  renderFrame(ctx, remainingSeconds, config)

  // 等待一帧时间
  await new Promise(resolve => setTimeout(resolve, 1000 / config.fps))
}
```

3. **保存视频文件**：
```javascript
const blob = await exporter.stopRecording()
const arrayBuffer = await blob.arrayBuffer()
const buffer = new Uint8Array(arrayBuffer)

// 通过 IPC 保存到文件系统
await window.api.saveVideoFile(filePath, buffer)
```

### 4. 位置调整

#### 自动居中
```javascript
if (config.positionMode === 'center') {
  posX = canvas.width / 2
  posY = canvas.height / 2
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
}
```

#### 基于角的偏移
```javascript
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
  // 其他角的处理...
}
```

## IPC 通信

### 主进程定义的 IPC 处理器
1. `get-system-fonts`: 获取系统字体列表
2. `select-background-image`: 打开文件选择对话框选择背景图
3. `save-video-dialog`: 打开保存对话框选择视频保存路径
4. `save-video-file`: 保存视频数据到文件系统

### 安全性
- 使用 `contextIsolation: true` 启用上下文隔离
- 通过 preload 脚本暴露有限的 API
- 不直接暴露 Node.js 模块给渲染进程

## 性能优化

### Canvas 渲染优化
1. 使用 `requestAnimationFrame` 确保流畅的动画
2. **背景图片缓存**：使用 useRef 缓存已加载的图片,避免每次配置变化重新加载
3. **背景分层渲染**：先填充背景颜色,再绘制背景图片（contain模式）
4. 文本渲染使用可配置的阴影效果提升可读性
5. **字体名称清理**：自动移除字体名称中的引号,避免渲染错误

### 视频导出优化
1. **使用 VideoEncoder API (WebCodecs)**：硬件加速的 H.264 编码
2. **GPU资源管理**：
   - 背压控制：限制编码队列大小 ≤ 5帧
   - 定期让渡：每100帧延迟50ms,防止GPU资源耗尽
   - 质量模式：latencyMode设置为'quality'
3. **可配置参数**：
   - 帧率：6/12/24/30 FPS（默认12）
   - 比特率：5/10/20 Mbps（默认5）
4. **使用 mp4-muxer**：创建标准MP4容器
5. **长视频支持**：已优化,支持600秒以上视频导出

### 内存管理
1. 导出完成后清理临时 Canvas
2. 使用流式处理大文件
3. 及时释放 Blob URL
4. 背景图片引用复用,减少内存占用

## 已知限制

1. **视频格式**：目前仅支持 MP4 格式（H.264 编码）
2. **导出时长**：超长视频（30分钟以上）建议分段导出
3. **字体渲染**：某些特殊字体可能在 Canvas 中显示不正确,会自动清理引号
4. **平台差异**：不同操作系统的字体列表和渲染效果可能有差异
5. **GPU要求**：需要支持WebCodecs的现代浏览器引擎和GPU驱动

## 未来改进方向

1. **支持更多格式选项**：不同的编码器配置,导出预设
2. **批量导出**：支持导出多个不同配置的视频
3. **预设模板**：提供常用的倒计时样式模板,支持保存和加载配置
4. **更多视觉效果**：动画、过渡效果、粒子效果等
5. **音频支持**：添加背景音乐或音效
6. **性能监控**：显示导出进度百分比和预计剩余时间
7. **更多格式模式**：除了"经典格式",增加其他显示风格

## 调试技巧

### 开启开发者工具
按 F12 打开 Chrome DevTools 调试渲染进程

### 主进程日志
查看终端输出的主进程日志

### Canvas 调试
可以将临时 Canvas 添加到 DOM 中查看渲染效果：
```javascript
document.body.appendChild(tempCanvas)
tempCanvas.style.position = 'fixed'
tempCanvas.style.top = '0'
tempCanvas.style.left = '0'
tempCanvas.style.zIndex = '9999'
```
