# 倒计时视频生成器 - Mint Countdown Maker

简单易用的倒计时视频制作工具。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Electron](https://img.shields.io/badge/Electron-38.1.2-blue)
![React](https://img.shields.io/badge/React-19.1.1-blue)

> 注意！  
>  
> 此软件 100% 由 `Sonnet 4.5` 和 `GPT-5` 完成功能实现与文档编写，此软件**不会**收到任何未来更新，也不处理任何缺陷，仅作为可能性测试而编写。

> 此项目中 AI 规则集请使用 `docs/ai-instructions.md`

## 🎯 项目概述

![Preview](/docs/preview.png)

这是一个基于 Electron + React 的桌面应用程序，用于创建自定义倒计时视频。

### 核心特性

#### 1. 字体自定义
- ✅ 自动获取系统所有可用字体
- ✅ 下拉菜单实时预览字体效果
- ✅ 自由调整字号（12-500px）
- ✅ 自定义字体颜色（默认黑色）
- ✅ 可配置文字阴影（颜色、模糊、偏移）

#### 2. 灵活的倒计时格式
- ✅ 经典格式模式
- ✅ 时/分/秒独立配置
- ✅ 四种显示模式：自动（智能隐藏前导零）、隐藏、显示、两位数字
- ✅ 自定义分隔符
- ✅ 支持 1秒 - 24小时

#### 3. 背景设置
- ✅ 自定义背景颜色（默认白色）
- ✅ 支持多种图片格式（JPG, PNG, GIF, BMP, WebP）
- ✅ contain 模式自适应
- ✅ 背景色与图片分层显示
- ✅ 实时预览

#### 4. 精准位置控制
- ✅ 自动居中
- ✅ 基于四角的坐标系统
- ✅ 精确 X/Y 偏移控制

#### 5. 高质量视频导出
- ✅ 6/12/24/30 FPS 帧率选择（默认12）
- ✅ 5/10/20 Mbps 比特率配置（默认5）
- ✅ MP4 格式（H.264 编码）
- ✅ GPU 优化,支持长视频导出
- ✅ 实时进度显示
- ✅ 1:1 尺寸输出

#### 6. 实时预览
- ✅ 左右分屏布局
- ✅ 配置即时生效
- ✅ 播放/暂停功能
- ✅ 优化的渲染性能

## 🛠️ 技术栈

- **Electron 38.1.2** - 跨平台桌面应用框架
- **React 19.1.1** - 现代化 UI 框架
- **Canvas API** - 高性能图形渲染
- **VideoEncoder API (WebCodecs)** - 硬件加速视频编码
- **mp4-muxer** - MP4 容器创建
- **font-list** - 系统字体获取
- **Vite 7.1.7** - 快速构建工具

## 📚 文档导航

### 📖 用户文档
- **[用户指南](docs/用户指南.md)** - 完整的使用说明

### 🔧 开发文档
- **[开发指南](docs/开发指南.md)** - 技术实现细节
- **[更新日志](docs/更新日志.md)** - 更新日志

## 📦 项目结构

```
mint-countdown-maker/
├── docs/                    # 📚 文档目录
│   ├── README.md            # 文档中心（本文件）
│   ├── quick-start.md       # 快速开始
│   ├── user-guide.md        # 用户指南
│   ├── technical.md         # 技术文档
│   ├── api-reference.md     # API 参考
│   └── development.md       # 开发指南
├── src/
│   ├── main/               # Electron 主进程
│   ├── preload/            # 预加载脚本
│   └── renderer/           # React 渲染进程
│       └── src/
│           ├── components/ # React 组件
│           └── utils/      # 工具函数
├── build/                  # 构建资源
└── resources/              # 应用资源
```

## 🎬 使用流程

```
1. 启动应用
   ↓
2. 配置倒计时参数
   - 字体、字号、颜色
   - 倒计时格式
   - 背景图片
   - 位置设置
   ↓
3. 实时预览效果
   ↓
4. 导出视频
   - 选择帧率
   - 选择保存位置
   - 等待导出完成
   ↓
5. 完成！
```

## 💡 应用场景

- 📹 视频片头/片尾倒计时
- 🎥 直播等待画面
- 🎪 活动开始倒计时
- 📚 教学演示
- 🚀 产品发布倒计时
- 🎉 新年倒计时
- 🎮 游戏开场倒计时

## 📄 许可证

MIT License

## 🙏 致谢

感谢以下开源项目：
- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [electron-vite](https://electron-vite.org/)
- [font-list](https://github.com/oldj/node-font-list)
