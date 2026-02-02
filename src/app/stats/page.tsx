'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, Users, Target, TrendingUp, Trophy, BarChart3, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { storage, generateId } from '@/lib/storage';
import { initializeChengduDadieTeam, getChengduDadieTeamId } from '@/lib/team';
import { Match, Player, MatchType, MATCH_TYPE_LABELS, PlayerMatchStats, PlayerSeasonStats, POSITION_LABELS } from '@/types';

export default function StatsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerSeasonStats[]>([]);
  const [isAddMatchOpen, setIsAddMatchOpen] = useState(false);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  
  // 比赛表单状态
  const [matchForm, setMatchForm] = useState({
    opponent: '',
    date: '',
    matchType: 'friendly' as MatchType,
    homeScore: '',
    awayScore: '',
    playerStats: [] as PlayerMatchStats[],
  });

  useEffect(() => {
    initializeChengduDadieTeam();
    loadData();
  }, []);

  const loadData = () => {
    const teamId = getChengduDadieTeamId();
    const loadedMatches = storage.getMatchesByTeam(teamId);
    const loadedPlayers = storage.getPlayersByTeam(teamId);
    
    // 兼容新旧数据格式
    const validPlayers = loadedPlayers.map(p => {
      if (p && (p as any).positions) {
        const oldPlayer = p as any;
        return {
          ...p,
          position: oldPlayer.positions[0] || 'midfielder',
        } as Player;
      }
      return p;
    }).filter(p => p && p.birthday);
    
    setMatches(loadedMatches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setPlayers(validPlayers);
    calculateStats(loadedMatches, validPlayers);
  };

  const calculateStats = (matchesData: Match[], playersData: Player[]) => {
    const completedMatches = matchesData.filter(m => m.status === 'completed');

    // 计算球员统计
    const stats: PlayerSeasonStats[] = playersData.map(player => {
      let goals = 0;
      let assists = 0;
      let matchesPlayed = 0;

      completedMatches.forEach(match => {
        const playerStat = match.playerStats.find(ps => ps.playerId === player.id);
        if (playerStat) {
          if (playerStat.isPlayed) {
            matchesPlayed++;
          }
          goals += playerStat.goals;
          assists += playerStat.assists;
        }
      });

      return {
        playerId: player.id,
        playerName: player.name,
        playerNumber: player.number,
        position: player.position,
        matchesPlayed,
        goals,
        assists,
        avgRating: matchesPlayed > 0 ? parseFloat(((goals * 10 + assists * 8) / matchesPlayed).toFixed(1)) : 0,
      };
    });

    setPlayerStats(stats);
  };

  const resetMatchForm = () => {
    setMatchForm({
      opponent: '',
      date: '',
      matchType: 'friendly',
      homeScore: '',
      awayScore: '',
      playerStats: [],
    });
  };

  const handleOpenAddMatch = () => {
    resetMatchForm();
    setIsAddMatchOpen(true);
  };

  const handleEditMatch = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (match) {
      setMatchForm({
        opponent: match.opponent,
        date: match.date,
        matchType: match.matchType,
        homeScore: match.score.home.toString(),
        awayScore: match.score.away.toString(),
        playerStats: match.playerStats,
      });
      setEditingMatchId(matchId);
      setIsAddMatchOpen(true);
    }
  };

  const handlePlayerStatChange = (playerId: string, field: 'isPlayed' | 'goals' | 'assists', value: boolean | number) => {
    setMatchForm(prev => {
      const existingIndex = prev.playerStats.findIndex(ps => ps.playerId === playerId);
      const player = players.find(p => p.id === playerId);
      
      if (!player) return prev;

      const newStat: PlayerMatchStats = {
        playerId: player.id,
        playerName: player.name,
        playerNumber: player.number,
        position: player.position,
        isPlayed: field === 'isPlayed' ? value as boolean : prev.playerStats[existingIndex]?.isPlayed || false,
        goals: field === 'goals' ? value as number : prev.playerStats[existingIndex]?.goals || 0,
        assists: field === 'assists' ? value as number : prev.playerStats[existingIndex]?.assists || 0,
        createdAt: Date.now(),
      };

      const newPlayerStats = [...prev.playerStats];
      if (existingIndex >= 0) {
        newPlayerStats[existingIndex] = newStat;
      } else {
        newPlayerStats.push(newStat);
      }

      return { ...prev, playerStats: newPlayerStats };
    });
  };

  const handleSaveMatch = () => {
    if (!matchForm.opponent || !matchForm.date || matchForm.homeScore === '' || matchForm.awayScore === '') {
      alert('请填写完整的比赛信息');
      return;
    }

    try {
      const teamId = getChengduDadieTeamId();
      const match: Match = {
        id: editingMatchId || generateId(),
        teamId,
        opponent: matchForm.opponent,
        date: matchForm.date,
        matchType: matchForm.matchType,
        isHome: true,
        score: {
          home: parseInt(matchForm.homeScore),
          away: parseInt(matchForm.awayScore),
        },
        status: 'completed',
        playerStats: matchForm.playerStats,
        createdAt: Date.now(),
      };

      if (editingMatchId) {
        storage.updateMatch(editingMatchId, match);
      } else {
        storage.addMatch(match);
      }

      setIsAddMatchOpen(false);
      setEditingMatchId(null);
      resetMatchForm();
      loadData();
    } catch (error) {
      console.error('保存比赛失败:', error);
      alert('保存比赛失败');
    }
  };

  const handleDeleteMatch = (matchId: string) => {
    if (confirm('确定要删除这场比赛吗？')) {
      try {
        storage.deleteMatch(matchId);
        loadData();
      } catch (error) {
        console.error('删除比赛失败:', error);
        alert('删除比赛失败');
      }
    }
  };

  const topScorers = [...playerStats].sort((a, b) => b.goals - a.goals).slice(0, 5);
  const topAssists = [...playerStats].sort((a, b) => b.assists - a.assists).slice(0, 5);

  // 统计数据
  const totalMatches = matches.filter(m => m.status === 'completed').length;
  const wins = matches.filter(m => m.status === 'completed' && m.score.home > m.score.away).length;
  const draws = matches.filter(m => m.status === 'completed' && m.score.home === m.score.away).length;
  const losses = matches.filter(m => m.status === 'completed' && m.score.home < m.score.away).length;
  const totalGoals = matches.filter(m => m.status === 'completed').reduce((sum, m) => sum + m.score.home, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 pt-16 md:pt-16">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">比赛统计</h1>
            <p className="text-gray-600">成都老爹队比赛记录与数据分析</p>
          </div>
          
          <Dialog open={isAddMatchOpen} onOpenChange={(open) => {
            setIsAddMatchOpen(open);
            if (!open) {
              setEditingMatchId(null);
              resetMatchForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenAddMatch} className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                <Plus className="w-5 h-5" />
                录入比赛
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingMatchId ? '编辑比赛' : '录入比赛'}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* 比赛基本信息 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="match-opponent">对手 *</Label>
                    <Input
                      id="match-opponent"
                      value={matchForm.opponent}
                      onChange={(e) => setMatchForm({ ...matchForm, opponent: e.target.value })}
                      placeholder="请输入对手名称"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="match-date">比赛日期 *</Label>
                    <Input
                      id="match-date"
                      type="date"
                      value={matchForm.date}
                      onChange={(e) => setMatchForm({ ...matchForm, date: e.target.value })}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="match-type">比赛性质 *</Label>
                    <Select
                      value={matchForm.matchType}
                      onValueChange={(value: MatchType) => setMatchForm({ ...matchForm, matchType: value })}
                    >
                      <SelectTrigger id="match-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(MATCH_TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="home-score">我方进球 *</Label>
                      <Input
                        id="home-score"
                        type="number"
                        min="0"
                        value={matchForm.homeScore}
                        onChange={(e) => setMatchForm({ ...matchForm, homeScore: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="away-score">对方进球 *</Label>
                      <Input
                        id="away-score"
                        type="number"
                        min="0"
                        value={matchForm.awayScore}
                        onChange={(e) => setMatchForm({ ...matchForm, awayScore: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* 球员数据录入 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <Label className="text-lg font-semibold">球员数据</Label>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium">号码</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">姓名</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">上场</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">进球</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">助攻</th>
                        </tr>
                      </thead>
                      <tbody>
                        {players.map((player) => {
                          const playerStat = matchForm.playerStats.find(ps => ps.playerId === player.id) || {
                            playerId: player.id,
                            playerName: player.name,
                            playerNumber: player.number,
                            position: player.position,
                            isPlayed: false,
                            goals: 0,
                            assists: 0,
                            createdAt: Date.now(),
                          };
                          
                          return (
                            <tr key={player.id} className="border-t hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium">{player.number}</td>
                              <td className="px-4 py-3">{player.name}</td>
                              <td className="px-4 py-3 text-center">
                                <Checkbox
                                  checked={playerStat.isPlayed}
                                  onCheckedChange={(checked) => handlePlayerStatChange(player.id, 'isPlayed', checked as boolean)}
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Input
                                  type="number"
                                  min="0"
                                  max="10"
                                  className="w-16 text-center"
                                  value={playerStat.goals}
                                  onChange={(e) => handlePlayerStatChange(player.id, 'goals', parseInt(e.target.value) || 0)}
                                  disabled={!playerStat.isPlayed}
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Input
                                  type="number"
                                  min="0"
                                  max="10"
                                  className="w-16 text-center"
                                  value={playerStat.assists}
                                  onChange={(e) => handlePlayerStatChange(player.id, 'assists', parseInt(e.target.value) || 0)}
                                  disabled={!playerStat.isPlayed}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddMatchOpen(false);
                    setEditingMatchId(null);
                    resetMatchForm();
                  }}
                >
                  取消
                </Button>
                <Button onClick={handleSaveMatch} className="bg-red-600 hover:bg-red-700">
                  {editingMatchId ? '保存修改' : '保存比赛'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Target className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{totalMatches}</p>
                <p className="text-sm text-gray-600">总场次</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Trophy className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{wins}</p>
                <p className="text-sm text-gray-600">胜场</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{totalGoals}</p>
                <p className="text-sm text-gray-600">总进球</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{players.length}</p>
                <p className="text-sm text-gray-600">球员数</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="matches" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="matches">比赛记录</TabsTrigger>
            <TabsTrigger value="scorers">射手榜</TabsTrigger>
            <TabsTrigger value="assists">助攻榜</TabsTrigger>
          </TabsList>

          {/* 比赛记录 */}
          <TabsContent value="matches" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  比赛历史
                </CardTitle>
              </CardHeader>
              <CardContent>
                {matches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    暂无比赛记录，点击上方按钮录入比赛
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matches.map((match) => (
                      <div key={match.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">{match.date}</p>
                            <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                              {MATCH_TYPE_LABELS[match.matchType]}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              成都老爹队 {match.score.home} - {match.score.away} {match.opponent}
                            </p>
                            <p className="text-sm text-gray-600">
                              {match.score.home > match.score.away ? '胜利' : match.score.home < match.score.away ? '失败' : '平局'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditMatch(match.id)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMatch(match.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 射手榜 */}
          <TabsContent value="scorers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  射手榜
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topScorers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    暂无数据
                  </div>
                ) : (
                  <div className="space-y-3">
                    {topScorers.map((player, index) => (
                      <div key={player.playerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                            index === 0 ? 'bg-yellow-400 text-white' :
                            index === 1 ? 'bg-gray-300 text-gray-700' :
                            index === 2 ? 'bg-orange-400 text-white' :
                            'bg-gray-200 text-gray-700'
                          }`}>
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-gray-900">{player.playerName}</p>
                            <p className="text-sm text-gray-600">
                              #{player.playerNumber} · {POSITION_LABELS[player.position]}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-red-600">{player.goals}</p>
                          <p className="text-xs text-gray-600">进球</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 助攻榜 */}
          <TabsContent value="assists" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  助攻榜
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topAssists.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    暂无数据
                  </div>
                ) : (
                  <div className="space-y-3">
                    {topAssists.map((player, index) => (
                      <div key={player.playerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                            index === 0 ? 'bg-yellow-400 text-white' :
                            index === 1 ? 'bg-gray-300 text-gray-700' :
                            index === 2 ? 'bg-orange-400 text-white' :
                            'bg-gray-200 text-gray-700'
                          }`}>
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-gray-900">{player.playerName}</p>
                            <p className="text-sm text-gray-600">
                              #{player.playerNumber} · {POSITION_LABELS[player.position]}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-red-600">{player.assists}</p>
                          <p className="text-xs text-gray-600">助攻</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
