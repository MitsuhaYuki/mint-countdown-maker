# 倒计时视频生成器 (Countdown Video Maker)

一个功能强大的桌面应用程序，用于创建自定义倒计时视频。基于 Electron + React 构建，支持灵活的配置和高质量的视频导出。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Electron](https://img.shields.io/badge/Electron-38.1.2-blue)
![React](https://img.shields.io/badge/React-19.1.1-blue)

## ✨ 功能特性

### 🎨 丰富的自定义选项
- **字体选择**: 自动获取系统所有可用字体，下拉菜单实时预览字体效果
- **字号调整**: 支持 12-500px 的字号范围
- **颜色定制**: 自由选择字体颜色
- **背景图片**: 支持添加自定义背景图片，以 contain 模式完美适配

### ⏱️ 灵活的倒计时格式
- 时、分、秒独立配置
- 三种显示模式：不显示 / 显示 / 显示2位数（补0）
- 自定义分隔符
- 支持 1 秒到 24 小时的倒计时

### 📍 精准的位置控制
- **自动居中**: 一键居中对齐
- **自定义位置**: 基于四个角的坐标偏移系统
  - 支持左上、右上、左下、右下四个基准角
  - 精确控制 X/Y 坐标偏移

### 🎬 高质量视频导出
- 支持 24/30/60 FPS 帧率选择
- WebM 格式（VP9 编码）
- 基于预览区域尺寸的 1:1 视频输出
- 实时进度显示

### 👁️ 实时预览
- 左右分屏布局，配置即时生效
- 内置播放/暂停功能，预览倒计时动画效果

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发模式

```bash
npm run dev
# 或
yarn dev
```

### 构建应用

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

## 📖 文档

- **[用户指南](docs/user-guide.md)**: 详细的使用说明和配置指导
- **[技术文档](docs/technical.md)**: 技术实现细节和架构说明
- **[功能概览](docs/README.md)**: 功能特性和开发笔记

## 🖼️ 界面预览

应用界面分为两部分：
- **左侧**: 实时倒计时预览区域，支持播放/暂停
- **右侧**: 配置面板，提供所有自定义选项

## 🛠️ 技术栈

- **Electron**: 跨平台桌面应用框架
- **React**: 现代化的 UI 框架
- **Canvas API**: 高性能图形渲染
- **MediaRecorder API**: 原生视频录制
- **font-list**: 系统字体获取

## 📋 使用示例

### 基本倒计时
1. 选择字体和字号
2. 设置倒计时时长（如 60 秒）
3. 选择显示格式（如 `00:60` 或 `01:00`）
4. 选择位置（居中）
5. 点击"导出视频"

### 带背景图片的倒计时
1. 点击"选择图片"添加背景
2. 配置字体、颜色、大小
3. 调整倒计时位置，避免遮挡重要内容
4. 预览效果后导出视频

### 自定义位置的倒计时
1. 选择"自定义位置"模式
2. 选择基准角（如"左上角"）
3. 设置 X/Y 偏移值
4. 在预览区域实时查看效果
5. 满意后导出视频

## 🎯 应用场景

- 视频片头/片尾倒计时
- 活动开始倒计时
- 直播倒计时
- 教学演示
- 产品发布倒计时
- 新年倒计时

## ⚙️ 配置选项详解

### 字体设置
- 字体选择（系统字体列表）
- 字号大小（12-500px）
- 字体颜色（色彩选择器）

### 倒计时格式
- 时/分/秒显示模式
- 自定义分隔符
- 总时长设置

### 背景设置
- 背景图片上传
- contain 模式渲染

### 位置设置
- 自动居中
- 基于角的坐标系统

### 导出设置
- 帧率选择（24/30/60 FPS）
- 视频格式（WebM）

## 🔧 开发相关

### IDE 推荐设置
- [VSCode](https://code.visualstudio.com/)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### 项目结构
```
mint-countdown-maker/
├── src/
│   ├── main/           # Electron 主进程
│   ├── preload/        # 预加载脚本
│   └── renderer/       # React 渲染进程
│       └── src/
│           ├── components/  # React 组件
│           └── utils/       # 工具函数
├── docs/               # 文档
└── build/              # 构建资源
```

### 脚本命令
```bash
npm run dev          # 开发模式
npm run build        # 构建应用
npm run build:win    # 构建 Windows 版本
npm run build:mac    # 构建 macOS 版本
npm run build:linux  # 构建 Linux 版本
npm run lint         # 代码检查
npm run format       # 代码格式化
```

## 🐛 问题反馈

如遇到问题，请：
1. 查看[用户指南](docs/user-guide.md)中的常见问题部分
2. 打开开发者工具（F12）查看错误信息
3. 参考[技术文档](docs/technical.md)

## 📄 许可证

MIT License

## 🙏 致谢

本项目基于以下优秀的开源项目：
- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [electron-vite](https://electron-vite.org/)
- [font-list](https://github.com/oldj/node-font-list)

## 📝 更新日志

### v1.0.0 (2025-10-02)
- ✨ 初始版本发布
- ✨ 支持系统字体选择和实时预览
- ✨ 灵活的倒计时格式配置
- ✨ 背景图片支持
- ✨ 自动居中和自定义位置
- ✨ WebM 视频导出功能
- ✨ 实时预览和播放功能

---

**Made with ❤️ using Electron + React**
