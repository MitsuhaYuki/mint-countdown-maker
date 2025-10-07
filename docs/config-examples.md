# 配置示例

这个文件包含了一些常用的倒计时配置示例，可以直接在应用中使用。

## 基础配置

### 1. 简单 60 秒倒计时

```json
{
  "name": "简单 60 秒倒计时",
  "fontFamily": "Arial",
  "fontSize": 80,
  "fontColor": "#000000",
  "backgroundColor": "#ffffff",
  "textShadowEnabled": false,
  "textShadowColor": "#000000",
  "textShadowBlur": 5,
  "textShadowOffsetX": 2,
  "textShadowOffsetY": 2,
  "formatMode": "classic",
  "hourFormat": "hide",
  "minuteFormat": "two-digits",
  "secondFormat": "two-digits",
  "separator": ":",
  "totalSeconds": 60,
  "backgroundImage": null,
  "positionMode": "center",
  "corner": "top-left",
  "offsetX": 50,
  "offsetY": 50,
  "fps": 12,
  "bitrate": 5
}
```

**效果**: 黑色文字,白色背景,居中显示,格式为 `01:00` 到 `00:00`

---

### 2. 仅秒数倒计时

```json
{
  "name": "仅秒数倒计时",
  "fontFamily": "Arial",
  "fontSize": 150,
  "fontColor": "#ff0000",
  "backgroundColor": "#ffffff",
  "textShadowEnabled": true,
  "textShadowColor": "#000000",
  "textShadowBlur": 10,
  "textShadowOffsetX": 3,
  "textShadowOffsetY": 3,
  "formatMode": "classic",
  "hourFormat": "hide",
  "minuteFormat": "hide",
  "secondFormat": "show",
  "separator": "",
  "totalSeconds": 10,
  "backgroundImage": null,
  "positionMode": "center",
  "corner": "top-left",
  "offsetX": 0,
  "offsetY": 0,
  "fps": 12,
  "bitrate": 5
}
```

**效果**: 大红色数字,白色背景,带阴影,居中显示,只显示秒数 `10`, `9`, `8`, ..., `1`

---

## 视频制作配置

### 3. YouTube 片头倒计时

```json
{
  "name": "YouTube 片头",
  "fontFamily": "Impact",
  "fontSize": 120,
  "fontColor": "#ffffff",
  "backgroundColor": "#000000",
  "textShadowEnabled": true,
  "textShadowColor": "#ff0000",
  "textShadowBlur": 15,
  "textShadowOffsetX": 0,
  "textShadowOffsetY": 0,
  "formatMode": "classic",
  "hourFormat": "hide",
  "minuteFormat": "hide",
  "secondFormat": "show",
  "separator": "",
  "totalSeconds": 5,
  "backgroundImage": "your-logo-background.png",
  "positionMode": "center",
  "corner": "top-left",
  "offsetX": 0,
  "offsetY": 0,
  "fps": 24,
  "bitrate": 10
}
```

**用途**: YouTube 视频开场 5 秒倒计时
**建议**: 使用带品牌 Logo 的背景图片,红色光晕阴影增加视觉效果

---

### 4. 直播等待画面

```json
{
  "name": "直播等待",
  "fontFamily": "Arial",
  "fontSize": 90,
  "fontColor": "#00ff00",
  "hourFormat": "hide",
  "minuteFormat": "show-2-digits",
  "secondFormat": "show-2-digits",
  "separator": ":",
  "totalSeconds": 600,
  "backgroundImage": "live-background.jpg",
  "positionMode": "custom",
  "corner": "bottom-right",
  "offsetX": 100,
  "offsetY": 100,
  "fps": 24
}
```

**用途**: 直播开始前 10 分钟倒计时
**建议**: 背景使用宣传海报，倒计时放在右下角

---

## 活动和特殊场合

### 5. 新年倒计时

