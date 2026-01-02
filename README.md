# GMX Billing Meter System

打印机计费邮件自动处理系统，通过 IMAP 收取打印机状态邮件，解析并生成报告。

## 项目结构

```
GMX/
├── server/                 # 后端服务 (Flask)
│   ├── app.py              # 主程序
│   ├── requirements.txt    # Python依赖
│   ├── Dockerfile          # Docker镜像
│   ├── docker-compose.yml  # Docker编排
│   └── instance/           # 数据库目录
│       └── gmx.db          # SQLite数据库
├── client-electron/        # 前端客户端 (Vue + Electron)
│   ├── src/                # Vue源码
│   ├── electron/           # Electron主进程
│   └── package.json        # Node依赖
├── client/                 # 旧版Python客户端 (已弃用)
└── README.md
```

---

## 服务器部署

### 方式一：Docker 部署（推荐）

1. 进入服务器目录：
```bash
cd server
```

2. 构建并启动：
```bash
docker-compose up -d --build
```

3. 查看日志：
```bash
docker-compose logs -f
```

4. 停止服务：
```bash
docker-compose down
```

数据库文件存储在 Docker volume `gmx-data` 中，容器重建不会丢失数据。

### 方式二：直接运行

1. 安装 Python 3.11+

2. 安装依赖：
```bash
cd server
pip install -r requirements.txt
```

3. 启动服务：
```bash
python app.py
```

服务运行在 `http://0.0.0.0:5050`

### 生产环境（使用 Gunicorn）

```bash
pip install gunicorn
gunicorn --bind 0.0.0.0:5050 --workers 2 --timeout 600 app:app
```

---

## 客户端构建

### 开发模式

```bash
cd client-electron
pnpm install
pnpm run electron:dev
```

### 打包 Windows 安装程序

```bash
cd client-electron
pnpm install
pnpm run electron:build
```

打包后的安装程序在 `client-electron/dist-electron/` 目录。

---

## 默认账号

- 用户名：`admin`
- 密码：`admin123`

首次部署后请立即修改密码。

---

## 配置说明

### IMAP 配置（管理员设置）

- Server: IMAP服务器地址
- Port: 993 (SSL)
- Username: 邮箱账号
- Password: 邮箱密码

### 发件人邮箱

添加打印机发送状态邮件的发件人地址，系统只会处理这些地址发来的邮件。

### 系统配置

- `interval`: 获取邮件的时间范围（天数），默认 7 天

---

## 数据库

使用 SQLite，数据库文件位于 `server/instance/gmx.db`

### 主要表结构

| 表名 | 说明 |
|------|------|
| user | 用户账号 |
| email_config | 发件人邮箱配置 |
| imap_config | IMAP服务器配置 |
| system_config | 系统配置 |
| sn_mapping | 序列号-公司名映射 |
| email_record | 邮件记录缓存 |

### 备份数据库

```bash
# Docker 方式
docker cp gmx-server:/app/instance/gmx.db ./gmx.db.backup

# 直接部署方式
cp server/instance/gmx.db ./gmx.db.backup
```

### 恢复数据库

```bash
# Docker 方式
docker cp ./gmx.db.backup gmx-server:/app/instance/gmx.db
docker-compose restart

# 直接部署方式
cp ./gmx.db.backup server/instance/gmx.db
```

---

## 服务器迁移步骤

1. 备份旧服务器数据库：
```bash
docker cp gmx-server:/app/instance/gmx.db ./gmx.db.backup
```

2. 将以下文件复制到新服务器：
   - `server/` 目录
   - `gmx.db.backup` 数据库备份

3. 在新服务器启动服务：
```bash
cd server
docker-compose up -d --build
```

4. 恢复数据库：
```bash
docker cp ./gmx.db.backup gmx-server:/app/instance/gmx.db
docker-compose restart
```

5. 更新客户端的服务器地址（在 `client-electron/src/api/index.js` 中修改 `baseURL`），重新打包分发。

---

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/login | 登录 |
| POST | /api/register | 注册 |
| GET | /api/user/info | 获取用户信息 |
| GET | /api/client/config | 获取客户端配置 |
| POST | /api/fetch-emails | 获取邮件 |
| GET | /api/email-records | 获取邮件记录 |
| GET | /api/export/billing-records | 导出计费记录Excel |
| GET | /api/export/printer-report | 导出打印机状态报告Excel |
| GET/POST | /api/sn-mappings | SN映射管理 |
| GET/POST | /api/admin/* | 管理员接口 |

---

## 常见问题

### 邮件获取失败
- 检查 IMAP 配置是否正确
- 确认邮箱开启了 IMAP 访问
- 检查发件人邮箱是否已添加

### 数据库锁定
SQLite 在高并发时可能出现锁定，重启服务即可：
```bash
docker-compose restart
```

### 客户端连接失败
- 确认服务器地址和端口正确
- 检查防火墙是否开放 5050 端口
