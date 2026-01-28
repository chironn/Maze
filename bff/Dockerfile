# 后端 Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建
RUN npm run build

# 生产环境镜像
FROM node:20-alpine

WORKDIR /app

# 复制 package 文件和构建产物
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/data ./src/data

# 仅安装生产依赖
RUN npm ci --omit=dev

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["node", "dist/server.js"]