```json
{
  "name": "新年倒计时",
  "fontFamily": "Arial",
  "fontSize": 100,
  "fontColor": "#ffd700",
  "hourFormat": "show-2-digits",
  "minuteFormat": "show-2-digits",
  "secondFormat": "show-2-digits",
  "separator": ":",
  "totalSeconds": 3600,
  "backgroundImage": "fireworks-background.jpg",
  "positionMode": "center",
  "corner": "top-left",
  "offsetX": 0,
  "offsetY": 0,
  "fps": 30
}
```

**用途**: 新年倒计时 1 小时
**建议**: 使用烟花或节日主题背景

---

### 6. 产品发布倒计时

```json
{
  "name": "产品发布",
  "fontFamily": "Arial",
  "fontSize": 80,
  "fontColor": "#ffffff",
  "hourFormat": "show-2-digits",
  "minuteFormat": "show-2-digits",
  "secondFormat": "show-2-digits",
  "separator": ":",
  "totalSeconds": 86400,
  "backgroundImage": "product-teaser.jpg",
  "positionMode": "custom",
  "corner": "top-right",
  "offsetX": 150,
  "offsetY": 100,
  "fps": 24
}
```

**用途**: 产品发布前 24 小时倒计时
**建议**: 使用产品预告图作为背景

---

## 教育和培训

### 7. 考试倒计时

```json
{
  "name": "考试倒计时",
  "fontFamily": "Arial",
  "fontSize": 72,
  "fontColor": "#000000",
  "hourFormat": "show",
  "minuteFormat": "show-2-digits",
  "secondFormat": "show-2-digits",
  "separator": ":",
  "totalSeconds": 7200,
  "backgroundImage": null,
  "positionMode": "custom",
  "corner": "top-right",
  "offsetX": 50,
  "offsetY": 50,
  "fps": 30
}
```

**用途**: 2 小时考试倒计时
**建议**: 黑色文字，放在右上角不遮挡内容

---

### 8. 课程休息倒计时

```json
{
  "name": "课程休息",
  "fontFamily": "Arial",
  "fontSize": 100,
  "fontColor": "#0066cc",
  "hourFormat": "hide",
  "minuteFormat": "show-2-digits",
  "secondFormat": "show-2-digits",
  "separator": ":",
  "totalSeconds": 300,
  "backgroundImage": null,
  "positionMode": "center",
  "corner": "top-left",
  "offsetX": 0,
  "offsetY": 0,
  "fps": 30
}
```

**用途**: 课程休息 5 分钟倒计时
**建议**: 蓝色文字，居中显示

---

## 创意配置

### 9. 电影预告风格

```json
{
  "name": "电影预告",
  "fontFamily": "Times New Roman",
  "fontSize": 90,
  "fontColor": "#ffffff",
  "hourFormat": "hide",
  "minuteFormat": "show",
  "secondFormat": "show-2-digits",
  "separator": ":",
  "totalSeconds": 180,
  "backgroundImage": "movie-scene.jpg",
  "positionMode": "custom",
  "corner": "bottom-left",
  "offsetX": 100,
  "offsetY": 150,
  "fps": 24
}
```

**用途**: 电影风格的 3 分钟倒计时
**建议**: 使用电影场景背景，Times New Roman 字体增加电影感

---

### 10. 霓虹灯风格

```json
{
  "name": "霓虹灯风格",
  "fontFamily": "Arial",
  "fontSize": 120,
  "fontColor": "#ff00ff",
  "hourFormat": "hide",
  "minuteFormat": "show-2-digits",
  "secondFormat": "show-2-digits",
  "separator": ":",
  "totalSeconds": 90,
  "backgroundImage": "neon-background.jpg",
  "positionMode": "center",
  "corner": "top-left",
  "offsetX": 0,
  "offsetY": 0,
  "fps": 30
}
```

**用途**: 霓虹灯效果的 90 秒倒计时
**建议**: 品红色文字，配合霓虹背景

---

## 配置说明

### 如何使用这些配置

1. **手动输入**: 在应用中按照配置逐项设置
2. **参考修改**: 基于这些配置进行个性化调整
3. **创建模板**: 保存常用配置以便快速使用

### 配置参数说明

