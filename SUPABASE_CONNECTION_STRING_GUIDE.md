# Supabase 获取连接字符串 - 正确路径 ⭐⭐⭐⭐⭐

## 🎯 正确的路径（重要！）

你点击的是左侧主菜单中的 "Database"，但我们需要的是 **Settings** 里的 **Database**。

### ✅ 正确路径

```
左侧菜单
  ↓
点击 "Settings"（齿轮图标 ⚙️）
  ↓
点击 "Database"（Settings 子菜单）
  ↓
向下滚动到 "Connection info" 部分
  ↓
复制 "Connection string"
```

---

## 📸 详细步骤

### 步骤 1：找到 Settings

在 Supabase Dashboard 左侧菜单：

**找到齿轮图标 ⚙️**

通常在最下方，菜单项名称是 **"Settings"**

点击它！

---

### 步骤 2：在 Settings 中找到 Database

点击 Settings 后，会展开子菜单：

**子菜单包括：**
- **General**
- **Database** ← 点击这个！
- **API**
- **Authentication**

点击 **"Database"**

---

### 步骤 3：找到 Connection String

进入 Database 设置页面后：

**向下滚动**，找到标题为 **"Connection info"** 的部分

你会看到：
```
Connection info

Connection string (URI)
[postgresql://postgres.xxxxxx:[YOUR-PASSWORD]@aws-0-xxx...-1.pooler.supabase.com:6543/postgres] 📋
```

---

### 步骤 4：复制连接字符串

1. 点击文本框右侧的 **复制图标** 📋
2. 复制后，连接字符串格式如下：

```
postgresql://postgres.xxxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

### 步骤 5：替换密码

⚠️ **重要**：将连接字符串中的 `[YOUR-PASSWORD]` 替换为你创建项目时设置的数据库密码

**替换前：**
```
postgresql://postgres.xxxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**替换后（假设密码是 `MyPassword123`）：**
```
postgresql://postgres.xxxxxx:MyPassword123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

## 🖼️ 界面说明

### 你看到的界面（左侧 Database Management）

```
左侧菜单：
├─ Project Home
├─ Database           ← 你点击了这个 ❌
│  ├─ Schema Visualizer
│  ├─ Tables
│  ├─ Functions
│  ├─ Triggers
│  ├─ ...
├─ SQL Editor
└─ Settings (⚙️)      ← 应该点击这个 ✅
```

### 应该看到的界面（正确的 Database Settings）

```
左侧菜单：
├─ Project Home
├─ Database
├─ SQL Editor
└─ Settings (⚙️)
   ├─ General
   ├─ Database       ← 点击这个 ✅
   ├─ API
   └─ Authentication

右侧页面标题：Database Settings
├─ Connection info    ← 找到这里 ✅
│  ├─ Connection string (URI)
│  └─ ...
├─ Database URL
└─ ...
```

---

## 🎯 快速定位

### 方法 1：使用快捷路径

如果你看不到 Settings，可以尝试：

1. **点击项目名称**（页面左上角）
2. 在下拉菜单中选择 **"Project Settings"**
3. 在设置页面中点击 **"Database"** 标签

### 方法 2：直接访问 URL

如果你的 Supabase 项目 URL 是：
```
https://supabase.com/dashboard/project/xxxxxxxxxxxx
```

那么可以直接访问：
```
https://supabase.com/dashboard/project/xxxxxxxxxxxx/settings/database
```

将 `xxxxxxxxxxxx` 替换为你的项目 ID。

---

## 💡 提示

### 如何找到项目 ID？

1. 看浏览器地址栏
2. URL 格式：`https://supabase.com/dashboard/project/[PROJECT-ID]/...`
3. `[PROJECT-ID]` 就是一串字符，如 `abc123xyz456`

### 如果 Settings 菜单找不到？

- 尝试刷新页面
- 确认你有足够的权限
- 检查是否登录了正确的账号

---

## 📝 替换密码后的最终格式

**示例（假设密码是 `MyPassword123`）：**

```
postgresql://postgres.abc123xyz456:MyPassword123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**格式分解：**
- `postgresql://` - 协议
- `postgres.abc123xyz456` - 用户名
- `MyPassword123` - 密码（你设置的）
- `aws-0-ap-southeast-1.pooler.supabase.com` - 主机地址
- `6543` - 端口
- `postgres` - 数据库名

---

## ✅ 验证连接字符串

复制后，检查以下几点：

- [ ] 以 `postgresql://` 开头
- [ ] 包含用户名
- [ ] 包含密码（已替换）
- [ ] 包含主机地址
- [ ] 包含端口
- [ ] 包含数据库名

---

## 🚀 下一步

拿到连接字符串后：

1. **回到 Vercel 项目配置页面**
2. **添加环境变量**：
   - Key: `DATABASE_URL`
   - Value: 粘贴你的连接字符串
   - Environment: Production + Preview
3. **保存并继续部署**

---

**现在试试正确的路径！找到 Settings ⚙️ → Database → Connection string** 🎯

如果还有问题，随时告诉我你看到的界面，我会进一步指导！