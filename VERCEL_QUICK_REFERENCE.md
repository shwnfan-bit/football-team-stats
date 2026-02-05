# Vercel 网站部署 - 速查表

## ⚡ 快速步骤（5 分钟完成）

### 1. 推送代码到 GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/football-team-stats.git
git branch -M main
git push -u origin main
```

### 2. 登录 Vercel
访问 [https://vercel.com](https://vercel.com) → 使用 GitHub 登录

### 3. 创建项目
点击 "Add New" → "Project" → 选择仓库 → Import

### 4. 配置环境变量
- Key: `DATABASE_URL`
- Value: `postgresql://username:password@host:port/database`
- Environment: Production + Preview

### 5. 部署
点击 "Deploy" → 等待 2-3 分钟 → 完成！

### 6. 访问应用
点击 "Visit" 按钮或访问 `https://your-project-name.vercel.app`

---

## 📋 配置检查清单

### ✅ 部署前检查

- [ ] GitHub 仓库已创建
- [ ] 代码已推送到 GitHub
- [ ] package.json 存在
- [ ] 构建命令正确（`pnpm run build`）
- [ ] 安装命令正确（`pnpm install`）
- [ ] src/app/ 目录存在
- [ ] 数据库连接字符串已获取

### ✅ 环境变量检查

- [ ] `DATABASE_URL` 已添加
- [ ] 值格式正确：`postgresql://username:password@host:port/database`
- [] 已选择 Production 环境
- [ ] 已选择 Preview 环境

### ✅ 部署后验证

- [ ] 页面可以正常访问
- [ ] 无控制台错误
- [ ] 数据库连接正常
- [ ] 管理员登录功能正常
- [ ] 增删改查功能正常

---

## 🔑 环境变量配置

### DATABASE_URL 格式

```
postgresql://[用户名]:[密码]@[主机]:[端口]/[数据库名]
```

### 示例

```
postgresql://postgres.mypostgresdb:Abc123456@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### 获取方式

#### Supabase
1. 登录 Supabase Dashboard
2. 项目 → Settings → Database
3. Connection String → URI
4. 复制 `postgres://...` 开头的字符串

#### Neon
1. 登录 Neon Dashboard
2. Project → Connection Details
3. Copy Connection String

#### Railway
1. 登录 Railway Dashboard
2. Project → Variables
3. 复制 `DATABASE_URL` 的值

---

## 🚀 部署流程图

```
┌─────────────────┐
│ 1. 推送到 GitHub│
└────────┬────────┘
         ↓
┌─────────────────┐
│ 2. 登录 Vercel  │
└────────┬────────┘
         ↓
┌─────────────────┐
│ 3. 创建项目     │
└────────┬────────┘
         ↓
┌─────────────────┐
│ 4. 配置环境变量 │
└────────┬────────┘
         ↓
┌─────────────────┐
│ 5. 部署         │
└────────┬────────┘
         ↓
┌─────────────────┐
│ 6. 验证应用     │
└─────────────────┘
```

---

## ⚙️ Vercel 配置详解

### Project Information

| 字段 | 说明 | 是否需要修改 |
|------|------|--------------|
| Project Name | 项目名称 | 可选 |
| URL | 部署后的 URL | 自动生成 |
| Framework Preset | 框架预设 | 自动检测 |
| Root Directory | 项目根目录 | 通常无需修改 |

### Build & Development Settings

| 字段 | 值 | 说明 |
|------|-----|------|
| Build Command | `pnpm run build` | 构建命令 |
| Output Directory | `.next` | 输出目录 |
| Install Command | `pnpm install` | 安装命令 |
| Dev Command | `pnpm run dev` | 开发命令 |

### Environment Variables

| 变量名 | 说明 | 必需 |
|--------|------|------|
| DATABASE_URL | 数据库连接字符串 | ✅ 是 |

---

## 🌍 推荐部署区域