#### 字体设置
- `fontFamily`: 字体名称（需系统已安装）
- `fontSize`: 字号大小（像素）
- `fontColor`: 字体颜色（十六进制）
- `backgroundColor`: 背景颜色（十六进制,默认 #ffffff）
- `textShadowEnabled`: 是否启用文字阴影（true/false）
- `textShadowColor`: 阴影颜色（十六进制）
- `textShadowBlur`: 阴影模糊半径（0-50）
- `textShadowOffsetX`: 阴影X偏移（-50 到 50）
- `textShadowOffsetY`: 阴影Y偏移（-50 到 50）

#### 倒计时格式
- `formatMode`: 格式模式（当前仅支持 "classic"）
- `hourFormat`: 小时显示格式（auto/hide/show/two-digits）
- `minuteFormat`: 分钟显示格式（auto/hide/show/two-digits）
- `secondFormat`: 秒显示格式（auto/hide/show/two-digits）
- `separator`: 分隔符

#### 其他设置
- `totalSeconds`: 总秒数
- `backgroundImage`: 背景图片路径（null 为无背景图）
- `positionMode`: 位置模式（center/custom）
- `corner`: 基准角（top-left/top-right/bottom-left/bottom-right）
- `offsetX/offsetY`: X/Y 偏移量
- `fps`: 帧率（6/12/24/30,默认12）
- `bitrate`: 比特率（5/10/20,单位Mbps,默认5）

### 优化建议

#### 文件大小优化
```json
{
  "说明": "降低文件大小",
  "fps": 6,
  "bitrate": 5,
  "totalSeconds": "尽量短",
  "背景图片": "压缩后使用或不使用"
}
```

#### 质量优化
```json
{
  "说明": "提高视频质量",
  "fps": 24,
  "bitrate": 20,
  "fontSize": "较大值",
  "背景图片": "高分辨率"
}
```

#### 性能优化
```json
{
  "说明": "快速导出",
  "fps": 12,
  "bitrate": 5,
  "totalSeconds": "短时长",
  "backgroundImage": "简单背景或无背景"
}
```

---

## 自定义配置模板

### 模板结构

```json
{
  "name": "配置名称",
  "description": "配置说明",
  "useCase": "使用场景",
  "fontFamily": "字体",
  "fontSize": 72,
  "fontColor": "#000000",
  "backgroundColor": "#ffffff",
  "textShadowEnabled": false,
  "textShadowColor": "#000000",
  "textShadowBlur": 5,
  "textShadowOffsetX": 2,
  "textShadowOffsetY": 2,
  "formatMode": "classic",
  "hourFormat": "auto",
  "minuteFormat": "auto",
  "secondFormat": "two-digits",
  "separator": ":",
  "totalSeconds": 60,
  "backgroundImage": null,
  "positionMode": "center",
  "corner": "top-left",
  "offsetX": 0,
  "offsetY": 0,
  "fps": 12,
  "bitrate": 5
}
```

### 创建自己的配置

1. 复制上面的模板
2. 修改各项参数
3. 在应用中测试效果
4. 保存常用配置

---

## 颜色参考

### 常用颜色代码

```
白色: #ffffff
黑色: #000000
红色: #ff0000
绿色: #00ff00
蓝色: #0000ff
黄色: #ffff00
橙色: #ff8000
粉色: #ff00ff
金色: #ffd700
银色: #c0c0c0
```

### 颜色搭配建议

- **深色背景**: 使用浅色文字（白色、黄色、金色）
- **浅色背景**: 使用深色文字（黑色、深蓝、深绿）
- **彩色背景**: 使用对比色文字确保可读性

---

## 字体推荐

### Windows 常用字体
- Arial - 通用无衬线字体
- Times New Roman - 经典衬线字体
- Impact - 粗体醒目字体
- Comic Sans MS - 休闲风格字体
- Courier New - 等宽字体

### macOS 常用字体
- Helvetica - 优雅无衬线字体
- San Francisco - 系统默认字体
- Avenir - 现代无衬线字体

### 中文字体
- 微软雅黑 - 常用中文字体
- 宋体 - 传统中文字体
- 黑体 - 粗体中文字体

---

**提示**: 这些配置仅供参考，请根据实际需求进行调整！
