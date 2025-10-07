# API 参考文档

## 目录
- [IPC 通信 API](#ipc-通信-api)
- [React 组件 API](#react-组件-api)
- [工具函数 API](#工具函数-api)
- [配置对象结构](#配置对象结构)

---

## IPC 通信 API

IPC（Inter-Process Communication）API 用于渲染进程和主进程之间的通信。

### window.api.getSystemFonts()

获取系统中所有可用的字体列表。

**返回值**: `Promise<string[]>`

**示例**:
```javascript
const fonts = await window.api.getSystemFonts()
console.log(fonts) // ['Arial', 'Times New Roman', ...]
```

---

### window.api.selectBackgroundImage()

打开文件选择对话框，选择背景图片。

**返回值**: `Promise<{ path: string, data: string } | null>`
- `path`: 图片文件的完整路径
- `data`: Base64 编码的图片数据（Data URL 格式）
- 返回 `null` 表示用户取消了选择

**支持的图片格式**: JPG, JPEG, PNG, GIF, BMP, WebP

**示例**:
```javascript
const result = await window.api.selectBackgroundImage()
if (result) {
  console.log('文件路径:', result.path)
  console.log('图片数据:', result.data) // data:image/png;base64,...
}
```

---

### window.api.saveVideoDialog()

打开保存文件对话框，选择视频保存位置。

**返回值**: `Promise<string | null>`
- 返回选择的文件路径
- 返回 `null` 表示用户取消了保存

**默认文件名**: `countdown.webm`

**示例**:
```javascript
const filePath = await window.api.saveVideoDialog()
if (filePath) {
  console.log('保存路径:', filePath)
}
```

---

### window.api.saveVideoFile(filePath, buffer)

保存视频数据到指定文件。

**参数**:
- `filePath` (string): 文件保存路径
- `buffer` (Uint8Array): 视频数据的字节数组

**返回值**: `Promise<{ success: boolean, error?: string }>`
- `success`: 是否保存成功
- `error`: 错误信息（如果保存失败）

**示例**:
```javascript
const blob = await exporter.stopRecording()
const arrayBuffer = await blob.arrayBuffer()
const buffer = new Uint8Array(arrayBuffer)

const result = await window.api.saveVideoFile(filePath, buffer)
if (result.success) {
  console.log('视频保存成功')
} else {
  console.error('保存失败:', result.error)
}
```

---

## React 组件 API

### CountdownPreview

倒计时预览组件，使用 Canvas 渲染倒计时效果。

#### Props

| 属性名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| config | Object | 是 | 倒计时配置对象（见[配置对象结构](#配置对象结构)） |
| countdown | Object | 是 | 当前倒计时状态 `{ hours, minutes, seconds }` |

#### 示例
```jsx
<CountdownPreview
  config={{
    fontFamily: 'Arial',
    fontSize: 72,
    fontColor: '#ffffff',
    // ... 其他配置
  }}
  countdown={{
    hours: 0,
    minutes: 1,
    seconds: 30
  }}
/>
```

---

### CountdownConfig

倒计时配置面板组件。

#### Props

| 属性名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| config | Object | 是 | 当前配置对象 |
| onConfigChange | Function | 是 | 配置变化回调函数 `(newConfig) => void` |
| onExportVideo | Function | 是 | 导出视频按钮点击回调 `() => void` |

#### 示例
```jsx
<CountdownConfig
  config={config}
  onConfigChange={(newConfig) => setConfig(newConfig)}
  onExportVideo={handleExportVideo}
/>
```

---

## 工具函数 API

### VideoExporter

视频导出工具类。

#### 构造函数

```javascript
new VideoExporter(canvas)
```

**参数**:
- `canvas` (HTMLCanvasElement): 要录制的 Canvas 元素

---

#### startRecording(fps)

开始录制视频。

**参数**:
- `fps` (number, 可选): 帧率，默认 30

**返回值**: `Promise<void>`

**示例**:
```javascript
const exporter = new VideoExporter(canvas)
await exporter.startRecording(30)
```

---

#### stopRecording()

停止录制并返回视频数据。

**返回值**: `Promise<Blob>`

**示例**:
```javascript
const blob = await exporter.stopRecording()
console.log('视频大小:', blob.size, '字节')
```

---

### renderCountdownFrame()

渲染单帧倒计时图像（已弃用，仅供参考）。

```javascript
renderCountdownFrame(ctx, width, height, config, remainingSeconds)
```

**参数**:
- `ctx` (CanvasRenderingContext2D): Canvas 2D 渲染上下文
- `width` (number): Canvas 宽度
- `height` (number): Canvas 高度
- `config` (Object): 配置对象
- `remainingSeconds` (number): 剩余秒数

---

## 配置对象结构

完整的配置对象包含以下属性：

```typescript
interface Config {
  // 字体设置
  fontFamily: string          // 字体名称，如 'Arial'
  fontSize: number            // 字号大小（像素），范围 12-500
  fontColor: string           // 字体颜色（十六进制），如 '#ffffff'

  // 倒计时格式
  hourFormat: 'hide' | 'show' | 'show-2-digits'    // 小时显示格式
  minuteFormat: 'hide' | 'show' | 'show-2-digits'  // 分钟显示格式
  secondFormat: 'hide' | 'show' | 'show-2-digits'  // 秒显示格式
  separator: string           // 分隔符，如 ':'
  totalSeconds: number        // 总秒数，范围 1-86400

  // 背景设置
  backgroundImage: string | null  // 背景图片（Data URL 格式）或 null

  // 位置设置
  positionMode: 'center' | 'custom'  // 定位模式
  corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'  // 基准角
  offsetX: number             // X 偏移（像素）
  offsetY: number             // Y 偏移（像素）

  // 导出设置
  fps: 24 | 30 | 60          // 帧率
}
```

### 默认配置

```javascript
const defaultConfig = {
  fontFamily: 'Arial',
  fontSize: 72,
  fontColor: '#ffffff',
  hourFormat: 'show-2-digits',
  minuteFormat: 'show-2-digits',
  secondFormat: 'show-2-digits',
  separator: ':',
  totalSeconds: 60,
  backgroundImage: null,
  positionMode: 'center',
  corner: 'top-left',
  offsetX: 50,
  offsetY: 50,
  fps: 30
}
```

---

## 数据类型定义

### Countdown

倒计时状态对象。

```typescript
interface Countdown {
  hours: number    // 小时（0-23）
  minutes: number  // 分钟（0-59）
  seconds: number  // 秒（0-59）
}
```

### ImageResult

图片选择结果。

```typescript
interface ImageResult {
  path: string     // 文件路径
  data: string     // Base64 编码的图片数据
}
```

### SaveResult

文件保存结果。

```typescript
interface SaveResult {
  success: boolean   // 是否成功
  error?: string     // 错误信息（如果失败）
}
```

---

## 事件和回调

### onConfigChange

配置变化回调函数。

**签名**: `(newConfig: Config) => void`

**触发时机**: 任何配置项变化时

**示例**:
```javascript
const handleConfigChange = (newConfig) => {
  console.log('配置已更新:', newConfig)
  setConfig(newConfig)
}
```

---

### onExportVideo

导出视频按钮点击回调。

**签名**: `() => void`

**触发时机**: 点击"导出视频"按钮时

**示例**:
```javascript
const handleExportVideo = async () => {
  console.log('开始导出视频...')
  // 导出逻辑
}
```

---

## 常量和枚举

### 显示格式

```javascript
const DisplayFormats = {
  HIDE: 'hide',              // 不显示
  SHOW: 'show',              // 显示
  SHOW_2_DIGITS: 'show-2-digits'  // 显示2位数
}
```

### 位置模式

```javascript
const PositionModes = {
  CENTER: 'center',          // 居中
  CUSTOM: 'custom'           // 自定义
}
```

### 基准角

```javascript
const Corners = {
  TOP_LEFT: 'top-left',          // 左上角
  TOP_RIGHT: 'top-right',        // 右上角
  BOTTOM_LEFT: 'bottom-left',    // 左下角
  BOTTOM_RIGHT: 'bottom-right'   // 右下角
}
```

### 帧率选项

```javascript
const FpsOptions = [24, 30, 60]
```

---

## 错误处理

### 常见错误

#### 字体加载失败
```javascript
try {
  const fonts = await window.api.getSystemFonts()
} catch (error) {
  console.error('字体加载失败:', error)
  // 使用默认字体列表
}
```

#### 图片加载失败
```javascript
const img = new Image()
img.onerror = () => {
  console.error('图片加载失败')
}
img.src = config.backgroundImage
```

#### 视频导出失败
```javascript
try {
  await handleExportVideo()
} catch (error) {
  console.error('导出失败:', error)
  alert('导出视频失败: ' + error.message)
}
```

---

## 性能优化建议

### 1. 背景图片预加载

```javascript
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// 使用
const img = await preloadImage(config.backgroundImage)
```

### 2. 防抖配置更新

```javascript
import { debounce } from 'lodash'

const debouncedConfigChange = debounce((newConfig) => {
  setConfig(newConfig)
}, 300)
```

### 3. 内存清理

```javascript
// 导出完成后清理
useEffect(() => {
  return () => {
    // 清理资源
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }
}, [])
```

---

## 版本兼容性

- Electron: 38.1.2+
- React: 19.1.1+
- Node.js: 16+

---

## 相关文档

- [用户指南](user-guide.md)
- [技术文档](technical.md)
- [功能概览](README.md)