| 区域代码 | 名称 | 适用场景 |
|----------|------|----------|
| hkg1 | 香港 | 中国大陆用户（推荐 ⭐） |
| sin1 | 新加坡 | 东南亚用户 |
| nrt1 | 东京 | 日本用户 |
| iad1 | 美国东部 | 北美用户 |
| sfo1 | 美国西部 | 北美西海岸用户 |

**设置方法：**
- 网站：项目设置 → General → Regions → 选择 Hong Kong (hkg1)
- CLI: `vercel regions set hkg1`

---

## 🐛 常见错误速查

### 构建错误

| 错误信息 | 原因 | 解决方案 |
|----------|------|----------|
| `Command "pnpm run build" exited with (1)` | 构建失败 | 检查代码和依赖 |
| `Cannot find module 'xxx'` | 依赖缺失 | 检查 package.json |
| `SyntaxError: Unexpected token` | 语法错误 | 修复代码错误 |

### 运行时错误

| 错误信息 | 原因 | 解决方案 |
|----------|------|----------|
| `connection refused` | 数据库连接失败 | 检查 DATABASE_URL |
| `Invalid connection string` | 连接字符串错误 | 检查格式 |
| `404 Not Found` | 页面不存在 | 检查路由配置 |

### 部署错误

| 错误信息 | 原因 | 解决方案 |
|----------|------|----------|
| `Exceeded bandwidth limit` | 超出免费额度 | 优化或升级 |
| `Deployment timeout` | 部署超时 | 优化构建时间 |

---

## 🔍 日志查看

### 查看构建日志

**方法 1：网站**
1. 进入项目 → Deployments
2. 点击具体部署
3. 点击 "Build Logs"

**方法 2：CLI**
```bash
vercel logs
```

### 查看实时日志

```bash
# 查看最新日志
vercel logs --follow

# 查看特定部署的日志
vercel logs <deployment-id>
```

---

## 📊 性能监控

### 关键指标

| 指标 | 建议值 | 说明 |
|------|--------|------|
| 首屏加载 | < 2 秒 | 用户感知 |
| API 响应 | < 500ms | 交互流畅 |
| 构建时间 | < 3 分钟 | 部署效率 |

### 查看性能数据

1. 进入项目 → Analytics
2. 查看访问统计
3. 查看性能指标

---

## 🔄 自动部署

### 配置 Git 自动部署

1. 项目 → Settings → Git
2. 确认 "Git Integration" 已启用
3. 设置主分支：`main` 或 `master`

### 工作流程

```bash
# 修改代码
git add .
git commit -m "feat: 添加新功能"

# 推送到主分支（自动部署到生产环境）
git push origin main

# 推送到其他分支（自动部署为预览环境）
git checkout -b feature/new-feature
git push origin feature/new-feature
```

---

## 💡 最佳实践

### 1. 使用环境变量

✅ 推荐：
```typescript
const dbUrl = process.env.DATABASE_URL;
```

❌ 不推荐：
```typescript
const dbUrl = "postgresql://...";  // 硬编码
```

### 2. 配置缓存

```typescript
// 页面级别缓存
export const revalidate = 300;  // 5 分钟
```

### 3. 优化图片

```tsx
import Image from 'next/image';

<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  priority  // 首屏图片
/>
```

### 4. 错误处理

```typescript
export default async function Page() {
  try {
    const data = await fetchData();
    return <div>{data}</div>;
  } catch (error) {
    return <div>Error: {error.message}</div>;
  }
}
```

---

## 📚 快速链接

- [Vercel 官网](https://vercel.com)
- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署](https://nextjs.org/docs/deployment)
- [详细部署步骤](./VERCEL_WEBSITE_DEPLOYMENT_STEPS.md)

---

## 🆘 紧急求助

遇到紧急问题？

1. **查看日志**：Vercel Dashboard → Deployments → Logs
2. **回滚部署**：点击旧部署 → "Redeploy"
3. **联系支持**：Vercel Dashboard → Support

---

**需要更多帮助？** 查看 [VERCEL_WEBSITE_DEPLOYMENT_STEPS.md](./VERCEL_WEBSITE_DEPLOYMENT_STEPS.md)
