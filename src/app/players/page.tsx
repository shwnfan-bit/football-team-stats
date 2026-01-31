'use client';

import { useState, useEffect } from 'react';
import { Plus, UserPlus, Trash2, Edit2, Shield, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { storage, generateId } from '@/lib/storage';
import { Player, PlayerPosition, Team } from '@/types';

const positionLabels: Record<PlayerPosition, string> = {
  goalkeeper: '门将',
  defender: '后卫',
  midfielder: '中场',
  forward: '前锋',
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [newPlayer, setNewPlayer] = useState({
    teamId: '',
    name: '',
    number: '',
    position: 'midfielder' as PlayerPosition,
    age: '',
    height: '',
    weight: '',
    nationality: '',
    isCaptain: false,
  });

  useEffect(() => {
    loadPlayers();
    loadTeams();
  }, []);

  const loadPlayers = () => {
    const loadedPlayers = storage.getPlayers();
    setPlayers(loadedPlayers);
  };

  const loadTeams = () => {
    const loadedTeams = storage.getTeams();
    setTeams(loadedTeams);
    if (loadedTeams.length > 0 && !newPlayer.teamId) {
      setNewPlayer({ ...newPlayer, teamId: loadedTeams[0].id });
    }
  };

  const handleAddPlayer = () => {
    if (!newPlayer.name.trim() || !newPlayer.number || !newPlayer.teamId) return;

    const player: Player = {
      id: generateId(),
      teamId: newPlayer.teamId,
      name: newPlayer.name,
      number: parseInt(newPlayer.number),
      position: newPlayer.position,
      age: newPlayer.age ? parseInt(newPlayer.age) : undefined,
      height: newPlayer.height ? parseInt(newPlayer.height) : undefined,
      weight: newPlayer.weight ? parseInt(newPlayer.weight) : undefined,
      nationality: newPlayer.nationality || undefined,
      isCaptain: newPlayer.isCaptain,
      createdAt: Date.now(),
    };

    storage.addPlayer(player);
    setPlayers([...players, player]);
    setIsAddDialogOpen(false);
    setNewPlayer({
      teamId: teams[0]?.id || '',
      name: '',
      number: '',
      position: 'midfielder',
      age: '',
      height: '',
      weight: '',
      nationality: '',
      isCaptain: false,
    });
  };

  const handleDeletePlayer = (playerId: string) => {
    if (confirm('确定要删除这个球员吗？')) {
      storage.deletePlayer(playerId);
      setPlayers(players.filter(p => p.id !== playerId));
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

  const filteredPlayers = selectedTeam === 'all' 
    ? players 
    : players.filter(p => p.teamId === selectedTeam);

  const groupedPlayers = filteredPlayers.reduce((acc, player) => {
    if (!acc[player.position]) {
      acc[player.position] = [];
    }
    acc[player.position].push(player);
    return acc;
  }, {} as Record<PlayerPosition, Player[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pb-20 md:pb-0 pt-16 md:pt-16">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-2">
            👥 球员管理
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            管理球队球员信息
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
                <UserPlus className="h-4 w-4" />
                添加球员
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加新球员</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="player-team">所属球队 *</Label>
                  <Select 
                    value={newPlayer.teamId} 
                    onValueChange={(value) => setNewPlayer({ ...newPlayer, teamId: value })}
                  >
                    <SelectTrigger id="player-team">
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
                  <Label htmlFor="player-name">球员姓名 *</Label>
                  <Input
                    id="player-name"
                    placeholder="例如：梅西"
                    value={newPlayer.name}
                    onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="player-number">球衣号码 *</Label>
                    <Input
                      id="player-number"
                      type="number"
                      placeholder="10"
                      value={newPlayer.number}
                      onChange={(e) => setNewPlayer({ ...newPlayer, number: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="player-position">位置 *</Label>
                    <Select 
                      value={newPlayer.position} 
                      onValueChange={(value: PlayerPosition) => setNewPlayer({ ...newPlayer, position: value })}
                    >
                      <SelectTrigger id="player-position">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(positionLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="player-age">年龄</Label>
                    <Input
                      id="player-age"
                      type="number"
                      placeholder="25"
                      value={newPlayer.age}
                      onChange={(e) => setNewPlayer({ ...newPlayer, age: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="player-height">身高(cm)</Label>
                    <Input
                      id="player-height"
                      type="number"
                      placeholder="175"
                      value={newPlayer.height}
                      onChange={(e) => setNewPlayer({ ...newPlayer, height: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="player-weight">体重(kg)</Label>
                    <Input
                      id="player-weight"
                      type="number"
                      placeholder="70"
                      value={newPlayer.weight}
                      onChange={(e) => setNewPlayer({ ...newPlayer, weight: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="player-nationality">国籍</Label>
                  <Input
                    id="player-nationality"
                    placeholder="阿根廷"
                    value={newPlayer.nationality}
                    onChange={(e) => setNewPlayer({ ...newPlayer, nationality: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddPlayer} className="w-full">
                  添加球员
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Players List */}
        {filteredPlayers.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <UserPlus className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                暂无球员
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center max-w-md mb-4">
                {teams.length === 0 
                  ? '请先创建球队，然后添加球员'
                  : '点击添加按钮创建第一个球员'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedPlayers).map(([position, positionPlayers]) => (
              <div key={position}>
                <h3 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-300">
                  {positionLabels[position as PlayerPosition]} ({positionPlayers.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {positionPlayers.map((player) => {
                    const teamColor = getTeamColor(player.teamId);
                    return (
                      <Card key={player.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3" style={{ backgroundColor: `${teamColor}15` }}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg"
                                  style={{ backgroundColor: teamColor }}
                                >
                                  {player.number}
                                </div>
                                <div>
                                  <CardTitle className="text-base flex items-center gap-2">
                                    {player.name}
                                    {player.isCaptain && (
                                      <Shield className="h-4 w-4 text-yellow-500" />
                                    )}
                                  </CardTitle>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {getTeamName(player.teamId)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">位置</span>
                              <span className="font-medium">{positionLabels[player.position]}</span>
                            </div>
                            {player.age && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">年龄</span>
                                <span className="font-medium">{player.age}</span>
                              </div>
                            )}
                            {player.height && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">身高</span>
                                <span className="font-medium">{player.height}cm</span>
                              </div>
                            )}
                            {player.weight && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">体重</span>
                                <span className="font-medium">{player.weight}kg</span>
                              </div>
                            )}
                            {player.nationality && (
                              <div className="flex justify-between col-span-2">
                                <span className="text-muted-foreground">国籍</span>
                                <span className="font-medium">{player.nationality}</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-4 pt-4 border-t flex justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeletePlayer(player.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
