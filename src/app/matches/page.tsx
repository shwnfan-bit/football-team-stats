'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, Trophy, Trash2, Edit2, Home, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { storage, generateId } from '@/lib/storage';
import { Match, MatchStatus, Team, Player, PlayerMatchStats } from '@/types';

const statusLabels: Record<MatchStatus, string> = {
  'scheduled': '未开始',
  'in-progress': '进行中',
  'completed': '已结束',
  'cancelled': '已取消',
};

const statusColors: Record<MatchStatus, string> = {
  'scheduled': 'bg-slate-500',
  'in-progress': 'bg-green-500',
  'completed': 'bg-blue-500',
  'cancelled': 'bg-red-500',
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [newMatch, setNewMatch] = useState({
    teamId: '',
    opponent: '',
    date: '',
    isHome: true,
    location: '',
    status: 'scheduled' as MatchStatus,
    homeScore: '0',
    awayScore: '0',
  });

  useEffect(() => {
    loadMatches();
    loadTeams();
  }, []);

  const loadMatches = () => {
    const loadedMatches = storage.getMatches();
    setMatches(loadedMatches);
  };

  const loadTeams = () => {
    const loadedTeams = storage.getTeams();
    setTeams(loadedTeams);
    if (loadedTeams.length > 0 && !newMatch.teamId) {
      setNewMatch({ ...newMatch, teamId: loadedTeams[0].id });
    }
  };

  const handleAddMatch = () => {
    if (!newMatch.teamId || !newMatch.opponent || !newMatch.date) return;

    const match: Match = {
      id: generateId(),
      teamId: newMatch.teamId,
      opponent: newMatch.opponent,
      date: newMatch.date,
      isHome: newMatch.isHome,
      location: newMatch.location || undefined,
      status: newMatch.status,
      score: {
        home: parseInt(newMatch.homeScore),
        away: parseInt(newMatch.awayScore),
      },
      playerStats: [],
      createdAt: Date.now(),
    };

    storage.addMatch(match);
    setMatches([...matches, match]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewMatch({
      teamId: teams[0]?.id || '',
      opponent: '',
      date: '',
      isHome: true,
      location: '',
      status: 'scheduled',
      homeScore: '0',
      awayScore: '0',
    });
  };

  const handleDeleteMatch = (matchId: string) => {
    if (confirm('确定要删除这场比赛吗？')) {
      storage.deleteMatch(matchId);
      setMatches(matches.filter(m => m.id !== matchId));
    }
  };

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team?.name || '未知球队';
  };

  const getTeamColor = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team?.color || '#3b82f6';
  };

  const filteredMatches = selectedTeam === 'all' 
    ? matches 
    : matches.filter(m => m.teamId === selectedTeam);

  const sortedMatches = [...filteredMatches].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const matchesByStatus = {
    'in-progress': sortedMatches.filter(m => m.status === 'in-progress'),
    'completed': sortedMatches.filter(m => m.status === 'completed'),
    'scheduled': sortedMatches.filter(m => m.status === 'scheduled'),
    'cancelled': sortedMatches.filter(m => m.status === 'cancelled'),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pb-20 md:pb-0 pt-16 md:pt-16">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-2">
            📊 比赛管理
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            记录和管理比赛数据
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="sm:w-[200px]">
              <SelectValue placeholder="选择球队" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部球队</SelectItem>
              {teams.map(team => (
                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                添加比赛
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>添加新比赛</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="match-team">球队 *</Label>
                  <Select 
                    value={newMatch.teamId} 
                    onValueChange={(value) => setNewMatch({ ...newMatch, teamId: value })}
                  >
                    <SelectTrigger id="match-team">
                      <SelectValue placeholder="选择球队" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map(team => (
                        <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="match-opponent">对手 *</Label>
                  <Input
                    id="match-opponent"
                    placeholder="例如：切尔西"
                    value={newMatch.opponent}
                    onChange={(e) => setNewMatch({ ...newMatch, opponent: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="match-date">比赛日期 *</Label>
                  <Input
                    id="match-date"
                    type="date"
                    value={newMatch.date}
                    onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="match-location">比赛地点</Label>
                  <Input
                    id="match-location"
                    placeholder="例如：老特拉福德"
                    value={newMatch.location}
                    onChange={(e) => setNewMatch({ ...newMatch, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="match-status">比赛状态</Label>
                  <Select 
                    value={newMatch.status} 
                    onValueChange={(value: MatchStatus) => setNewMatch({ ...newMatch, status: value })}
                  >
                    <SelectTrigger id="match-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>比赛类型</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="home"
                        checked={newMatch.isHome}
                        onChange={() => setNewMatch({ ...newMatch, isHome: true })}
                      />
                      <Label htmlFor="home" className="cursor-pointer">主场比赛</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="away"
                        checked={!newMatch.isHome}
                        onChange={() => setNewMatch({ ...newMatch, isHome: false })}
                      />
                      <Label htmlFor="away" className="cursor-pointer">客场比赛</Label>
                    </div>
                  </div>
                </div>
                {(newMatch.status === 'completed' || newMatch.status === 'in-progress') && (
                  <div className="space-y-2">
                    <Label>比赛比分</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Input
                          type="number"
                          placeholder="主队进球"
                          value={newMatch.homeScore}
                          onChange={(e) => setNewMatch({ ...newMatch, homeScore: e.target.value })}
                        />
                      </div>
                      <span className="text-muted-foreground">:</span>
                      <div className="flex-1">
                        <Input
                          type="number"
                          placeholder="客队进球"
                          value={newMatch.awayScore}
                          onChange={(e) => setNewMatch({ ...newMatch, awayScore: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <Button onClick={handleAddMatch} className="w-full">
                  添加比赛
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Matches List */}
        {sortedMatches.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                暂无比赛记录
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center max-w-md mb-4">
                {teams.length === 0 
                  ? '请先创建球队，然后添加比赛'
                  : '点击添加按钮记录第一场比赛'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="all">全部 ({sortedMatches.length})</TabsTrigger>
              <TabsTrigger value="in-progress">进行中 ({matchesByStatus['in-progress'].length})</TabsTrigger>
              <TabsTrigger value="completed">已结束 ({matchesByStatus['completed'].length})</TabsTrigger>
              <TabsTrigger value="scheduled">未开始 ({matchesByStatus['scheduled'].length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <MatchList 
                matches={sortedMatches} 
                teams={teams} 
                getTeamName={getTeamName}
                getTeamColor={getTeamColor}
                handleDeleteMatch={handleDeleteMatch}
                statusLabels={statusLabels}
                statusColors={statusColors}
              />
            </TabsContent>

            <TabsContent value="in-progress" className="space-y-4">
              <MatchList 
                matches={matchesByStatus['in-progress']} 
                teams={teams} 
                getTeamName={getTeamName}
                getTeamColor={getTeamColor}
                handleDeleteMatch={handleDeleteMatch}
                statusLabels={statusLabels}
                statusColors={statusColors}
              />
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <MatchList 
                matches={matchesByStatus['completed']} 
                teams={teams} 
                getTeamName={getTeamName}
                getTeamColor={getTeamColor}
                handleDeleteMatch={handleDeleteMatch}
                statusLabels={statusLabels}
                statusColors={statusColors}
              />
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-4">
              <MatchList 
                matches={matchesByStatus['scheduled']} 
                teams={teams} 
                getTeamName={getTeamName}
                getTeamColor={getTeamColor}
                handleDeleteMatch={handleDeleteMatch}
                statusLabels={statusLabels}
                statusColors={statusColors}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

function MatchList({ matches, teams, getTeamName, getTeamColor, handleDeleteMatch, statusLabels, statusColors }: any) {
  if (matches.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">暂无比赛记录</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match: Match) => {
        const teamColor = getTeamColor(match.teamId);
        const teamName = getTeamName(match.teamId);
        
        return (
          <Card key={match.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0">
                    {match.isHome ? (
                      <Home className="h-5 w-5 text-slate-500" />
                    ) : (
                      <Plane className="h-5 w-5 text-slate-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{teamName}</h3>
                      <span className="text-muted-foreground">vs</span>
                      <h3 className="font-semibold truncate">{match.opponent}</h3>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(match.date).toLocaleDateString('zh-CN')}</span>
                      </div>
                      {match.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{match.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {(match.status === 'completed' || match.status === 'in-progress') && (
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: teamColor }}>
                        {match.score.home} - {match.score.away}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Badge className={`${statusColors[match.status]} text-white`}>
                      {statusLabels[match.status]}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteMatch(match.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
