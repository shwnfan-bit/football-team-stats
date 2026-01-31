'use client';

import { useState, useEffect } from 'react';
import { Plus, Users, TrendingUp, Calendar, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { storage, generateId } from '@/lib/storage';
import { Team, Match, Player } from '@/types';

export default function HomePage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
      return m.isHome ? teamScore > opponentScore : teamScore > opponentScore;
    }).length;
    
    const goals = completedMatches.reduce((sum, m) => sum + m.score.home, 0);
    
    return {
      players: players.length,
      matches: completedMatches.length,
      wins,
      goals,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pb-20 md:pb-0">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 pt-16 md:pt-0">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                ⚽ 足球队管理
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                数据统计与分析
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {teams.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                暂无球队
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center max-w-md mb-4">
                创建你的第一个球队，开始管理球员和比赛数据
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                添加球队
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => {
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteTeam(team.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除球队
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-3 gap-4">
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
                          {stats.wins}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">胜利</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">总进球</span>
                        <span className="font-semibold" style={{ color: team.color }}>
                          {stats.goals}
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
