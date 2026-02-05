/**
 * 认证管理模块
 * 提供简单的密码验证功能
 */

const ADMIN_PASSWORD_KEY = 'football_stats_admin_password';
const AUTH_TOKEN_KEY = 'football_stats_auth_token';

// 默认管理员密码（首次使用后建议修改）
const DEFAULT_ADMIN_PASSWORD = 'admin123';

/**
 * 获取管理员密码
 */
export const getAdminPassword = (): string => {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_PASSWORD;
  
  const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);
  if (storedPassword) {
    return storedPassword;
  }
  
  // 首次使用，设置默认密码
  localStorage.setItem(ADMIN_PASSWORD_KEY, DEFAULT_ADMIN_PASSWORD);
  return DEFAULT_ADMIN_PASSWORD;
};

/**
 * 设置管理员密码
 */
export const setAdminPassword = (newPassword: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);
};

/**
 * 验证密码
 */
export const verifyPassword = (password: string): boolean => {
  return password === getAdminPassword();
};

/**
 * 检查是否已登录
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!authToken) return false;
  
  // 检查 token 是否过期（24小时）
  const tokenData = JSON.parse(authToken);
  const now = Date.now();
  if (now > tokenData.expiresAt) {
    logout();
    return false;
  }
  
  return true;
};

/**
 * 登录
 */
export const login = (password: string): boolean => {
  if (!verifyPassword(password)) {
    return false;
  }
  
  if (typeof window === 'undefined') return false;
  
  // 创建 token，有效期 24 小时
  const tokenData = {
    token: generateToken(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24小时后过期
  };
  
  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(tokenData));
  return true;
};

/**
 * 登出
 */
export const logout = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * 生成随机 token
 */
function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * 修改管理员密码
 */
export const changePassword = (oldPassword: string, newPassword: string): { success: boolean; message: string } => {
  if (!verifyPassword(oldPassword)) {
    return { success: false, message: '旧密码错误' };
  }
  
  if (newPassword.length < 6) {
    return { success: false, message: '新密码至少 6 个字符' };
  }
  
  setAdminPassword(newPassword);
  
  // 修改密码后需要重新登录
  logout();
  
  return { success: true, message: '密码修改成功，请重新登录' };
};
