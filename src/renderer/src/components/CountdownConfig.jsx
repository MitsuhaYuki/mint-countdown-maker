import { useEffect, useState } from 'react'
import './CountdownConfig.css'

function CountdownConfig({ config, onConfigChange, onExportVideo }) {
  const [fonts, setFonts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load system fonts
    const loadFonts = async () => {
      try {
        const systemFonts = await window.api.getSystemFonts()
        setFonts(systemFonts)
      } catch (error) {
        console.error('Error loading fonts:', error)
      } finally {
        setLoading(false)
      }
    }
    loadFonts()
  }, [])

  const handleSelectBackgroundImage = async () => {
    const result = await window.api.selectBackgroundImage()
    if (result) {
      onConfigChange({ ...config, backgroundImage: result.data })
    }
  }

  const handleClearBackgroundImage = () => {
    onConfigChange({ ...config, backgroundImage: null })
  }

  return (
    <div className="countdown-config">
      <div className="config-content">
        <div className="config-section">
          <h3>字体设置</h3>

        <div className="config-item">
          <label>字体选择：</label>
          <select
            value={config.fontFamily}
            onChange={(e) => onConfigChange({ ...config, fontFamily: e.target.value })}
            disabled={loading}
            className="font-select"
          >
            {loading ? (
              <option>加载中...</option>
            ) : (
              fonts.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="config-item">
          <label>字号大小：</label>
          <input
            type="number"
            value={config.fontSize}
            onChange={(e) => onConfigChange({ ...config, fontSize: parseInt(e.target.value) || 48 })}
            min="12"
            max="500"
          />
          <span className="unit">px</span>
        </div>

        <div className="config-item">
          <label>字体颜色：</label>
          <input
            type="color"
            value={config.fontColor}
            onChange={(e) => onConfigChange({ ...config, fontColor: e.target.value })}
          />
        </div>

        <div className="config-item">
          <label>启用阴影：</label>
          <input
            type="checkbox"
            checked={config.textShadowEnabled}
            onChange={(e) => onConfigChange({ ...config, textShadowEnabled: e.target.checked })}
          />
        </div>

        {config.textShadowEnabled && (
          <>
            <div className="config-item">
              <label>阴影颜色：</label>
              <input
                type="color"
                value={config.textShadowColor.startsWith('rgba') ? '#000000' : config.textShadowColor}
                onChange={(e) => {
                  const hex = e.target.value
                  // 保持原有的透明度，只改变颜色
                  const r = parseInt(hex.slice(1, 3), 16)
                  const g = parseInt(hex.slice(3, 5), 16)
                  const b = parseInt(hex.slice(5, 7), 16)
                  const alpha = config.textShadowColor.match(/[\d.]+\)$/)?.[0].slice(0, -1) || '0.8'
                  onConfigChange({ ...config, textShadowColor: `rgba(${r}, ${g}, ${b}, ${alpha})` })
                }}
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={parseFloat(config.textShadowColor.match(/[\d.]+\)$/)?.[0].slice(0, -1) || '0.8')}
                onChange={(e) => {
                  const match = config.textShadowColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
                  if (match) {
                    onConfigChange({
                      ...config,
                      textShadowColor: `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${e.target.value})`
                    })
                  }
                }}
                style={{ width: '80px', marginLeft: '10px' }}
              />
              <span className="unit">透明度</span>
            </div>

            <div className="config-item">
              <label>阴影模糊：</label>
              <input
                type="number"
                value={config.textShadowBlur}
                onChange={(e) => onConfigChange({ ...config, textShadowBlur: parseInt(e.target.value) || 0 })}
                min="0"
                max="50"
              />
              <span className="unit">px</span>
            </div>

            <div className="config-item">
              <label>阴影偏移X：</label>
              <input
                type="number"
                value={config.textShadowOffsetX}
                onChange={(e) => onConfigChange({ ...config, textShadowOffsetX: parseInt(e.target.value) || 0 })}
                min="-50"
                max="50"
              />
              <span className="unit">px</span>
            </div>

            <div className="config-item">
              <label>阴影偏移Y：</label>
              <input
                type="number"
                value={config.textShadowOffsetY}
                onChange={(e) => onConfigChange({ ...config, textShadowOffsetY: parseInt(e.target.value) || 0 })}
                min="-50"
                max="50"
              />
              <span className="unit">px</span>
            </div>
          </>
        )}
      </div>

      <div className="config-section">
        <h3>倒计时格式</h3>

        <div className="config-item">
          <label>格式模式：</label>
          <select
            value={config.formatMode}
            onChange={(e) => onConfigChange({ ...config, formatMode: e.target.value })}
          >
            <option value="classic">经典格式</option>
          </select>
        </div>

        {config.formatMode === 'classic' && (
          <>
            <div className="config-item time-selectors-row">
              <label>时</label>
              <select
                value={config.hourFormat}
                onChange={(e) => onConfigChange({ ...config, hourFormat: e.target.value })}
              >
                <option value="auto">自动</option>
                <option value="hide">隐藏</option>
                <option value="show">显示</option>
                <option value="two-digits">两位数字</option>
              </select>

              <label>分</label>
              <select
                value={config.minuteFormat}
                onChange={(e) => onConfigChange({ ...config, minuteFormat: e.target.value })}
              >
                <option value="auto">自动</option>
                <option value="hide">隐藏</option>
                <option value="show">显示</option>
                <option value="two-digits">两位数字</option>
              </select>

              <label>秒</label>
              <select
                value={config.secondFormat}
                onChange={(e) => onConfigChange({ ...config, secondFormat: e.target.value })}
              >
                <option value="auto">自动</option>
                <option value="hide">隐藏</option>
                <option value="show">显示</option>
                <option value="two-digits">两位数字</option>
              </select>
            </div>

            <div className="config-item">
              <label>分隔符：</label>
              <input
                type="text"
                value={config.separator}
                onChange={(e) => onConfigChange({ ...config, separator: e.target.value })}
                maxLength="3"
                style={{ width: '60px' }}
              />
            </div>
          </>
        )}
      </div>

      <div className="config-section">
        <h3>倒计时时长</h3>

        <div className="config-item">
          <label>总秒数：</label>
          <input
            type="number"
            value={config.totalSeconds}
            onChange={(e) => onConfigChange({ ...config, totalSeconds: parseInt(e.target.value) || 60 })}
            min="1"
            max="86400"
          />
          <span className="unit">秒</span>
        </div>

        <div className="config-item">
          <label>开始前延迟：</label>
          <input
            type="number"
            value={config.startDelay}
            onChange={(e) => onConfigChange({ ...config, startDelay: parseInt(e.target.value) || 0 })}
            min="0"
            max="3600"
          />
          <span className="unit">秒</span>
        </div>
      </div>

      <div className="config-section">
        <h3>背景设置</h3>

        <div className="config-item">
          <label>背景颜色：</label>
          <input
            type="color"
            value={config.backgroundColor}
            onChange={(e) => onConfigChange({ ...config, backgroundColor: e.target.value })}
          />
        </div>

        <div className="config-item">
          <label>背景图片：</label>
          <div className="button-group">
            <button onClick={handleSelectBackgroundImage}>选择图片</button>
            {config.backgroundImage && (
              <button onClick={handleClearBackgroundImage} className="secondary">清除</button>
            )}
          </div>
        </div>

        {config.backgroundImage && (
          <div className="background-preview">
            <img src={config.backgroundImage} alt="背景预览" />
          </div>
        )}
      </div>

      <div className="config-section">
        <h3>位置设置</h3>

        <div className="config-item">
          <label>定位模式：</label>
          <select
            value={config.positionMode}
            onChange={(e) => onConfigChange({ ...config, positionMode: e.target.value })}
          >
            <option value="center">自动居中</option>
            <option value="custom">自定义位置</option>
          </select>
        </div>

        {config.positionMode === 'custom' && (
          <>
            <div className="config-item">
              <label>基准角：</label>
              <select
                value={config.corner}
                onChange={(e) => onConfigChange({ ...config, corner: e.target.value })}
              >
                <option value="top-left">左上角</option>
                <option value="top-right">右上角</option>
                <option value="bottom-left">左下角</option>
                <option value="bottom-right">右下角</option>
              </select>
            </div>

            <div className="config-item">
              <label>X 偏移：</label>
              <input
                type="number"
                value={config.offsetX}
                onChange={(e) => onConfigChange({ ...config, offsetX: parseInt(e.target.value) || 0 })}
                min="0"
              />
              <span className="unit">px</span>
            </div>

            <div className="config-item">
              <label>Y 偏移：</label>
              <input
                type="number"
                value={config.offsetY}
                onChange={(e) => onConfigChange({ ...config, offsetY: parseInt(e.target.value) || 0 })}
                min="0"
              />
              <span className="unit">px</span>
            </div>
          </>
        )}
      </div>

      <div className="config-section">
        <h3>视频导出</h3>

        <div className="config-item">
          <label>帧率：</label>
          <select
            value={config.fps}
            onChange={(e) => onConfigChange({ ...config, fps: parseInt(e.target.value) })}
          >
            <option value="6">6 FPS</option>
            <option value="12">12 FPS</option>
            <option value="24">24 FPS</option>
            <option value="30">30 FPS</option>
          </select>
        </div>

        <div className="config-item">
          <label>比特率：</label>
          <select
            value={config.bitrate}
            onChange={(e) => onConfigChange({ ...config, bitrate: parseInt(e.target.value) })}
          >
            <option value="5">5 Mbps（快速）</option>
            <option value="10">10 Mbps（中等）</option>
            <option value="20">20 Mbps（较好质量）</option>
          </select>
        </div>
        </div>
      </div>

      <div className="config-footer">
        <button className="export-button" onClick={onExportVideo}>
          导出视频
        </button>
      </div>
    </div>
  )
}

export default CountdownConfig
