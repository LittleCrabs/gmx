# GMX Billing Meter System

打印机计费邮件自动处理系统，支持IMAP邮箱收取和解析打印机状态报告。

## 项目结构

```
GMX/
├── server/           # 服务器端
│   ├── app.py        # Flask API服务
│   └── requirements.txt
├── client/           # 客户端
│   ├── GMX.py        # 主程序 (PySide GUI)
│   ├── config.py     # 服务器地址配置
│   ├── build.bat     # 打包脚本
│   └── requirements.txt
└── README.md
```

## 服务器部署

1. 安装依赖:
```bash
cd GMX/server
pip install -r requirements.txt
```

2. 启动服务:
```bash
python app.py
```

服务器默认运行在 http://localhost:5050

默认管理员账号: admin / admin123

## 客户端使用

### 开发运行
```bash
cd GMX/client
pip install -r requirements.txt
python GMX.py
```

### 打包为EXE
```bash
cd GMX/client
pip install -r requirements.txt
build.bat
```

打包后的 GMX.exe 在 dist/ 目录下。

## 功能说明

### 普通用户
- 登录/注册
- 获取邮件并生成报告
- 查看打印机状态

### 管理员
- 用户管理 (添加/删除/启用/禁用)
- 发件人邮箱管理
- IMAP服务器配置
- 系统设置

## 配置更新

服务器端修改配置后，客户端重新登录或点击"Refresh Config"即可获取最新配置，无需重新打包。
