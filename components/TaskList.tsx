import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, Trash2, Square, CheckSquare } from 'lucide-react';
import { Button } from './ui/Button';

interface TaskListProps {
  tasks: Task[];
  title: string;
  isOwner: boolean;
  onToggle: (taskId: string) => void;
  onAdd: (title: string) => void;
  onDelete: (taskId: string) => void;
  onDifficultyChange?: (taskId: string, newDifficulty: 'easy' | 'medium' | 'hard') => void;
  variant?: 'default' | 'compact';
}

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  title, 
  isOwner, 
  onToggle, 
  onAdd, 
  onDelete,
  onDifficultyChange,
  variant = 'default'
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAdd(newTaskTitle);
      setNewTaskTitle('');
    }
  };

  const handleDifficultyClick = (task: Task) => {
    if (!isOwner || !onDifficultyChange) return;
    
    const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
    const current = task.difficulty || 'medium';
    const nextIndex = (difficulties.indexOf(current) + 1) % difficulties.length;
    const nextDifficulty = difficulties[nextIndex];
    
    onDifficultyChange(task.id, nextDifficulty);
  };

  const completedCount = tasks.filter(t => t.done).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className={`flex flex-col h-full ${variant === 'compact' ? '' : 'bg-surface/50 rounded-xl p-4 border border-slate-700'}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          <p className="text-xs text-slate-400 mt-1">{completedCount}/{tasks.length} tasks completed</p>
        </div>
        {tasks.length > 0 && (
           <div className="w-16 h-16 relative flex items-center justify-center">
             <svg className="transform -rotate-90 w-full h-full">
               <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-700" />
               <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (175 * progress) / 100} className="text-green-500 transition-all duration-500" />
             </svg>
             <span className="absolute text-xs font-bold">{Math.round(progress)}%</span>
           </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-1 custom-scrollbar">
        {tasks.length === 0 && (
          <div className="text-center py-8 text-slate-500 italic">
            No tasks yet. {isOwner ? "Add one below!" : "Waiting for partner..."}
          </div>
        )}
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`group flex items-center p-3 rounded-lg border transition-all ${
              task.done ? 'bg-slate-900/50 border-slate-800 opacity-60' : 'bg-slate-800 border-slate-700 hover:border-slate-600'
            }`}
          >
            {isOwner ? (
              <button 
                onClick={() => onToggle(task.id)}
                className="mr-3 text-slate-400 hover:text-green-400 transition-colors"
              >
                {task.done ? <CheckSquare size={20} className="text-green-500" /> : <Square size={20} />}
              </button>
            ) : (
              <div className="mr-3 text-slate-400">
                {task.done ? <CheckSquare size={20} className="text-green-500" /> : <Square size={20} />}
              </div>
            )}
            
            <span className={`flex-1 text-sm ${task.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
              {task.title}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDifficultyClick(task);
              }}
              disabled={!isOwner}
              title={isOwner ? "Click to change difficulty" : ""}
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ml-2 transition-all ${
                isOwner ? 'cursor-pointer hover:brightness-110 active:scale-95' : 'cursor-default'
              } ${
                (task.difficulty || 'medium') === 'hard' ? 'bg-red-900/50 text-red-400' :
                (task.difficulty || 'medium') === 'medium' ? 'bg-yellow-900/50 text-yellow-400' :
                'bg-green-900/50 text-green-400'
              }`}
            >
              {task.difficulty || 'medium'}
            </button>

            {isOwner && (
              <button 
                onClick={() => onDelete(task.id)}
                className="ml-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {isOwner && (
        <form onSubmit={handleAdd} className="mt-auto pt-2 border-t border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary placeholder:text-slate-600"
            />
            <Button type="submit" size="sm" variant="primary" icon={<Plus size={16} />}>
              Add
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};