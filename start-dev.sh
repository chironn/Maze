#!/bin/bash

# 同时启动前端和后端开发服务器

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 启动开发环境..."

# 清理旧进程
echo "📦 清理旧进程..."
lsof -ti :3001 | xargs kill -9 2>/dev/null
lsof -ti :5174 | xargs kill -9 2>/dev/null
sleep 1

# 启动 BFF 后端服务
echo "🔧 启动 BFF 服务 (端口 3001)..."
cd "$SCRIPT_DIR/bff" && npx tsx src/server.ts &
BFF_PID=$!

# 等待 BFF 启动
sleep 2

# 启动前端 Vite 服务
echo "🎨 启动前端服务 (端口 5174)..."
cd "$SCRIPT_DIR" && npm run dev &
VITE_PID=$!

echo ""
echo "✅ 服务已启动:"
echo "   前端: http://localhost:5174"
echo "   后端: http://localhost:3001"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 捕获退出信号，清理子进程
trap "echo ''; echo '🛑 停止服务...'; kill $BFF_PID $VITE_PID 2>/dev/null; exit 0" SIGINT SIGTERM

# 等待子进程
wait
