/**
 * 控制台保护脚本
 * 禁用所有常规打开控制台的方式
 * 特殊解锁方式: 连续按 Y-J-J-2-2-3 (对应你的名字拼音首字母和数字223)
 */

(function () {
    'use strict';

    let allowConsole = false;
    let keySequence = [];
    const secretCode = ['y', 'j', 'j', '2', '2', '3'];
    let sequenceTimer = null;

    document.addEventListener('contextmenu', function (e) {
        if (!allowConsole) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);

    document.addEventListener('keydown', function (e) {
        // 检查密钥序列
        if (!allowConsole) {
            const key = e.key.toLowerCase();
            keySequence.push(key);

            if (keySequence.length > secretCode.length) {
                keySequence.shift();
            }

            if (keySequence.length === secretCode.length) {
                const match = secretCode.every((k, i) => k === keySequence[i]);
                if (match) {
                    allowConsole = true;
                    alert('控制台已解锁')
                    keySequence = [];
                    return;
                }
            }

            // 重置计时器
            clearTimeout(sequenceTimer);
            sequenceTimer = setTimeout(() => {
                keySequence = [];
            }, 2000);
        }

        // 禁用快捷键
        if (!allowConsole) {
            // F12
            if (e.keyCode === 123) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+Shift+I (检查元素)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+Shift+J (控制台)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+Shift+C (选择元素)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+U (查看源代码)
            if (e.ctrlKey && e.keyCode === 85) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+S (保存页面)
            if (e.ctrlKey && e.keyCode === 83) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    }, true);

    let devtoolsOpen = false;
    const threshold = 160;

    const detectDevTools = () => {
        if (allowConsole) return;

        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;

        if (widthThreshold || heightThreshold) {
            if (!devtoolsOpen) {
                devtoolsOpen = true;
                handleDevToolsOpen();
            }
        } else {
            devtoolsOpen = false;
        }
    };

    // 使用 debugger 检测
    const checkDebugger = () => {
        if (allowConsole) return;

        const start = new Date();
        debugger;
        const end = new Date();

        if (end - start > 100) {
            handleDevToolsOpen();
        }
    };

    // 控制台检测方法
    const consoleDetect = () => {
        if (allowConsole) return;

        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: function () {
                handleDevToolsOpen();
                throw new Error('DevTools detected');
            }
        });
        console.log(element);
    };

    // 当检测到开发者工具打开时的处理
    function handleDevToolsOpen() {
        if (allowConsole) return;

        // 清空页面内容
        document.body.innerHTML = `
      <style>
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .warning-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
          margin: 0;
          overflow: hidden;
          position: relative;
        }
        .warning-container::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: float 20s infinite linear;
        }
        .warning-box {
          text-align: center;
          color: white;
          padding: 60px 50px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 30px;
          backdrop-filter: blur(20px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 80px rgba(126, 34, 206, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          max-width: 500px;
          animation: slideIn 0.6s ease-out;
          position: relative;
          z-index: 1;
        }
        .warning-icon {
          font-size: 80px;
          margin: 0 0 30px 0;
          animation: pulse 2s infinite;
          display: inline-block;
          text-shadow: 0 0 30px rgba(255, 200, 0, 0.8);
        }
        .warning-title {
          font-size: 32px;
          margin: 0 0 15px 0;
          font-weight: 700;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .warning-subtitle {
          font-size: 18px;
          opacity: 0.85;
          margin: 0 0 25px 0;
          line-height: 1.6;
        }
        .warning-tip {
          font-size: 14px;
          opacity: 0.6;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          margin-top: 20px;
          border-left: 3px solid rgba(255, 255, 255, 0.3);
        }
        .warning-dots {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 30px;
        }
        .dot {
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.3s; }
        .dot:nth-child(3) { animation-delay: 0.6s; }
      </style>
      <div class="warning-container">
        <div class="warning-box">
          <div class="warning-icon">🔒</div>
          <h2 class="warning-title">访问受限</h2>
          <p class="warning-subtitle">检测到未授权的调试行为<br/>您的操作已被记录</p>
          <div class="warning-tip">
            💡 提示: 请关闭开发者工具并刷新页面继续访问
          </div>
          <div class="warning-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
      </div>
    `;

        // 持续触发 debugger
        setInterval(() => {
            if (!allowConsole) {
                debugger;
            }
        }, 100);
    }

    const originalConsole = {};
    ['log', 'warn', 'error', 'info', 'debug', 'table', 'clear', 'dir', 'dirxml', 'trace'].forEach(method => {
        originalConsole[method] = console[method];
        console[method] = function () {
            if (allowConsole) {
                originalConsole[method].apply(console, arguments);
            }
        };
    });

    setInterval(detectDevTools, 500);
    setInterval(checkDebugger, 1000);

    window.addEventListener('load', () => {
        setTimeout(consoleDetect, 1000);
    });

    document.addEventListener('selectstart', function (e) {
        if (!allowConsole) {
            e.preventDefault();
            return false;
        }
    }, true);

    window.addEventListener('resize', detectDevTools);

    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }

    console.log('%c🔒 控制台已锁定', 'color: #ff0000; font-size: 16px; font-weight: bold;');
    console.log('%c输入密钥序列解锁...', 'color: #999; font-size: 12px;');

})();
