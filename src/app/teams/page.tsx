'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, Calendar, Trophy, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { storage, generateId } from '@/lib/storage';
import { Team, Match, Player } from '@/types';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTeam, setNewTeam] = useState({
    name: '',
    color: '#3b82f6',
    foundedYear: new Date().getFullYear().toString(),
    coach: '',
  });

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = () => {
    const loadedTeams = storage.getTeams();
    setTeams(loadedTeams);
  };

  const handleAddTeam = () => {
    if (!newTeam.name.trim()) return;

    const team: Team = {
      id: generateId(),
      name: newTeam.name,
      color: newTeam.color,
      foundedYear: parseInt(newTeam.foundedYear),
      coach: newTeam.coach || undefined,
      createdAt: Date.now(),
    };

    storage.addTeam(team);
    setTeams([...teams, team]);
    setIsAddDialogOpen(false);
    setNewTeam({
      name: '',
      color: '#3b82f6',
      foundedYear: new Date().getFullYear().toString(),
      coach: '',
    });
  };

  const handleDeleteTeam = (teamId: string) => {
    if (confirm('确定要删除这个球队吗？这将同时删除该球队的所有球员和比赛数据。')) {
      storage.deleteTeam(teamId);
      setTeams(teams.filter(t => t.id !== teamId));
    }
  };

  const getTeamStats = (teamId: string) => {
    const matches = storage.getMatchesByTeam(teamId);
    const players = storage.getPlayersByTeam(teamId);
    const completedMatches = matches.filter(m => m.status === 'completed');
    
    const wins = completedMatches.filter(m => {
      const teamScore = m.score.home;
      const opponentScore = m.score.away;
      return teamScore > opponentScore;
    }).length;
    
    const draws = completedMatches.filter(m => {
      return m.score.home === m.score.away;
    }).length;
    
    const losses = completedMatches.filter(m => {
      return m.score.home < m.score.away;
    }).length;
    
    const goalsFor = completedMatches.reduce((sum, m) => sum + m.score.home, 0);
    const goalsAgainst = completedMatches.reduce((sum, m) => sum + m.score.away, 0);
    
    const cleanSheets = completedMatches.filter(m => m.score.away === 0).length;

    return {
      players: players.length,
      matches: completedMatches.length,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      cleanSheets,
      winRate: completedMatches.length > 0 
        ? Math.round((wins / completedMatches.length) * 100) 
        : 0,
    };
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (team.coach && team.coach.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pb-20 md:pb-0 pt-16 md:pt-16">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-2">
            🏆 球队管理
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            管理所有球队信息
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索球队..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                添加球队
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>创建新球队</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">球队名称 *</Label>
                  <Input
                    id="team-name"
                    placeholder="例如：曼联"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-color">球队颜色</Label>
                  <div className="flex gap-2">
                    <Input
                      id="team-color"
                      type="color"
                      value={newTeam.color}
                      onChange={(e) => setNewTeam({ ...newTeam, color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={newTeam.color}
                      onChange={(e) => setNewTeam({ ...newTeam, color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founded-year">成立年份</Label>
                  <Input
                    id="founded-year"
                    type="number"
                    value={newTeam.foundedYear}
                    onChange={(e) => setNewTeam({ ...newTeam, foundedYear: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coach">主教练</Label>
                  <Input
                    id="coach"
                    placeholder="可选"
                    value={newTeam.coach}
                    onChange={(e) => setNewTeam({ ...newTeam, coach: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddTeam} className="w-full">
                  创建球队
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Teams List */}
        {filteredTeams.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Trophy className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                {searchQuery ? '未找到匹配的球队' : '暂无球队'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center max-w-md mb-4">
                {searchQuery ? '尝试使用其他关键词搜索' : '创建你的第一个球队'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredTeams.map((team) => {
              const stats = getTeamStats(team.id);
              return (
                <Card key={team.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3" style={{ backgroundColor: `${team.color}15` }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {team.coach && `主教练：${team.coach}`}
                          {team.coach && team.foundedYear && ' · '}
                          {team.foundedYear}年成立
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteTeam(team.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: team.color }}>
                          {stats.players}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">球员</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: team.color }}>
                          {stats.matches}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">比赛</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: team.color }}>
                          {stats.winRate}%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">胜率</div>
                      </div>
                    </div>
                    <div className="space-y-2 border-t pt-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex gap-3">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span>胜 {stats.wins}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            <span>平 {stats.draws}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span>负 {stats.losses}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-2">
                        <span className="text-muted-foreground">进球 / 失球 / 零封</span>
                        <span className="font-semibold" style={{ color: team.color }}>
                          {stats.goalsFor} / {stats.goalsAgainst} / {stats.cleanSheets}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
