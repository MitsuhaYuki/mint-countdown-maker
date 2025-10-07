# 开发指南

本文档面向希望理解、修改或扩展本项目的开发者。

## 目录
- [开发环境搭建](#开发环境搭建)
- [项目架构](#项目架构)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [调试技巧](#调试技巧)
- [扩展功能](#扩展功能)
- [常见问题](#常见问题)

---

## 开发环境搭建

### 系统要求
- Node.js 16 或更高版本
- npm 或 yarn 包管理器
- Git

### 克隆项目

```bash
git clone <repository-url>
cd mint-countdown-maker
```

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

这将启动：
1. Electron 主进程
2. Vite 开发服务器（渲染进程）
3. 自动打开应用窗口

### 开发工具

推荐使用以下工具：
- **VSCode**: 主要 IDE
- **ESLint**: 代码检查
- **Prettier**: 代码格式化
- **React DevTools**: React 调试（在 Electron DevTools 中可用）

---

## 项目架构

### 目录结构详解

```
mint-countdown-maker/
├── build/                    # 构建资源
│   ├── icon.icns            # macOS 图标
│   ├── icon.ico             # Windows 图标
│   └── icon.png             # Linux 图标
├── docs/                    # 项目文档
│   ├── README.md            # 功能概览
│   ├── user-guide.md        # 用户指南
│   ├── technical.md         # 技术文档
│   ├── api-reference.md     # API 参考
│   └── development.md       # 本文档
├── resources/               # 应用资源
│   └── icon.png            # 应用图标
├── src/
│   ├── main/               # Electron 主进程
│   │   └── index.js        # 主进程入口
│   ├── preload/            # 预加载脚本
│   │   └── index.js        # IPC API 暴露
│   └── renderer/           # 渲染进程（React）
│       ├── index.html      # HTML 模板
│       └── src/
│           ├── main.jsx              # React 入口
│           ├── App.jsx               # 主应用组件
│           ├── App.css               # 主应用样式
│           ├── assets/               # 静态资源
│           │   ├── base.css          # 基础样式
│           │   └── main.css          # 主样式
│           ├── components/           # React 组件
│           │   ├── CountdownPreview.jsx    # 预览组件
│           │   ├── CountdownPreview.css
│           │   ├── CountdownConfig.jsx     # 配置组件
│           │   └── CountdownConfig.css
│           └── utils/                # 工具函数
│               └── videoExporter.js   # 视频导出
├── electron-builder.yml    # Electron Builder 配置
├── electron.vite.config.mjs # Vite 配置
├── eslint.config.mjs       # ESLint 配置
├── package.json            # 项目配置
└── README.md               # 项目说明
```

### 进程架构

Electron 应用采用多进程架构：

```
┌─────────────────────────┐
│     主进程 (Main)        │
│  - 窗口管理              │
│  - IPC 通信              │
│  - 系统 API 访问         │
└───────────┬─────────────┘
            │
            │ IPC
            │
┌───────────┴─────────────┐
│   渲染进程 (Renderer)    │
│  - React UI             │
│  - Canvas 渲染           │
│  - 用户交互              │
└─────────────────────────┘
            │
            │ Context Bridge
            │
┌───────────┴─────────────┐
│   预加载脚本 (Preload)   │
│  - 安全的 API 暴露       │
│  - IPC 封装              │
└─────────────────────────┘
```

---

## 开发流程

### 1. 添加新功能

#### 步骤 1: 规划
- 明确功能需求
- 设计 UI 界面
- 确定需要的配置项

#### 步骤 2: 实现 UI
在 `CountdownConfig.jsx` 中添加配置选项：

```jsx
<div className="config-item">
  <label>新功能：</label>
  <input
    type="text"
    value={config.newFeature}
    onChange={(e) => onConfigChange({
      ...config,
      newFeature: e.target.value
    })}
  />
</div>
```

#### 步骤 3: 更新预览
在 `CountdownPreview.jsx` 中使用新配置：

```jsx
useEffect(() => {
  // 使用 config.newFeature 更新渲染逻辑
}, [config])
```

#### 步骤 4: 更新导出
在 `App.jsx` 的导出逻辑中应用新功能。

#### 步骤 5: 测试
- 在预览中测试效果
- 导出视频验证
- 检查不同配置组合

### 2. 修复 Bug

#### 步骤 1: 重现问题
- 记录触发条件
- 查看控制台错误
- 检查相关代码

#### 步骤 2: 定位问题
使用调试工具：
```javascript
console.log('调试信息:', variable)
debugger  // 在代码中设置断点
```

#### 步骤 3: 修复并测试
- 实施修复
- 编写测试用例
- 验证不同场景

### 3. 性能优化

#### 识别性能瓶颈
```javascript
console.time('渲染时间')
// 执行渲染代码
console.timeEnd('渲染时间')
```

#### 常见优化点
1. **Canvas 渲染优化**
2. **React 组件优化**（使用 memo）
3. **事件处理优化**（使用 debounce）

---

## 代码规范

### JavaScript/JSX 规范

#### 1. 命名约定
```javascript
// 组件名：PascalCase
function CountdownPreview() {}

// 变量/函数名：camelCase
const fontSize = 72
function handleConfigChange() {}

// 常量：UPPER_SNAKE_CASE
const MAX_FONT_SIZE = 500

// 私有变量：_开头
const _internalState = {}
```

#### 2. 组件结构
```jsx
import { useState, useEffect } from 'react'
import './Component.css'

function Component({ prop1, prop2 }) {
  // 1. State 定义
  const [state, setState] = useState(initial)

  // 2. Effect 钩子
  useEffect(() => {
    // 副作用逻辑
  }, [dependencies])

  // 3. 事件处理函数
  const handleEvent = () => {
    // 处理逻辑
  }

  // 4. 渲染辅助函数
  const renderHelper = () => {
    // 渲染逻辑
  }

  // 5. 返回 JSX
  return (
    <div>
      {/* JSX */}
    </div>
  )
}

export default Component
```

#### 3. 代码注释
```javascript
/**
 * 函数说明
 * @param {string} param1 - 参数说明
 * @returns {boolean} 返回值说明
 */
function myFunction(param1) {
  // 单行注释

  /*
   * 多行注释
   * 详细说明
   */
}
```

### CSS 规范

#### 1. 类名约定
使用 kebab-case：
```css
.countdown-preview { }
.config-item { }
.export-button { }
```

#### 2. 组织结构
```css
/* 布局 */
.container {
  display: flex;
}

/* 尺寸 */
.container {
  width: 100%;
  height: 100vh;
}

/* 样式 */
.container {
  background: #fff;
  color: #000;
}

/* 交互 */
.container:hover {
  opacity: 0.8;
}
```

---

## 调试技巧

### 1. 渲染进程调试

#### 打开 DevTools
- 快捷键：F12
- 或在代码中：`window.electron.ipcRenderer.send('open-devtools')`

#### React 调试
```jsx
// 使用 console.log
console.log('State:', state)

// 使用 React DevTools
// 在 Chrome DevTools 的 Components 标签中查看

// 使用断点
debugger
```

### 2. 主进程调试

#### 查看主进程输出
```bash
# 在启动应用的终端中查看输出
npm run dev
```

#### 调试日志
在 `main/index.js` 中：
```javascript
console.log('主进程日志:', data)
```

### 3. IPC 通信调试

#### 渲染进程发送
```javascript
console.log('发送 IPC:', 'channel-name', data)
await window.api.someMethod()
console.log('接收响应:', result)
```

#### 主进程接收
```javascript
ipcMain.handle('channel-name', (event, data) => {
  console.log('收到 IPC:', data)
  return result
})
```

### 4. Canvas 调试

#### 显示调试信息
```javascript
ctx.fillStyle = 'red'
ctx.fillText(`Debug: ${value}`, 10, 10)
```

#### 导出 Canvas 为图片
```javascript
const dataUrl = canvas.toDataURL()
console.log(dataUrl)
// 在浏览器中打开查看
```

---

## 扩展功能

### 添加新的视频格式支持

目前仅支持 WebM，要添加 MP4 支持：

#### 1. 安装 ffmpeg.js
```bash
npm install @ffmpeg/ffmpeg @ffmpeg/core
```

#### 2. 创建转换工具
```javascript
// src/renderer/src/utils/ffmpegConverter.js
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

export async function convertToMP4(webmBlob) {
  const ffmpeg = createFFmpeg({ log: true })
  await ffmpeg.load()

  ffmpeg.FS('writeFile', 'input.webm', await fetchFile(webmBlob))
  await ffmpeg.run('-i', 'input.webm', 'output.mp4')

  const data = ffmpeg.FS('readFile', 'output.mp4')
  return new Blob([data.buffer], { type: 'video/mp4' })
}
```

### 添加动画效果

在 Canvas 渲染中添加动画：

```javascript
// 淡入效果
const progress = frameCount / (config.fps * 1) // 1秒淡入
const opacity = Math.min(progress, 1)
ctx.globalAlpha = opacity

// 缩放效果
const scale = 0.5 + (0.5 * progress)
ctx.scale(scale, scale)
```

### 添加音频支持

#### 1. 安装依赖
```bash
npm install web-audio-api
```

#### 2. 合并音频和视频
使用 ffmpeg 或 Web Audio API。

### 添加预设模板

#### 1. 定义模板
```javascript
const templates = {
  modern: {
    fontFamily: 'Arial',
    fontSize: 80,
    fontColor: '#00ff00',
    positionMode: 'center'
  },
  classic: {
    fontFamily: 'Times New Roman',
    fontSize: 72,
    fontColor: '#ffffff',
    positionMode: 'center'
  }
}
```

#### 2. 添加模板选择器
在 `CountdownConfig.jsx` 中：
```jsx
<select onChange={(e) => onConfigChange(templates[e.target.value])}>
  <option value="modern">现代风格</option>
  <option value="classic">经典风格</option>
</select>
```

---

## 常见问题

### Q: 如何添加新的配置选项？

**A**:
1. 在 `App.jsx` 的初始 config 中添加默认值
2. 在 `CountdownConfig.jsx` 中添加 UI 控件
3. 在 `CountdownPreview.jsx` 中使用新配置
4. 更新导出逻辑

### Q: 如何调试 Canvas 渲染问题？

**A**:
1. 将 Canvas 元素设置为可见
2. 使用 `canvas.toDataURL()` 导出图片查看
3. 在渲染函数中添加 console.log
4. 检查字体是否正确加载

### Q: 视频导出很慢怎么办？

**A**:
1. 降低帧率（24 FPS）
2. 减少倒计时时长
3. 优化渲染逻辑
4. 使用硬件加速

### Q: 如何支持更多系统字体？

**A**:
font-list 库会自动获取系统字体。如果某些字体未列出：
1. 检查字体是否正确安装
2. 尝试刷新字体缓存
3. 手动添加字体路径

---

## 发布流程

### 1. 版本更新

#### 更新版本号
```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

### 2. 构建应用

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

### 3. 测试构建

在目标平台上测试构建的应用：
- 功能完整性
- 性能表现
- 兼容性

### 4. 发布

将构建文件上传到发布平台或分发渠道。

---

## 贡献指南

### 提交代码

#### 1. 创建分支
```bash
git checkout -b feature/new-feature
```

#### 2. 提交更改
```bash
git add .
git commit -m "Add: 新功能描述"
```

#### 3. 推送分支
```bash
git push origin feature/new-feature
```

#### 4. 创建 Pull Request

### 提交信息规范

```
<type>: <subject>

<body>

<footer>
```

**Type**:
- `Add`: 新功能
- `Fix`: Bug 修复
- `Update`: 更新现有功能
- `Refactor`: 代码重构
- `Docs`: 文档更新
- `Style`: 代码格式
- `Test`: 测试相关
- `Chore`: 构建/工具更新

---

## 资源和参考

### 官方文档
- [Electron 文档](https://www.electronjs.org/docs)
- [React 文档](https://reactjs.org/docs)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)

### 社区资源
- [Electron 社区](https://www.electronjs.org/community)
- [React 社区](https://reactjs.org/community)

### 相关项目
- [electron-vite](https://electron-vite.org/)
- [electron-builder](https://www.electron.build/)

---

## 许可证

MIT License - 详见 LICENSE 文件

---

**Happy Coding! 🚀**
