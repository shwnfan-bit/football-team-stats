# Vercel 网站部署详细步骤指南

## 📋 目录
1. [准备工作](#准备工作)
2. [推送代码到 GitHub](#推送代码到-github)
3. [注册/登录 Vercel](#注册登录-vercel)
4. [创建新项目](#创建新项目)
5. [配置项目](#配置项目)
6. [配置环境变量](#配置环境变量)
7. [开始部署](#开始部署)
8. [验证部署](#验证部署)
9. [配置域名（可选）](#配置域名可选)
10. [常见问题](#常见问题)

---

## 准备工作

### ✅ 检查清单

在开始之前，确保你已经准备好：

- [ ] **GitHub 账号**
  - 访问 [https://github.com](https://github.com) 注册
  - 免费账号即可

- [ ] **GitHub 仓库**
  - 项目代码已推送到 GitHub
  - 仓库包含完整的项目文件

- [ ] **数据库连接信息**
  - PostgreSQL 数据库的连接字符串
  - 格式：`postgresql://username:password@host:port/database`

- [ ] **项目文件完整性**
  - 确保仓库根目录有以下文件：
    - `package.json`（项目配置）
    - `.coze` 或 `vercel.json`（部署配置）
    - `src/` 目录（源代码）
    - `public/` 目录（静态资源）

---

## 推送代码到 GitHub

### 步骤 1：创建 GitHub 仓库

1. 访问 [https://github.com/new](https://github.com/new)

2. 填写仓库信息：
   - **Repository name**: 输入项目名称（如 `football-team-stats`）
   - **Description**: 可选，填写项目描述
   - **Public/Private**: 选择 Private（推荐）或 Public
   - **Initialize with README**: ❌ 不勾选
   - **Add .gitignore**: ❌ 不勾选
   - **Choose a license**: ❌ 不勾选

3. 点击 **Create repository**

### 步骤 2：推送本地代码到 GitHub

**如果本地还没有 Git 仓库：**

```bash
# 进入项目目录
cd /workspace/projects/

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 关联远程仓库
git remote add origin https://github.com/your-username/football-team-stats.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

**如果本地已有 Git 仓库：**

```bash
# 查看当前远程仓库
git remote -v

# 如果没有远程仓库，添加
git remote add origin https://github.com/your-username/football-team-stats.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 步骤 3：验证推送成功

1. 访问你的 GitHub 仓库页面
2. 检查文件是否都在
3. 确认有以下关键文件：
   - `package.json`
   - `vercel.json`（或 `.coze`）
   - `src/app/page.tsx`

---

## 注册/登录 Vercel

### 步骤 1：访问 Vercel

访问 [https://vercel.com](https://vercel.com)

### 步骤 2：注册账号

**如果还没有账号：**

1. 点击右上角的 **"Sign Up"** 按钮

2. 选择登录方式（推荐使用 GitHub）：
   - **Continue with GitHub** ⭐ 推荐
   - **Continue with GitLab**
   - **Continue with Bitbucket**

3. 点击 **"Continue with GitHub"**

4. 在 GitHub 授权页面：
   - 点击 **"Authorize Vercel"** 按钮
   - 允许 Vercel 访问你的 GitHub 账号

5. 填写注册信息：
   - **Username**: 用户名
   - **Email**: 邮箱地址
   - **Password**: 密码

6. 点击 **"Create Account"**

**如果已有账号：**

1. 点击右上角的 **"Login"** 按钮
2. 选择登录方式（如 GitHub）
3. 完成授权

### 步骤 3：验证登录成功

登录成功后，会看到 Vercel Dashboard 页面，显示：
- 欢迎信息
- 当前账号信息
- 项目列表（首次登录为空）

---

## 创建新项目

### 步骤 1：进入创建项目页面

在 Vercel Dashboard 页面：

1. 点击右上角的 **"Add New..."** 按钮
2. 在下拉菜单中选择 **"Project"**

### 步骤 2：选择仓库

会进入 **"Import Git Repository"** 页面，显示你的 GitHub 仓库列表。

**如果看到你的仓库：**
1. 找到 `football-team-stats` 仓库
2. 点击 **"Import"** 按钮

**如果没有看到仓库：**

1. 点击 **"Adjust GitHub App Permissions"** 链接
2. 进入 GitHub 应用权限设置页面
3. 点击 **"Repository Access"** 选项卡
4. 点击 **"Edit"** 按钮
5. 选择 **"Only select repositories"**
6. 在列表中找到并勾选你的仓库
7. 点击 **"Save"** 按钮
8. 返回 Vercel，刷新页面，再次选择仓库

**如果需要导入特定仓库：**
1. 点击 **"Import Project via URL"**
2. 粘贴仓库 URL：
   ```
   https://github.com/your-username/football-team-stats.git
   ```
3. 点击 **"Continue"**

---

## 配置项目

Vercel 会自动检测到这是一个 Next.js 项目，显示配置页面：

### 配置页面结构

页面分为以下几个部分：

#### 1. Project Information（项目信息）

```
Project Name
├─ football-team-stats  （项目名称，可修改）
└─ https://football-team-stats.vercel.app  （预览 URL）

Framework Preset
└─ Next.js  （自动检测，无需修改）

Root Directory
└─ ./  （项目根目录，无需修改）
```

**修改项目名称（可选）：**
- 在 "Project Name" 输入框中修改
- 建议使用小写字母和连字符
- 修改后 URL 会自动更新

#### 2. Build & Development Settings（构建和开发设置）

Vercel 会自动识别 Next.js 项目配置：

```
Build Command
└─ pnpm run build

Output Directory
└─ .next

Install Command
└─ pnpm install

Dev Command
└─ pnpm run dev
```

**确认配置正确：**
- ✅ Build Command: `pnpm run build`
- ✅ Output Directory: `.next`
- ✅ Install Command: `pnpm install`
- ✅ Dev Command: `pnpm run dev`

**如果配置不正确：**
1. 点击 **"Edit"** 按钮修改
2. 或在项目根目录创建 `vercel.json` 文件

#### 3. Environment Variables（环境变量）⚠️ 重要

这是最关键的部分！

**添加 DATABASE_URL：**

1. 找到 **"Environment Variables"** 部分
2. 点击 **"New Variable"** 按钮
3. 在弹出的对话框中填写：

   **Key**: `DATABASE_URL`

   **Value**: 粘贴你的数据库连接字符串

   ```
   postgresql://username:password@host:port/database
   ```

   **示例：**
   ```
   postgresql://postgres.mypostgresdb:Abc123456@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

4. 选择环境（Environment）：
   - **Production**: 生产环境（必须选择）
   - **Preview**: 预览环境（建议选择）
   - **Development**: 开发环境（可选）

   **推荐选择：** Production + Preview

5. 点击 **"Save"** 按钮

**验证环境变量：**
- 添加后，会在列表中显示
- 确认 Key 和 Value 都正确
- 可以添加多个环境变量

#### 4. Override Path（路径覆盖）

通常不需要配置，保持默认即可。

#### 5. Regions（部署区域）

**默认配置：**
- 选择最近的区域

**推荐配置：**
- **Hong Kong (hkg1)** - 适合中国用户访问

**设置方法：**
1. 点击 **"Edit"** 按钮
2. 在 "Regions" 下拉菜单中选择 "Hong Kong (hkg1)"
3. 点击 **"Save"** 按钮

**注意：**
- 如果没有看到 Regions 选项，可以先部署，后续再修改
- 部署后可以在项目设置中修改

#### 6. Project Settings（项目设置）

**Git Integration（Git 集成）：**
- 默认启用
- 推荐保持开启
- 每次推送代码会自动部署

**Command Override（命令覆盖）：**
- 通常不需要配置

---

## 开始部署

### 步骤 1：确认所有配置

在点击 "Deploy" 之前，再次检查：

- [ ] Project Name 正确
- [ ] Framework Preset 是 Next.js
- [ ] Environment Variables 已添加 `DATABASE_URL`
- [ ] 构建命令正确（`pnpm run build`）
- [ ] 安装命令正确（`pnpm install`）

### 步骤 2：点击 Deploy

点击页面底部的 **"Deploy"** 按钮

### 步骤 3：等待构建

页面会自动跳转到部署状态页面，显示构建进度：

**构建阶段：**

1. **Building...** - 正在构建
   - 安装依赖
   - 运行构建命令
   - 生成静态资源

2. **Build Completed** - 构建完成

**部署阶段：**

3. **Deploying...** - 正在部署
   - 上传构建产物
   - 配置 CDN
   - 启动服务

4. **Deployment Complete** - 部署完成

**预计时间：**
- 首次部署：2-5 分钟
- 后续部署：1-2 分钟

### 步骤 4：查看构建日志

在部署页面，可以查看详细的构建日志：

**关键日志信息：**

```
1. Cloning repository...
   ✅ 克隆仓库成功

2. Installing dependencies...
   ✅ 安装依赖成功
   - pnpm install

3. Building application...
   ✅ 构建成功
   - pnpm run build
   - Build completed in 45s

4. Uploading...
   ✅ 上传成功

5. Deploying...
   ✅ 部署成功
```

**如果构建失败：**
1. 查看 **"Error"** 红色日志
2. 找到错误信息
3. 修复后推送代码，自动重新部署

---

## 验证部署

### 步骤 1：访问应用

部署成功后，页面会显示：

```
✅ Production
https://football-team-stats.vercel.app

✅ Preview
https://football-team-stats-git-feature-branch.vercel.app
```

1. 点击 **"Visit"** 按钮
2. 或复制 URL 在浏览器中打开

### 步骤 2：功能验证

**基础功能检查：**

- [ ] 页面正常加载
- [ ] 无控制台错误（F12 打开开发者工具）
- [ ] 样式显示正常
- [ ] 响应式布局正常

**数据库功能检查：**

- [ ] 可以查看球员列表
- [ ] 可以查看比赛列表
- [ ] 统计数据正常显示

**管理员功能检查：**

- [ ] 登录功能正常
- [ ] 添加球员功能正常
- [ ] 编辑球员功能正常
- [ ] 删除球员功能正常

### 步骤 3：检查部署信息

返回 Vercel 部署页面，检查：

**Deployment Details：**
- **Domain**: 部署域名
- **Framework**: Next.js
- **Build Time**: 构建时间
- **Status**: Ready

**Environment：**
- **Region**: 部署区域
- **Edge Network**: 是否启用边缘网络

### 步骤 4：查看性能信息

点击 **"Analytics"** 标签页，查看：

- **Visits**: 访问次数
- **Bandwidth**: 带宽使用
- **Builds**: 构建次数

---

## 配置域名（可选）

### 步骤 1：进入域名设置

1. 在项目页面，点击 **"Settings"** 标签
2. 点击左侧菜单的 **"Domains"**

### 步骤 2：添加自定义域名

1. 在 **"Add Domain"** 输入框中输入域名
2. 例如：`www.yourdomain.com`
3. 点击 **"Add"** 按钮

### 步骤 3：配置 DNS

Vercel 会显示 DNS 配置信息：

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**在域名注册商处添加 DNS 记录：**

1. 登录域名注册商（如阿里云、腾讯云）
2. 进入域名管理 → DNS 解析
3. 添加 CNAME 记录：
   - 主机记录：`www`
   - 记录类型：`CNAME`
   - 记录值：`cname.vercel-dns.com`
4. 保存并等待 DNS 生效（通常 10-30 分钟）

### 步骤 4：验证域名

1. 返回 Vercel 域名页面
2. 等待 DNS 生效
3. 状态会从 **"Pending"** 变为 **"Valid Configuration"**
4. 可以通过自定义域名访问应用

---

## 常见问题

### 问题 1：部署失败 - Build Error

**错误信息：**
```
Error: Command "pnpm run build" exited with (1)
```

**可能原因：**
1. 构建命令配置错误
2. 代码有语法错误
3. 依赖安装失败
4. 环境变量缺失

**解决方案：**

1. **查看详细错误日志：**
   - 点击部署页面上的 **"Build Logs"**
   - 找到具体的错误信息

2. **检查构建命令：**
   - 确认 `package.json` 中的 `build` 脚本正确
   ```json
   {
     "scripts": {
       "build": "next build"
     }
   }
   ```

3. **检查依赖：**
   - 确认所有依赖都在 `package.json` 中
   - 运行 `pnpm install` 确保本地没有错误

4. **检查代码：**
   - 本地运行 `pnpm run build` 验证
   - 修复错误后推送代码

---

### 问题 2：数据库连接失败

**错误信息：**
```
Error: connection refused
Error: Invalid connection string
```

**可能原因：**
1. `DATABASE_URL` 环境变量配置错误
2. 数据库连接字符串格式错误
3. 数据库不允许 Vercel IP 访问

**解决方案：**

1. **检查环境变量：**
   - 进入项目 → Settings → Environment Variables
   - 确认 `DATABASE_URL` 已添加到 Production 环境
   - 检查值是否正确

2. **验证连接字符串格式：**
   ```
   postgresql://username:password@host:port/database
   ```

3. **检查数据库权限：**
   - 登录数据库管理平台（如 Supabase、Neon）
   - 检查是否允许外部连接
   - 添加 Vercel IP 白名单（如果需要）

4. **查看部署日志：**
   - 在部署页面查看详细错误信息
   - 确认具体连接错误

---

### 问题 3：页面显示 404

**可能原因：**
1. 构建未成功完成
2. 路由配置错误
3. 静态资源路径错误

**解决方案：**

1. **检查构建状态：**
   - 确认部署状态是 "Ready"
   - 不是 "Building" 或 "Error"

2. **检查路由：**
   - 确认 `src/app/` 目录结构正确
   - 检查路由文件命名

3. **查看构建日志：**
   - 检查是否有文件生成警告
   - 确认静态资源路径正确

---

### 问题 4：样式显示异常

**可能原因：**
1. Tailwind CSS 未正确配置
2. 静态资源路径错误
3. CSS 文件未加载

**解决方案：**

1. **检查 Tailwind 配置：**
   - 确认 `tailwind.config.ts` 存在
   - 检查 `globals.css` 中的 Tailwind 指令

2. **检查静态资源：**
   - 确认 `public/` 目录存在
   - 检查图片路径是否正确

3. **查看控制台错误：**
   - F12 打开开发者工具
   - 查看 Console 和 Network 标签页

---

### 问题 5：部署后代码更新不生效

**可能原因：**
1. 代码未推送到 GitHub
2. Git 自动部署未启用
3. 缓存问题

**解决方案：**

1. **确认代码已推送：**
   ```bash
   git add .
   git commit -m "fix: 修复问题"
   git push origin main
   ```

2. **检查 Git 集成：**
   - 项目 → Settings → Git
   - 确认 "Git Integration" 已启用

3. **手动触发部署：**
   - Vercel Dashboard → Deployments
   - 点击 **"Redeploy"** 按钮

4. **清除浏览器缓存：**
   - Ctrl + Shift + R (Windows)
   - Cmd + Shift + R (Mac)

---

### 问题 6：免费额度不足

**错误信息：**
```
Error: Exceeded bandwidth limit
```

**解决方案：**

1. **查看使用情况：**
   - Vercel Dashboard → Usage
   - 检查带宽和构建次数

2. **优化使用：**
   - 优化图片大小
   - 启用缓存
   - 减少不必要的重新部署

3. **升级计划：**
   - Pro 计划：$20/月
   - 包含 1TB 带宽
   - 更长的构建时间

---

## 🎉 部署成功后

### 下一步操作

1. **测试所有功能**
   - 访问应用
   - 测试增删改查
   - 验证响应式设计

2. **分享链接**
   - 复制 Vercel URL
   - 分享给团队成员

3. **配置 Git 自动部署**
   - 确保 Git 集成已启用
   - 推送代码自动部署

4. **监控应用**
   - 查看访问统计
   - 监控错误日志

5. **配置自定义域名（可选）**
   - 添加自定义域名
   - 配置 DNS 解析

---

## 📚 相关资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [Vercel 常见问题](https://vercel.com/docs/getting-started/faq)
- [Vercel 免费额度说明](https://vercel.com/docs/accounts/plans/overview)

---

## 🆘 获取帮助

遇到问题？

1. **查看部署日志**
   - Vercel Dashboard → Deployments → Logs

2. **搜索错误信息**
   - 将错误信息复制到 Google 搜索

3. **Vercel 社区**
   - [Vercel GitHub Discussions](https://github.com/orgs/vercel/discussions)

4. **联系支持**
   - Vercel Dashboard → Support

---

**祝你部署成功！** 🚀
