import { Team, storage, generateId } from './storage';

const CHENGDU_DADIE_TEAM_NAME = '成都老爹队';

// 球队缓存 ID
let chengduDadieTeamIdCache: string | null = null;

// 成都老爹队数据（用于创建）
const CHENGDU_DADIE_TEAM_DATA = {
  name: CHENGDU_DADIE_TEAM_NAME,
  logo: undefined,
  color: '#e53935', // 红色
  foundedYear: 2024,
  coach: '',
};

// 初始化成都老爹队
export const initializeChengduDadieTeam = async (): Promise<string> => {
  // 如果已经缓存了 ID，直接返回
  if (chengduDadieTeamIdCache) {
    return chengduDadieTeamIdCache;
  }

  // 查询球队是否存在
  const teams = await storage.getTeams();
  const existingTeam = teams.find(t => t.name === CHENGDU_DADIE_TEAM_NAME);

  if (existingTeam) {
    chengduDadieTeamIdCache = existingTeam.id;
    return existingTeam.id;
  }

  // 创建球队（只传递 InsertTeam 需要的字段）
  const newTeam = await storage.addTeam(CHENGDU_DADIE_TEAM_DATA);
  chengduDadieTeamIdCache = newTeam.id;
  
  console.log('成都老爹队已创建，ID:', newTeam.id);
  return newTeam.id;
};

// 获取成都老爹队 ID
export const getChengduDadieTeamId = (): string => {
  if (!chengduDadieTeamIdCache) {
    throw new Error('成都老爹队尚未初始化，请先调用 initializeChengduDadieTeam()');
  }
  return chengduDadieTeamIdCache;
};

// 计算年龄
export const calculateAge = (birthday: string): number => {
  if (!birthday) return 0;
  
  try {
    const today = new Date();
    const birthDate = new Date(birthday);
    
    if (isNaN(birthDate.getTime())) {
      console.error('无效的生日格式:', birthday);
      return 0;
    }
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error('计算年龄时出错:', error);
    return 0;
  }
};
