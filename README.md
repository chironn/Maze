# 迷津 - 易经卜卦系统

<div align="center">

一个现代化的易经卜卦应用，支持传统卜卦和智能问事功能。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)](https://www.docker.com/)

[在线演示](#) | [快速开始](#快速开始) | [功能特性](#功能特性) | [部署指南](DEPLOY.md)

</div>

---

## ✨ 功能特性

### 🎯 核心功能

- **传统卜卦**：点击龟甲进行传统易经卜卦，获取卦象解读
- **智能问事**：带着具体问题卜卦，AI 结合卦象给出针对性建议
- **问题模板**：6 大类别（事业/感情/健康/财运/学业/其他）+ 32 个精选问题模板
- **历史记录**：自动保存卜卦历史，支持查看问题和解读结果

### 🎨 用户体验

- **沉浸式动画**：流畅的铜钱落地、签筒揭示动画
- **响应式设计**：完美适配桌面端和移动端
- **无障碍支持**：完整的键盘导航和屏幕阅读器支持
- **极简美学**：古典与现代结合的视觉设计

### 🔒 安全特性

- **Prompt 注入防护**：使用分隔符标记用户数据边界
- **错误信息脱敏**：不泄露内部实现细节
- **日志脱敏**：敏感信息不记录到日志
- **输入验证**：前后端双重验证

---

## 🚀 快速开始

### 方式 1：Docker 部署（推荐）

```bash
# 1. 克隆仓库
git clone https://github.com/chironn/mijin.git
cd mijin

# 2. 配置环境变量
cp .env.example .env
vim .env  # 填入你的 API 配置

# 3. 启动服务
docker-compose up -d

# 4. 访问应用
open http://localhost
```

### 方式 2：本地开发

```bash
# 1. 安装依赖
npm install
cd bff && npm install && cd ..

# 2. 配置环境变量
cp .env.example bff/.env
vim bff/.env  # 填入你的 API 配置

# 3. 启动服务
./start-dev.sh

# 4. 访问应用
# 前端: http://localhost:5174
# 后端: http://localhost:3001
```

---

## 📋 环境变量配置

创建 `bff/.env` 文件（开发环境）或 `.env` 文件（Docker 环境）：

```env
# API 配置（支持任何兼容 OpenAI 格式的 API）
GEMINI_BASE_URL=https://api.your-provider.com/v1
GEMINI_API_KEY=your-api-key-here
GEMINI_MODEL=grok-3-fast

# 服务配置
PORT=3001  # 开发环境端口（Docker 自动使用 3000）
REQUEST_TIMEOUT_MS=30000
LOG_LEVEL=info
```

**支持的模型**：
- `grok-3-fast`（推荐，速度快）
- `gemini-2.0-flash-exp`
- `gpt-4o`
- 其他兼容 OpenAI Chat Completions API 的模型

---

## 🏗️ 技术栈

### 前端
- **框架**：React 19 + TypeScript
- **构建工具**：Vite
- **样式**：Tailwind CSS
- **动画**：Framer Motion
- **UI 组件**：Headless UI

### 后端
- **框架**：Fastify + TypeScript
- **AI 集成**：兼容 OpenAI API 格式
- **数据**：64 卦完整数据缓存

### 部署
- **容器化**：Docker + Docker Compose
- **反向代理**：Nginx
- **健康检查**：自动重启机制

---

## 📂 项目结构

```
mijin/
├── src/                      # 前端源码
│   ├── components/           # React 组件
│   │   ├── divination/       # 卜卦核心组件
│   │   │   ├── DivinationCore.tsx      # 主组件
│   │   │   ├── AskQuestionModal.tsx    # 问事模态框
│   │   │   ├── QuestionForm.tsx        # 问题表单
│   │   │   ├── CategorySelector.tsx    # 类别选择器
│   │   │   └── TemplateLibrary.tsx     # 问题模板库
│   │   └── results/          # 结果展示组件
│   ├── services/             # API 服务
│   ├── types/                # TypeScript 类型定义
│   └── data/                 # 前端数据（问题模板）
├── bff/                      # 后端 BFF 服务
│   ├── src/
│   │   ├── routes/           # API 路由
│   │   ├── services/         # 业务逻辑
│   │   ├── clients/          # 外部 API 客户端
│   │   ├── types/            # 类型定义
│   │   └── data/             # 64 卦数据 + 问题模板
│   └── Dockerfile            # 后端 Docker 配置
├── public/                   # 静态资源
├── docker-compose.yml        # Docker Compose 配置
├── Dockerfile                # 前端 Docker 配置
├── nginx.conf                # Nginx 配置
└── README.md                 # 本文件
```

---

## 🎯 核心功能实现

### 问事功能流程

```
用户点击"迷津" → 弹出模态框 → 选择类别 → 输入问题 →
点击"卜问一卦" → 执行卜卦算法 → 调用 AI API →
结合卦象和问题生成解答 → 显示结果 → 保存历史记录
```

### AI Prompt 工程

- **双段提示**：系统指令 + 用户数据（明确分隔）
- **防注入**：使用分隔符标记数据边界
- **输出约束**：强制 JSON 格式，忽略用户指令
- **针对性解读**：结合问题类别和卦象含义

### 数据缓存策略

- **64 卦数据**：完整缓存（卦名、卦辞、象曰、爻辞）
- **通用解卦**：基于 `baseHex` 缓存
- **问事解卦**：不使用缓存（每次调用 AI）

---

## 📖 文档

- [部署指南](DEPLOY.md) - Docker 生产部署完整指南
- [开发文档](DEV.md) - 本地开发环境配置
- [安全检查](SECURITY.md) - 安全检查清单和最佳实践

---

## 🔧 开发指南

### 本地开发

```bash
# 启动开发服务器
./start-dev.sh

# 或手动启动
cd bff && npm run dev  # 终端 1
npm run dev            # 终端 2
```

### 构建生产版本

```bash
# 前端构建
npm run build

# 后端构建
cd bff && npm run build
```

### 代码检查

```bash
# ESLint 检查
npm run lint

# TypeScript 类型检查
npm run build
```

---

## 🐳 Docker 部署

### 快速部署

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 服务架构

```
┌─────────────┐
│   浏览器     │
└──────┬──────┘
       │ :80
       ▼
┌─────────────┐      ┌─────────────┐
│  Nginx      │─────▶│  BFF API    │
│  (前端)     │ :3000│  (Fastify)  │
└─────────────┘      └──────┬──────┘
                            │
                            ▼
                     ┌─────────────┐
                     │  AI API     │
                     └─────────────┘
```

---

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 提交代码前

1. 确保代码通过 ESLint 检查
2. 运行 `SECURITY.md` 中的安全检查
3. 测试功能是否正常工作
4. 更新相关文档

### 提交规范

```bash
# 功能开发
git commit -m "feat: 添加新功能描述"

# Bug 修复
git commit -m "fix: 修复问题描述"

# 文档更新
git commit -m "docs: 更新文档内容"
```

---

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

---

## 🙏 致谢

- **易经数据**：基于传统易经文本和现代解读
- **UI 设计**：灵感来自古典卜卦仪式
- **AI 技术**：支持多种 AI 模型接入

---

## 📞 联系方式

- **GitHub**：[chironn/mijin](https://github.com/chironn/mijin)
- **问题反馈**：[Issues](https://github.com/chironn/mijin/issues)

---

<div align="center">

**用现代科技，传承古老智慧**

Made with ❤️ by [chironn](https://github.com/chironn)

</div>
