// 足球队数据统计应用类型定义
// 注意：此文件中的类型已迁移至数据库 schema (src/storage/database/shared/schema.ts)
// 为了向后兼容，此处重新导出数据库类型

import type {
  Team,
  Player,
  Season,
  MatchPlayerStat,
  InsertTeam,
  UpdateTeam,
  InsertPlayer,
  UpdatePlayer,
  InsertMatch,
  UpdateMatch,
  InsertSeason,
  UpdateSeason,
  InsertMatchPlayerStat,
  UpdateMatchPlayerStat,
} from '@/storage/database/shared/schema';

export type {
  Team,
  Player,
  Season,
  MatchPlayerStat,
  InsertTeam,
  UpdateTeam,
  InsertPlayer,
  UpdatePlayer,
  InsertMatch,
  UpdateMatch,
  InsertSeason,
  UpdateSeason,
  InsertMatchPlayerStat,
  UpdateMatchPlayerStat,
} from '@/storage/database/shared/schema';

// 数据库的 Match 类型（不包含 playerStats）
export type DatabaseMatch = typeof import('@/storage/database/shared/schema').matches.$inferSelect;

// 前端扩展的 Match 类型，包含 playerStats
export interface Match extends DatabaseMatch {
  playerStats: MatchPlayerStat[];
}

// 位置标签
export const POSITION_LABELS: Record<PlayerPosition, string> = {
  goalkeeper: '门将',
  defender: '后卫',
  midfielder: '中场',
  forward: '前锋',
};

export type PlayerPosition = 'goalkeeper' | 'defender' | 'midfielder' | 'forward';

// 球员赛季统计类型
export interface PlayerSeasonStats {
  playerId: string;
  playerName: string;
  playerNumber: number;
  position: string;
  matchesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  avgRating: number;
  minutesPlayed: number;
}
