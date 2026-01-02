# 服务器部署指南

## 前置要求

- Docker + Docker Compose

## 部署步骤

```bash
# 1. 克隆代码
git clone https://github.com/LittleCrabs/gmx.git
cd GMX/server

# 2. 启动服务
docker-compose up -d --build

# 3. 查看日志
docker-compose logs -f
```

服务运行在 `http://<服务器IP>:5050`

```注意，这个ip就是客户端第一个输入框的ip。这两个需要保持一致s```

## 默认账号

- 用户名：admin
- 密码：admin123

## 常用命令

```bash
# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 备份数据库
docker cp gmx-server:/app/instance/gmx.db ./gmx.db.backup

# 恢复数据库
docker cp ./gmx.db.backup gmx-server:/app/instance/gmx.db
docker-compose restart
```
