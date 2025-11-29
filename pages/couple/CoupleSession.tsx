import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Gift, Lock, Clock, Settings, MapPin, Laptop } from 'lucide-react';
import { MOCK_COUPLE_SESSIONS, CURRENT_USER } from '../../services/mockData';
import { CoupleSession, Task } from '../../types';
import { TaskList } from '../../components/TaskList';
import { Button } from '../../components/ui/Button';

export const CoupleSessionRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<CoupleSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [rewardText, setRewardText] = useState('');
  const [activeTab, setActiveTab] = useState<'my' | 'partner'>('my'); // Mobile tab state

  // Simulate data fetch
  useEffect(() => {
    const found = MOCK_COUPLE_SESSIONS.find(s => s.id === id);
    if (found) {
      setSession(found);
      const myReward = found.rewards.find(r => r.giverUserId === CURRENT_USER.id);
      if (myReward) setRewardText(myReward.description);
    }
    setLoading(false);
  }, [id]);

  if (loading) return <div className="p-10 text-center text-slate-400">Loading session...</div>;
  if (!session) return <div className="p-10 text-center text-slate-400">Session not found.</div>;

  const myTasks = session.tasks.filter(t => t.ownerUserId === CURRENT_USER.id);
  const partnerTasks = session.tasks.filter(t => t.ownerUserId !== CURRENT_USER.id);
  
  // Handlers (Mock state updates)
  const handleTaskToggle = (taskId: string) => {
    setSession(prev => {
        if (!prev) return null;
        return {
            ...prev,
            tasks: prev.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
        };
    });
  };

  const handleDifficultyChange = (taskId: string, newDifficulty: 'easy' | 'medium' | 'hard') => {
    setSession(prev => {
        if (!prev) return null;
        return {
            ...prev,
            tasks: prev.tasks.map(t => t.id === taskId ? { ...t, difficulty: newDifficulty } : t)
        };
    });
  };

  const handleTaskAdd = (title: string) => {
    const newTask: Task = {
        id: Math.random().toString(),
        ownerUserId: CURRENT_USER.id,
        title,
        done: false,
        difficulty: 'medium'
    };
    setSession(prev => prev ? { ...prev, tasks: [...prev.tasks, newTask] } : null);
  };

  const handleTaskDelete = (taskId: string) => {
    setSession(prev => prev ? { ...prev, tasks: prev.tasks.filter(t => t.id !== taskId) } : null);
  };

  const handleSaveReward = () => {
    // API Call would go here
    alert("Reward saved! Your partner can't see this yet.");
  };

  const partnerUser = session.partners.find(u => u.id !== CURRENT_USER.id);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-surface border-b border-slate-700 px-4 py-3 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/couple" className="text-slate-400 hover:text-white transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <div>
              <h1 className="font-bold text-white text-sm md:text-base">{session.title}</h1>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Clock size={12}/> 45:00 remaining</span>
                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                {session.mode === 'offline' ? (
                   <span className="flex items-center gap-1 text-green-400">
                     <MapPin size={12} /> {session.location || 'Offline'}
                   </span>
                ) : (
                   <span className="flex items-center gap-1 text-green-400">
                     <Laptop size={12} /> Online
                   </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
                {session.partners.map(p => (
                    <img key={p.id} src={p.avatarUrl} className="w-8 h-8 rounded-full border-2 border-surface" />
                ))}
            </div>
            <button className="p-2 text-slate-400 hover:text-white">
                <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex border-b border-slate-700 bg-surface/50">
        <button 
          onClick={() => setActiveTab('my')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'my' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}
        >
          My Tasks
        </button>
        <button 
          onClick={() => setActiveTab('partner')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'partner' ? 'border-secondary text-secondary' : 'border-transparent text-slate-400'}`}
        >
          {partnerUser?.displayName}'s Tasks
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-8 h-full">
          
          {/* My Section */}
          <div className={`flex flex-col gap-6 ${activeTab === 'my' ? 'block' : 'hidden md:flex'}`}>
            <TaskList 
              title="My Focus" 
              tasks={myTasks} 
              isOwner={true}
              onToggle={handleTaskToggle}
              onAdd={handleTaskAdd}
              onDelete={handleTaskDelete}
              onDifficultyChange={handleDifficultyChange}
            />
            
            {/* Reward I give */}
            <div className="bg-surface/30 rounded-xl p-5 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-3 text-purple-400">
                <Gift size={18} />
                <h3 className="font-semibold text-sm">Reward for {partnerUser?.displayName}</h3>
              </div>
              <textarea 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500 mb-2 resize-none h-20"
                placeholder={`What will you give ${partnerUser?.displayName} if they finish their tasks? (Hidden from them)`}
                value={rewardText}
                onChange={(e) => setRewardText(e.target.value)}
              />
              <div className="flex justify-end">
                <Button size="sm" variant="ghost" className="text-xs" onClick={handleSaveReward}>Save Secret Reward</Button>
              </div>
            </div>
          </div>

          {/* Partner Section */}
          <div className={`flex flex-col gap-6 ${activeTab === 'partner' ? 'block' : 'hidden md:flex'}`}>
            <TaskList 
              title={`${partnerUser?.displayName}'s Focus`} 
              tasks={partnerTasks} 
              isOwner={false}
              onToggle={() => {}}
              onAdd={() => {}}
              onDelete={() => {}}
              // Partner tasks are read-only for difficulty too, so we can pass the handler but the component will disable the button
              onDifficultyChange={handleDifficultyChange}
            />

            {/* Reward waiting for me */}
            <div className="bg-gradient-to-br from-surface to-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="p-4 bg-slate-900 rounded-full mb-3 border border-slate-700">
                    <Lock size={24} className="text-secondary" />
                </div>
                <h3 className="text-white font-medium mb-1">Mystery Reward</h3>
                <p className="text-slate-400 text-sm max-w-xs">
                    {partnerUser?.displayName} has prepared a surprise reward for you. Complete your tasks to unlock it!
                </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};