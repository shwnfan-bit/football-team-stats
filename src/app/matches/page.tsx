'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Home, Plane, Trophy, Target, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { storage } from '@/lib/storage';
import { initializeChengduDadieTeam, getChengduDadieTeamId } from '@/lib/team';
import { Match } from '@/types';

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  useEffect(() => {
    initializeChengduDadieTeam();
    loadMatches();
  }, []);

  const loadMatches = () => {
    try {
      const teamId = getChengduDadieTeamId();
      const loadedMatches = storage.getMatchesByTeam(teamId);
      // 按日期降序排列（最新的在前）
      const sortedMatches = loadedMatches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setMatches(sortedMatches);
    } catch (error) {
      console.error('加载比赛数据失败:', error);
      setMatches([]);
    }
  };

  const getMatchTypeLabel = (matchType: 'home' | 'away') => {
    return matchType === 'home' ? '主场' : '客场';
  };

  const getMatchTypeColor = (matchType: 'home' | 'away') => {
    return matchType === 'home' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  };

  const getMatchNatureLabel = (nature: 'friendly' | 'internal' | 'cup' | 'league') => {
    const labels = {
      friendly: '友谊赛',
      internal: '队内赛',
      cup: '杯赛',
      league: '联赛',
    };
    return labels[nature];
  };

  const getMatchNatureColor = (nature: 'friendly' | 'internal' | 'cup' | 'league') => {
    const colors = {
      friendly: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
      internal: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      cup: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      league: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[nature];
  };

  const getMatchResult = (match: Match) => {
    if (match.score.home > match.score.away) {
      return { text: '胜', color: 'bg-green-600' };
    } else if (match.score.home < match.score.away) {
      return { text: '负', color: 'bg-red-600' };
    } else {
      return { text: '平', color: 'bg-yellow-600' };
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pb-20 md:pb-0 pt-16 md:pt-16">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-2">
            比赛记录
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            成都老爹队 - 比赛历史数据
          </p>
        </div>

        {/* 比赛列表 */}
        {matches.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">还没有比赛记录</p>
              <p className="text-slate-500 dark:text-slate-500">
                请在"统计"页面录入比赛数据
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => {
              const result = getMatchResult(match);
              const isExpanded = expandedMatchId === match.id;

              return (
                <Card key={match.id} className="overflow-hidden">
                  {/* 比赛基本信息 */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => setExpandedMatchId(isExpanded ? null : match.id)}
                  >
                    <div className="flex items-center justify-between">
                      {/* 左侧：比分和结果 */}
                      <div className="flex items-center gap-3">
                        {/* 结果徽章 */}
                        <div className={`${result.color} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                          {result.text}
                        </div>
                        
                        {/* 比分 */}
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-red-700 dark:text-red-400">
                            {match.score.home}
                          </span>
                          <span className="text-slate-400">:</span>
                          <span className="text-2xl font-bold">
                            {match.score.away}
                          </span>
                        </div>
                      </div>

                      {/* 中间：对手信息 */}
                      <div className="flex-1 text-center">
                        <div className="text-lg font-bold">{match.opponent}</div>
                        <div className="text-sm text-slate-500">{formatDate(match.date)}</div>
                      </div>

                      {/* 右侧：比赛类型 */}
                      <div className="flex items-center gap-2">
                        <Badge className={getMatchTypeColor(match.matchType)}>
                          {match.matchType === 'home' ? (
                            <Home className="w-3 h-3 mr-1" />
                          ) : (
                            <Plane className="w-3 h-3 mr-1" />
                          )}
                          {getMatchTypeLabel(match.matchType)}
                        </Badge>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* 第二行：比赛性质和地点 */}
                    <div className="mt-3 flex items-center justify-center gap-4 text-sm">
                      <Badge className={getMatchNatureColor(match.matchNature)}>
                        <Trophy className="w-3 h-3 mr-1" />
                        {getMatchNatureLabel(match.matchNature)}
                      </Badge>
                      {match.location && (
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <MapPin className="w-4 h-4" />
                          {match.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 展开的详细信息 */}
                  {isExpanded && (
                    <div className="border-t p-4 bg-slate-50 dark:bg-slate-800/50">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-red-600 dark:text-red-400" />
                        球员数据
                      </h3>
                      
                      {match.playerStats.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-4">暂无球员数据</p>
                      ) : (
                        <div className="grid gap-2">
                          {match.playerStats
                            .filter(ps => ps.isPlaying && (ps.goals > 0 || ps.assists > 0))
                            .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
                            .map((ps) => (
                              <div
                                key={ps.playerId}
                                className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg border"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">#{ps.playerNumber}</span>
                                  <span>{ps.playerName}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  {ps.goals > 0 && (
                                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                      <Target className="w-4 h-4" />
                                      <span className="font-bold">{ps.goals}</span>
                                    </div>
                                  )}
                                  {ps.assists > 0 && (
                                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                      <Award className="w-4 h-4" />
                                      <span className="font-bold">{ps.assists}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          
                          {match.playerStats.filter(ps => ps.isPlaying).length === 0 && (
                            <p className="text-sm text-slate-500 text-center py-4">
                              没有球员上场
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
