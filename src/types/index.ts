// 足球队数据统计应用类型定义

export const POSITION_LABELS: Record<PlayerPosition, string> = {
  goalkeeper: '门将',
  defender: '后卫',
  midfielder: '中场',
  forward: '前锋',
};

export const MATCH_TYPE_LABELS: Record<MatchType, string> = {
  friendly: '友谊赛',
  internal: '对内赛',
  cup: '杯赛',
};

export interface Team {
  id: string;
  name: string;
  logo?: string;
  color: string;
  foundedYear: number;
  coach?: string;
  createdAt: number;
}

export interface Player {
  id: string;
  teamId: string;
  name: string;
  number: number;
  position: PlayerPosition; // 单个位置
  birthday: string; // 生日 YYYY-MM-DD
  height?: number;
  weight?: number;
  isCaptain?: boolean;
  photo?: string;
  createdAt: number;
}

export type PlayerPosition = 'goalkeeper' | 'defender' | 'midfielder' | 'forward';

export type MatchType = 'friendly' | 'internal' | 'cup';

export interface Match {
  id: string;
  teamId: string;
  opponent: string;
  date: string;
  matchType: MatchType; // 比赛性质
  isHome: boolean;
  score: {
    home: number;
    away: number;
  };
  location?: string;
  status: MatchStatus;
  playerStats: PlayerMatchStats[];
  createdAt: number;
}

export type MatchStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';

export interface PlayerMatchStats {
  playerId: string;
  playerName: string;
  playerNumber: number;
  position: PlayerPosition;
  isPlayed: boolean; // 是否上场
  goals: number;
  assists: number;
  createdAt: number;
}

export interface Season {
  id: string;
  teamId: string;
  name: string;
  startDate: string;
  endDate: string;
  matches: Match[];
}

export interface PlayerSeasonStats {
  playerId: string;
  playerName: string;
  playerNumber: number;
  position: PlayerPosition;
  matchesPlayed: number;
  goals: number;
  assists: number;
  avgRating: number;
}

export interface TeamSeasonStats {
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  cleanSheets: number;
}

