import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Gift, Lock, Clock, Settings, MapPin, Laptop, Loader2, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { coupleSessionService } from '../../services/coupleSession.service';
import { subscribeToSessionTasks, subscribeToSessionRewards, unsubscribe, transformTask, transformReward } from '../../services/realtime.service';
import { CoupleSession, Task } from '../../types';
import { TaskList } from '../../components/TaskList';
import { Button } from '../../components/ui/Button';
import { RealtimeChannel } from '@supabase/supabase-js';

export const CoupleSessionRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const [session, setSession] = useState<CoupleSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [rewardText, setRewardText] = useState('');
  const [activeTab, setActiveTab] = useState<'my' | 'partner'>('my');
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('--:--');
  const [sessionStatus, setSessionStatus] = useState<'not-started' | 'in-progress' | 'ended'>('not-started');

  // Calculate time remaining
  const calculateTimeRemaining = () => {
    if (!session) return;

    const now = new Date().getTime();
    const startTime = new Date(session.startTime).getTime();
    const endTime = new Date(session.endTime).getTime();

    // Check if session hasn't started yet
    if (now < startTime) {
      setSessionStatus('not-started');
      const timeUntilStart = startTime - now;
      const hours = Math.floor(timeUntilStart / (1000 * 60 * 60));
      const minutes = Math.floor((timeUntilStart % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining(`Starts in ${hours > 0 ? `${hours}h ` : ''}${minutes}m`);
      return;
    }

    // Check if session has ended
    if (now > endTime) {
      setSessionStatus('ended');
      setTimeRemaining('Session ended');
      return;
    }

    // Session is in progress
    setSessionStatus('in-progress');
    const remaining = endTime - now;
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    if (hours > 0) {
      setTimeRemaining(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    } else {
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (!session) return;

    // Initial calculation
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [session]);

  // Load session data
  useEffect(() => {
    if (!id || !user) {
      setLoading(false);
      return;
    }

    const loadSession = async () => {
      try {
        const sessionData = await coupleSessionService.getCoupleSessionById(id);
        setSession({
          ...sessionData,
          partners: sessionData.partners || [],
          tasks: sessionData.tasks || [],
          rewards: sessionData.rewards || []
        });
        
        const myReward = sessionData.rewards?.find((r: any) => r.giver_user_id === user.id || r.giverUserId === user.id);
        if (myReward) setRewardText(myReward.description);
      } catch (err: any) {
        setError(err.message || 'Failed to load session');
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [id, user]);

  // Real-time subscriptions
  useEffect(() => {
    if (!id || !session) return;

    let tasksChannel: RealtimeChannel | null = null;
    let rewardsChannel: RealtimeChannel | null = null;

    // Subscribe to task changes
    tasksChannel = subscribeToSessionTasks(id, {
      onInsert: (rawTask) => {
        console.log('📥 Task inserted:', rawTask);
        const task = transformTask(rawTask);
        setSession(prev => {
          if (!prev) return null;
          // Avoid duplicates
          if (prev.tasks.some(t => t.id === task.id)) return prev;
          return { ...prev, tasks: [...prev.tasks, task] };
        });
      },
      onUpdate: (rawTask) => {
        console.log('📝 Task updated:', rawTask);
        const task = transformTask(rawTask);
        setSession(prev => {
          if (!prev) return null;
          return {
            ...prev,
            tasks: prev.tasks.map(t => t.id === task.id ? task : t)
          };
        });
      },
      onDelete: (rawTask) => {
        console.log('🗑️ Task deleted:', rawTask);
        setSession(prev => {
          if (!prev) return null;
          return {
            ...prev,
            tasks: prev.tasks.filter(t => t.id !== rawTask.id)
          };
        });
      }
    });

    // Subscribe to reward changes
    rewardsChannel = subscribeToSessionRewards(id, {
      onInsert: (rawReward) => {
        console.log('🎁 Reward inserted:', rawReward);
        // Only update if it's a reward for the current user (not visible to giver)
        if (rawReward.receiver_user_id === user?.id) {
          setSession(prev => {
            if (!prev) return null;
            const reward = transformReward(rawReward);
            if (prev.rewards.some(r => r.id === reward.id)) return prev;
            return { ...prev, rewards: [...prev.rewards, reward] };
          });
        }
      },
      onUpdate: (rawReward) => {
        console.log('🎁 Reward updated:', rawReward);
        const reward = transformReward(rawReward);
        setSession(prev => {
          if (!prev) return null;
          return {
            ...prev,
            rewards: prev.rewards.map(r => r.id === reward.id ? reward : r)
          };
        });
      }
    });

    setIsConnected(true);

    // Cleanup subscriptions on unmount
    return () => {
      setIsConnected(false);
      if (tasksChannel) unsubscribe(tasksChannel);
      if (rewardsChannel) unsubscribe(rewardsChannel);
    };
  }, [id, session?.id, user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="neu-card p-8 flex flex-col items-center gap-4">
          <div className="neu-icon-wrap p-4 rounded-full">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <p className="text-text-secondary">Loading session...</p>
        </div>
      </div>
    );
  }
  
  if (error) return (
    <div className="p-10 text-center">
      <div className="neu-card p-8 max-w-md mx-auto">
        <p className="text-error">{error}</p>
        <Link to="/couple" className="text-primary hover:text-primary-dark mt-4 inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
  
  if (!session) return (
    <div className="p-10 text-center">
      <div className="neu-card p-8 max-w-md mx-auto">
        <p className="text-text-secondary">Session not found.</p>
        <Link to="/couple" className="text-primary hover:text-primary-dark mt-4 inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
  
  if (!user || !profile) return (
    <div className="p-10 text-center">
      <div className="neu-card p-8 max-w-md mx-auto">
        <p className="text-text-secondary">Please log in.</p>
        <Link to="/login" className="text-primary hover:text-primary-dark mt-4 inline-block">
          Sign In →
        </Link>
      </div>
    </div>
  );

  const myTasks = session.tasks.filter(t => t.ownerUserId === user.id);
  const partnerTasks = session.tasks.filter(t => t.ownerUserId !== user.id);
  
  // Handlers
  const handleTaskToggle = async (taskId: string) => {
    try {
      const task = session.tasks.find(t => t.id === taskId);
      if (!task) return;
      
      await coupleSessionService.updateTask(taskId, { is_done: !task.done });
      // Local state will be updated via real-time subscription
    } catch (err: any) {
      alert('Failed to update task: ' + err.message);
    }
  };

  const handleDifficultyChange = async (taskId: string, newDifficulty: 'easy' | 'medium' | 'hard') => {
    try {
      await coupleSessionService.updateTask(taskId, { difficulty: newDifficulty });
      // Local state will be updated via real-time subscription
    } catch (err: any) {
      alert('Failed to update task: ' + err.message);
    }
  };

  const handleTaskAdd = async (title: string) => {
    if (!session || !user) return;
    
    try {
      await coupleSessionService.createTask(session.id, {
        owner_user_id: user.id,
        title,
        is_done: false,
        difficulty: 'medium'
      });
      // Local state will be updated via real-time subscription
    } catch (err: any) {
      alert('Failed to create task: ' + err.message);
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      await coupleSessionService.deleteTask(taskId);
      // Local state will be updated via real-time subscription
    } catch (err: any) {
      alert('Failed to delete task: ' + err.message);
    }
  };

  const handleSaveReward = async () => {
    if (!session || !user || !rewardText.trim()) return;
    
    const partnerUserId = session.partners.find(p => p.id !== user.id)?.id || '';
    
    if (!partnerUserId) {
      alert('Partner not found');
      return;
    }

    try {
      await coupleSessionService.createReward(session.id, {
        giver_user_id: user.id,
        receiver_user_id: partnerUserId,
        description: rewardText
      });
      alert("Reward saved! Your partner can't see this yet.");
    } catch (err: any) {
      alert('Failed to save reward: ' + err.message);
    }
  };

  const partnerUser = session.partners.find(u => u.id !== user.id);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="neu-navbar sticky top-4 mx-4 z-20 rounded-neu-lg">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/couple" className="neu-icon-wrap p-2 rounded-xl text-text-secondary hover:text-primary transition-colors">
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h1 className="font-heading font-bold text-text-primary text-sm md:text-base">{session.title}</h1>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <span className={`flex items-center gap-1 font-medium ${
                  sessionStatus === 'ended' ? 'text-error' : 
                  sessionStatus === 'in-progress' ? 'text-success' : 
                  'text-warning'
                }`}>
                  <Clock size={12}/> {timeRemaining}
                </span>
                <span className="w-1 h-1 bg-border-soft rounded-full"></span>
                {session.mode === 'offline' ? (
                   <span className="flex items-center gap-1 text-warning">
                     <MapPin size={12} /> {session.location || 'Offline'}
                   </span>
                ) : (
                   <span className="flex items-center gap-1 text-success">
                     <Laptop size={12} /> Online
                   </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Real-time connection indicator */}
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
              isConnected ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
            }`}>
              {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
              <span className="hidden sm:inline">{isConnected ? 'Live' : 'Offline'}</span>
            </div>
            
            <div className="flex -space-x-2">
                {session.partners.map(p => (
                    <div 
                      key={p.id}
                      className="w-8 h-8 rounded-full neu-icon-wrap flex items-center justify-center text-primary text-xs font-medium border-2 border-background"
                    >
                      {p.displayName?.[0]?.toUpperCase() || '?'}
                    </div>
                ))}
            </div>
            <button className="neu-icon-wrap p-2 rounded-xl text-text-secondary hover:text-primary transition-colors">
                <Settings size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex mx-4 mt-4 p-1 neu-card rounded-neu-lg">
        <button 
          onClick={() => setActiveTab('my')}
          className={`flex-1 py-3 text-sm font-semibold rounded-neu transition-all ${
            activeTab === 'my' 
              ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-neu-sm' 
              : 'text-text-secondary'
          }`}
        >
          My Tasks
        </button>
        <button 
          onClick={() => setActiveTab('partner')}
          className={`flex-1 py-3 text-sm font-semibold rounded-neu transition-all ${
            activeTab === 'partner' 
              ? 'bg-gradient-to-r from-secondary to-secondary/90 text-white shadow-neu-sm' 
              : 'text-text-secondary'
          }`}
        >
          {partnerUser?.displayName || 'Partner'}'s Tasks
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
            <div className="neu-card p-6">
              <div className="flex items-center gap-2 mb-4 text-secondary">
                <div className="neu-icon-wrap p-2 rounded-xl">
                  <Gift size={16} />
                </div>
                <h3 className="font-heading font-semibold text-sm">Reward for {partnerUser?.displayName || 'Partner'}</h3>
              </div>
              <textarea 
                className="w-full neu-input p-4 text-sm text-text-primary placeholder:text-text-muted resize-none h-24 rounded-neu"
                placeholder={`What will you give ${partnerUser?.displayName || 'your partner'} if they finish their tasks? (Hidden from them)`}
                value={rewardText}
                onChange={(e) => setRewardText(e.target.value)}
              />
              <div className="flex justify-end mt-3">
                <Button size="sm" variant="ghost" onClick={handleSaveReward}>
                  Save Secret Reward
                </Button>
              </div>
            </div>
          </div>

          {/* Partner Section */}
          <div className={`flex flex-col gap-6 ${activeTab === 'partner' ? 'block' : 'hidden md:flex'}`}>
            <TaskList 
              title={`${partnerUser?.displayName || 'Partner'}'s Focus`} 
              tasks={partnerTasks} 
              isOwner={false}
              onToggle={() => {}}
              onAdd={() => {}}
              onDelete={() => {}}
              onDifficultyChange={handleDifficultyChange}
            />

            {/* Reward waiting for me */}
            <div className="neu-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-light/10 to-secondary-light/10"></div>
                <div className="relative z-10">
                  <div className="neu-icon-wrap p-5 rounded-2xl mb-4">
                      <Lock size={24} className="text-primary" />
                  </div>
                  <h3 className="text-text-primary font-heading font-semibold mb-2">Mystery Reward</h3>
                  <p className="text-text-secondary text-sm max-w-xs">
                      {partnerUser?.displayName || 'Your partner'} has prepared a surprise reward for you. Complete your tasks to unlock it!
                  </p>
                </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
