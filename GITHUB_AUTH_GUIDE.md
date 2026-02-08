# GitHub 推送认证解决方案

## ⚠️ 问题说明

推送代码到 GitHub 时需要认证，因为我们使用的是 HTTPS 方式。

---

## 🚀 解决方案 1：使用 Personal Access Token（推荐）

### 步骤 1：创建 Personal Access Token

1. **登录 GitHub**
   - 访问：[https://github.com/settings/tokens](https://github.com/settings/tokens)

2. **创建新 Token**
   - 点击 **"Generate new token"** → **"Generate new token (classic)"**

3. **配置 Token**
   - **Note**: 输入描述，如 `Vercel Deployment`
   - **Expiration**: 选择过期时间，推荐 `90 days` 或 `No expiration`
   - **Scopes**（权限）：
     - ✅ `repo`（完整仓库权限）
     - ✅ `workflow`（工作流权限）

4. **生成 Token**
   - 点击底部的绿色按钮 **"Generate token"**

5. **复制 Token**
   - ⚠️ **立即复制 Token**（只显示一次！）
   - Token 格式类似：`ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### 步骤 2：使用 Token 推送

**方法 A：使用 Git Credential Store（推荐，记住密码）**

```bash
# 配置 Git 记住凭证
git config --global credential.helper store

# 推送代码（会提示输入用户名和密码）
git push -u origin main
```

当提示时：
- **Username**: `shwnfan-bit`
- **Password**: 粘贴你的 Personal Access Token（不是 GitHub 密码！）

**方法 B：在 URL 中包含 Token**

```bash
# 直接使用 Token 推送
git push https://shwnfan-bit:YOUR_TOKEN@github.com/shwnfan-bit/football-team-stats.git main
```

将 `YOUR_TOKEN` 替换为你刚创建的 Token。

---

## 🔑 解决方案 2：配置 SSH 密钥（一次性配置，后续更方便）

### 步骤 1：生成 SSH 密钥

```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "shwnfan-bit@github.com"
```

按提示操作：
- 默认路径：`~/.ssh/id_ed25519`
- 可以直接按 Enter 跳过密码设置

### 步骤 2：启动 SSH Agent

```bash
# 启动 SSH Agent
eval "$(ssh-agent -s)"
```

### 步骤 3：添加 SSH 密钥

```bash
# 添加私钥
ssh-add ~/.ssh/id_ed25519
```

### 步骤 4：复制公钥到 GitHub

```bash
# 查看公钥内容
cat ~/.ssh/id_ed25519.pub
```

复制输出的公钥内容（以 `ssh-ed25519` 开头）。

### 步骤 5：在 GitHub 上添加 SSH 密钥

1. 访问：[https://github.com/settings/keys](https://github.com/settings/keys)
2. 点击 **"New SSH key"**
3. **Title**: 输入描述，如 `Vercel Deployment Key`
4. **Key**: 粘贴刚才复制的公钥
5. 点击 **"Add SSH key"**

### 步骤 6：测试 SSH 连接

```bash
# 测试 SSH 连接
ssh -T git@github.com
```

如果看到 `Hi shwnfan-bit! You've successfully authenticated...` 说明配置成功。

### 步骤 7：修改远程仓库为 SSH

```bash
# 修改远程仓库地址
git remote set-url origin git@github.com:shwnfan-bit/football-team-stats.git

# 推送代码
git push -u origin main
```

---

## 🎯 推荐选择

### 第一次部署 → 使用 Personal Access Token
- ✅ 配置简单，5 分钟完成
- ✅ 不需要 SSH 密钥配置

### 长期使用 → 配置 SSH 密钥
- ✅ 一次配置，永久使用
- ✅ 更安全，不需要每次输入密码

---

## 💡 提示

### Personal Access Token 安全
- ⚠️ 不要泄露 Token
- ⚠️ Token 有效期到期后需要重新创建
- ✅ 可以为不同项目创建不同的 Token

### SSH 密钥安全
- ✅ 密钥只保存在本地
- ✅ 比 HTTPS 更安全
- ✅ 支持多设备使用

---

## 🆘 遇到问题？

### 问题 1：Token 无效
- 检查 Token 是否过期
- 确认选择了正确的权限（repo）
- 重新创建 Token

### 问题 2：SSH 连接失败
- 检查公钥是否正确添加到 GitHub
- 确认私钥已添加到 SSH Agent
- 重新生成 SSH 密钥

### 问题 3：推送仍然失败
- 检查远程仓库地址是否正确
- 确认仓库已创建
- 查看详细错误信息
