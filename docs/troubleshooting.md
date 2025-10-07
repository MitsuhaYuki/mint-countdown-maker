# 故障排除指南

遇到问题？这份指南将帮助你快速解决常见问题。

## 目录
- [安装问题](#安装问题)
- [启动问题](#启动问题)
- [功能问题](#功能问题)
- [导出问题](#导出问题)
- [性能问题](#性能问题)
- [显示问题](#显示问题)
- [高级故障排查](#高级故障排查)

---

## 安装问题

### ❌ Windows Defender 阻止安装

**现象**: Windows 提示"Windows 已保护你的电脑"

**解决方案**:
1. 点击"更多信息"
2. 点击"仍要运行"
3. 或将应用添加到白名单

**原因**: 应用未签名，Windows Defender 默认阻止

---

### ❌ macOS "无法打开应用"

**现象**: macOS 提示"应用已损坏，无法打开"

**解决方案**:
```bash
# 终端中执行
xattr -cr /Applications/YourApp.app
```

或在"系统偏好设置 > 安全性与隐私"中允许打开

---

### ❌ Linux 权限问题

**现象**: AppImage 无法执行

**解决方案**:
```bash
# 添加执行权限
chmod +x YourApp.AppImage

# 运行
./YourApp.AppImage
```

---

## 启动问题

### ❌ 应用无法启动 - 白屏

**现象**: 应用打开后显示白屏，无内容

**可能原因**:
1. 渲染进程加载失败
2. 资源文件缺失
3. JavaScript 错误

**解决方案**:
1. **按 F12 打开开发者工具**，查看控制台错误
2. **重启应用**
3. **重新安装应用**
4. **检查系统要求**（Node.js 16+）

**日志查看**:
```bash
# Windows
%APPDATA%\app-name\logs

# macOS
~/Library/Logs/app-name

# Linux
~/.config/app-name/logs
```

---

### ❌ 应用启动后立即崩溃

**现象**: 应用窗口闪现后立即关闭

**可能原因**:
1. 主进程错误
2. 依赖缺失
3. 系统不兼容

**解决方案**:
1. **从终端启动**，查看错误信息：
   ```bash
   # Windows PowerShell
   & "C:\Program Files\AppName\AppName.exe"

   # macOS/Linux
   /Applications/AppName.app/Contents/MacOS/AppName
   ```
2. **检查系统版本**
3. **更新显卡驱动**
4. **重新安装**

---

### ❌ 开发模式启动失败

**现象**: `npm run dev` 报错

**解决方案**:
```bash
# 1. 清理缓存
rm -rf node_modules
rm package-lock.json

# 2. 重新安装依赖
npm install

# 3. 清理构建文件
rm -rf out

# 4. 重新启动
npm run dev
```

---

## 功能问题

### ❌ 字体列表为空或加载失败

**现象**: 配置面板中字体下拉菜单显示"加载中..."或为空

**可能原因**:
1. font-list 库权限问题
2. 系统字体缓存损坏
3. IPC 通信失败

**解决方案**:

**方法 1: 重启应用**
```
关闭应用 → 重新打开
```

**方法 2: 使用默认字体**
```javascript
// 手动设置字体
config.fontFamily = 'Arial'  // Windows
config.fontFamily = 'Helvetica'  // macOS
```

**方法 3: 检查开发者工具**
```
F12 → Console → 查看错误信息
```

**方法 4: 重建字体缓存**（Windows）
```bash
# 在命令提示符中执行
fc-cache -f -v
```

**临时解决方案**:
直接在代码中添加常用字体列表作为后备。

---

### ❌ 背景图片无法加载

**现象**: 选择背景图片后，预览区域没有显示

**可能原因**:
1. 图片格式不支持
2. 图片文件损坏
3. 文件路径包含特殊字符
4. 图片尺寸过大

**解决方案**:

**检查图片格式**:
- ✅ 支持：JPG, JPEG, PNG, GIF, BMP, WebP
- ❌ 不支持：TIFF, SVG, PSD

**检查文件大小**:
- 建议 < 10MB
- 如果图片过大，使用图片编辑软件压缩

**检查文件名**:
```
✅ 正确：background.jpg, bg_image.png
❌ 避免：背景#1.jpg, image@2x.png
```

**测试步骤**:
1. 尝试使用其他图片
2. 将图片转换为 PNG 格式
3. 检查图片是否能在图片查看器中正常打开

---

### ❌ 预览区域倒计时不显示

**现象**: 左侧预览区域一片黑，没有倒计时文字

**可能原因**:
1. 字体未加载
2. 字体颜色与背景相同
3. 倒计时格式全部设为"不显示"
4. Canvas 渲染错误

**解决方案**:

**检查配置**:
```javascript
// 至少一个格式不是 "hide"
hourFormat !== 'hide' ||
minuteFormat !== 'hide' ||
secondFormat !== 'hide'

// 字体颜色与背景有对比
fontColor !== backgroundColor
```

**测试配置**:
```json
{
  "fontFamily": "Arial",
  "fontSize": 72,
  "fontColor": "#ffffff",
  "secondFormat": "show-2-digits"
}
```

**调试步骤**:
1. F12 → Console → 查看错误
2. 检查字体是否存在：`console.log(config.fontFamily)`
3. 更换为系统默认字体（Arial）

---

### ❌ 播放按钮不工作

**现象**: 点击播放按钮后，倒计时不动

**可能原因**:
1. JavaScript 定时器被阻止
2. 浏览器节流
3. 组件状态错误

**解决方案**:
1. **刷新应用**（Ctrl+R / Cmd+R）
2. **检查总秒数是否 > 0**
3. **重启应用**

**开发者调试**:
```javascript
// 在 Console 中检查
console.log('isPlaying:', isPlaying)
console.log('countdown:', countdown)
console.log('intervalRef:', intervalRef.current)
```

---

## 导出问题

### ❌ 导出长视频时程序崩溃 (GPU 错误)

**现象**: 导出长视频（如 600 秒以上）时程序崩溃，错误提示：
```
ERROR:gpu\ipc\client\command_buffer_proxy_impl.cc:327] GPU state invalid
ERROR:content\browser\gpu\gpu_process_host.cc:964] GPU process exited unexpectedly
```

**原因**:
- 长时间使用 VideoEncoder 导致 GPU 资源耗尽
- 大量帧连续编码导致 GPU 队列积压
- 显存不足或驱动问题

**解决方案**:

**1. 降低配置参数** (推荐):
```json
{
  "fps": 6,               // 使用最低帧率（6 FPS）
  "bitrate": 5,           // 使用标准比特率（5 Mbps）
  "totalSeconds": 300,    // 或分段导出
  "fontSize": 60          // 减小字号（可选）
}
```

**2. 更新显卡驱动**:
- NVIDIA: 访问 GeForce Experience 更新
- AMD: 访问 AMD Radeon Software 更新
- Intel: 访问 Intel 驱动与支持助手

**3. 禁用硬件加速** (临时方案):
在 Electron 中添加启动参数：
```bash
--disable-gpu-compositing
--disable-software-rasterizer
```

**4. 分段导出**:
将长视频分为多个短片段：
- 1800 秒 → 3 × 600 秒
- 然后使用视频编辑软件合并

**5. 程序内置优化**:
程序已内置以下GPU资源管理优化：
- **背压控制**：限制编码器队列大小 ≤ 5帧
- **定期让渡**：每100帧延迟50ms,避免GPU资源耗尽
- **质量模式**：使用latencyMode:'quality'优化编码器
- **智能默认值**：默认12fps和5Mbps,平衡质量和性能

**推荐配置**（针对不同时长）:
- **60-300秒**: 12 FPS, 5 Mbps（默认配置）
- **300-600秒**: 12 FPS, 5 Mbps（或 6 FPS）
- **600-1800秒**: 6 FPS, 5 Mbps
- **1800秒以上**: 6 FPS, 5 Mbps + 分段导出

**最佳实践**:
- 长视频优先使用 6 或 12 FPS 而非 24/30 FPS
- 避免在导出时运行其他 GPU 密集型任务（游戏、视频剪辑等）
- 确保至少有 4GB 可用显存
- 关闭不必要的浏览器标签页

---

### ❌ 导出视频失败

**现象**: 点击"导出视频"后报错或无反应

**可能原因**:
1. VideoEncoder API 不支持
2. 磁盘空间不足
3. 权限问题
4. 内存不足

**解决方案**:

**检查浏览器支持**:
```javascript
// 在 Console 中检查
console.log('VideoEncoder支持:', typeof VideoEncoder !== 'undefined')
console.log('H.264支持:', await VideoEncoder.isConfigSupported({
  codec: 'avc1.42001f',
  width: 1280,
  height: 720
}))
```

**检查磁盘空间**:
- 60秒 @ 30FPS ≈ 5-10 MB
- 确保有足够的可用空间

**降低配置**:
```json
{
  "fps": 24,           // 降低帧率
  "totalSeconds": 30,  // 减少时长
  "fontSize": 60       // 减小字号
}
```

**错误处理**:
如果继续失败，查看开发者工具中的错误消息。

---

### ❌ 导出的视频无法播放

**现象**: 视频文件已生成，但无法播放

**可能原因**:
1. 编码器不支持
2. 文件不完整
3. 播放器不支持 WebM
4. 导出过程中断

**解决方案**:

**检查文件大小**:
```bash
# 文件大小应该 > 0 KB
# 60秒 @ 30FPS 通常 5-10 MB
```

**使用支持的播放器**:
导出格式为 **MP4 (H.264)**，几乎所有播放器都支持：
- ✅ VLC Media Player
- ✅ Windows Media Player
- ✅ macOS QuickTime Player
- ✅ 所有现代浏览器
- ✅ 手机播放器

**格式转换** (如有需要)：
使用 ffmpeg 转换为其他格式：
```bash
# 转换为 WebM
ffmpeg -i countdown.mp4 -c:v libvpx-vp9 countdown.webm

# 转换为 GIF
ffmpeg -i countdown.mp4 -vf "fps=10,scale=320:-1" countdown.gif
```

---

### ❌ 导出进度卡住不动

**现象**: 导出进度条卡在某个百分比

**可能原因**:
1. 背景图片加载失败
2. 字体渲染问题
3. 内存不足
4. 渲染循环错误

**解决方案**:

**立即操作**:
1. **等待 5-10 分钟**（可能只是慢）
2. **如果确定卡住，关闭应用重试**

**预防措施**:
```json
{
  "backgroundImage": null,  // 先不用背景
  "totalSeconds": 10,       // 测试用短时长
  "fps": 24                 // 降低帧率
}
```

**检查内存**:
- 任务管理器 / 活动监视器
- 确保有 1GB+ 可用内存

---

### ❌ 导出的视频效果与预览不一致

**现象**: 导出的视频中文字位置、大小或颜色与预览不同

**可能原因**:
1. Canvas 尺寸不一致
2. 字体渲染差异
3. 背景图片加载时机

**解决方案**:

**使用常见字体**:
```
Arial, Times New Roman, Helvetica
避免使用特殊字体
```

**预加载背景**:
导出前确保背景图片完全加载。

**使用默认位置**:
先使用"自动居中"测试，确保没有位置问题。

---

## 性能问题

### ❌ 预览卡顿

**现象**: 移动鼠标或调整配置时，预览区域响应慢

**正常现象**:
预览时的轻微卡顿是正常的，不影响导出质量。

**优化建议**:
1. 降低预览区域尺寸
2. 减小字号
3. 移除背景图片（仅预览时）
4. 关闭其他应用释放资源

**不影响导出**:
预览卡顿不会影响最终导出的视频质量。

---

### ❌ 导出速度很慢

**现象**: 导出一个 60 秒的视频需要很长时间

**正常耗时**:
- 60秒 @ 30FPS ≈ 1-3 分钟
- 60秒 @ 60FPS ≈ 2-5 分钟

**影响因素**:
1. 帧率（FPS 越高越慢）
2. 时长（越长越慢）
3. 背景图片复杂度
4. 系统性能

**优化方法**:
```json
{
  "fps": 24,                // 使用 24 FPS
  "backgroundImage": null,  // 简化背景
  "fontSize": 72            // 合理字号
}
```

---

### ❌ 应用内存占用高

**现象**: 任务管理器显示应用占用大量内存

**正常范围**:
- 空闲：200-500 MB
- 导出时：500-1000 MB
- > 2 GB：异常

**解决方案**:
1. **重启应用**
2. **减少倒计时时长**
3. **关闭其他标签页/窗口**
4. **升级系统内存**

---

## 显示问题

### ❌ 界面显示模糊

**现象**: 文字和界面元素显示不清晰

**可能原因**:
1. 高 DPI 缩放问题
2. Electron 渲染问题

**解决方案**:

**Windows**:
1. 右键应用快捷方式 → 属性
2. 兼容性 → 更改高 DPI 设置
3. 勾选"替代高 DPI 缩放行为"

**macOS**:
通常不会出现此问题，如有请重启应用。

---

### ❌ 字体在下拉菜单中显示不正确

**现象**: 字体下拉菜单中的字体预览效果不对

**这是正常的**:
某些字体在下拉菜单中可能无法正确显示，但在预览区域会正常显示。

**解决方案**:
以预览区域的效果为准，忽略下拉菜单的显示。

---

### ❌ 颜色选择器无法使用

**现象**: 点击颜色选择器没有反应

**解决方案**:
1. **刷新应用**（Ctrl+R）
2. **手动输入颜色代码**
3. **重启应用**

---

## 高级故障排查

### 🔍 开启调试模式

#### 查看主进程日志
```bash
# 从终端启动查看日志
npm run dev
```

#### 查看渲染进程日志
```
按 F12 → Console 标签
```

#### 网络请求调试
```
F12 → Network 标签
```

---

### 🔍 检查 IPC 通信

在渲染进程 Console 中：
```javascript
// 测试 IPC 是否正常
await window.api.getSystemFonts()
// 应该返回字体数组

await window.api.selectBackgroundImage()
// 应该打开文件选择对话框
```

---

### 🔍 Canvas 调试

```javascript
// 在 Console 中获取 Canvas 元素
const canvas = document.querySelector('canvas')
console.log('Canvas:', canvas)
console.log('尺寸:', canvas.width, canvas.height)

// 导出 Canvas 为图片查看
const dataUrl = canvas.toDataURL()
console.log(dataUrl)
// 复制 dataUrl 在浏览器新标签页打开
```

---

### 🔍 性能分析

```javascript
// 在 Console 中
console.time('渲染时间')
// 执行渲染操作
console.timeEnd('渲染时间')

// 内存使用
console.log(performance.memory)
```

---

### 🔍 清理缓存和数据

**开发环境**:
```bash
rm -rf node_modules
rm -rf out
rm -rf dist
npm install
```

**生产环境**:
```bash
# Windows
%APPDATA%\app-name

# macOS
~/Library/Application Support/app-name

# Linux
~/.config/app-name
```

删除这些目录后重新启动应用。

---

## 获取帮助

### 📝 报告问题时请提供

1. **操作系统和版本**
   ```
   Windows 11, macOS 13, Ubuntu 22.04, etc.
   ```

2. **应用版本**
   ```
   在 关于 菜单中查看
   ```

3. **错误信息**
   ```
   F12 → Console 中的完整错误
   ```

4. **重现步骤**
   ```
   1. 打开应用
   2. 点击...
   3. 出现错误
   ```

5. **配置信息**
   ```json
   {
     "fontFamily": "Arial",
     "fontSize": 72,
     ...
   }
   ```

### 📞 联系方式

- GitHub Issues (如果是开源项目)
- 开发者邮箱
- 官方论坛

---

## 常见错误代码

| 错误代码 | 说明 | 解决方案 |
|---------|------|---------|
| ERR_FONT_LOAD | 字体加载失败 | 使用默认字体或重启 |
| ERR_IMG_LOAD | 图片加载失败 | 检查图片格式和大小 |
| ERR_MEDIA_REC | MediaRecorder 错误 | 检查浏览器支持 |
| ERR_FILE_WRITE | 文件写入失败 | 检查磁盘空间和权限 |
| ERR_IPC_TIMEOUT | IPC 通信超时 | 重启应用 |

---

## 预防性维护

### 定期操作
1. **清理缓存**（每月一次）
2. **更新应用**到最新版本
3. **备份配置**（如果有配置文件）
4. **检查磁盘空间**

### 最佳实践
1. **测试后导出**：先播放预览，确认无误后导出
2. **小步快跑**：先导出短时长视频测试
3. **保存配置**：记录常用配置参数
4. **分段导出**：长视频考虑分段导出后合并

---

**如果问题仍未解决，请查看 [技术文档](technical.md) 或联系技术支持。**
