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
    <div className={`flex flex-col h-full ${variant === 'compact' ? '' : 'neu-card p-5'}`}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-heading font-semibold text-text-primary">{title}</h3>
          <p className="text-xs text-text-secondary mt-1">{completedCount}/{tasks.length} tasks completed</p>
        </div>
        {tasks.length > 0 && (
           <div className="w-16 h-16 relative flex items-center justify-center">
             <svg className="transform -rotate-90 w-full h-full">
               <circle 
                 cx="32" cy="32" r="28" 
                 stroke="currentColor" 
                 strokeWidth="4" 
                 fill="transparent" 
                 className="text-border-soft" 
               />
               <circle 
                 cx="32" cy="32" r="28" 
                 stroke="currentColor" 
                 strokeWidth="4" 
                 fill="transparent" 
                 strokeDasharray={175} 
                 strokeDashoffset={175 - (175 * progress) / 100} 
                 className="text-success transition-all duration-500" 
                 strokeLinecap="round"
               />
             </svg>
             <span className="absolute text-xs font-bold text-text-primary">{Math.round(progress)}%</span>
           </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 no-scrollbar">
        {tasks.length === 0 && (
          <div className="text-center py-10 neu-card-inset rounded-neu">
            <p className="text-text-muted italic">
              No tasks yet. {isOwner ? "Add one below!" : "Waiting for partner..."}
            </p>
          </div>
        )}
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`group flex items-center p-4 rounded-neu transition-all ${
              task.done 
                ? 'neu-card-inset opacity-60' 
                : 'neu-card hover:shadow-neu-hover'
            }`}
          >
            {isOwner ? (
              <button 
                onClick={() => onToggle(task.id)}
                className="mr-3 text-text-secondary hover:text-success transition-colors cursor-pointer"
              >
                {task.done ? <CheckSquare size={20} className="text-success" /> : <Square size={20} />}
              </button>
            ) : (
              <div className="mr-3 text-text-secondary">
                {task.done ? <CheckSquare size={20} className="text-success" /> : <Square size={20} />}
              </div>
            )}
            
            <span className={`flex-1 text-sm ${task.done ? 'line-through text-text-muted' : 'text-text-primary'}`}>
              {task.title}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDifficultyClick(task);
              }}
              disabled={!isOwner}
              title={isOwner ? "Click to change difficulty" : ""}
              className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ml-2 transition-all ${
                isOwner ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'
              } ${
                (task.difficulty || 'medium') === 'hard' ? 'bg-error/20 text-error' :
                (task.difficulty || 'medium') === 'medium' ? 'bg-warning/20 text-warning' :
                'bg-success/20 text-success'
              }`}
            >
              {task.difficulty || 'medium'}
            </button>

            {isOwner && (
              <button 
                onClick={() => onDelete(task.id)}
                className="ml-2 text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {isOwner && (
        <form onSubmit={handleAdd} className="mt-auto pt-4 border-t border-border-soft">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 neu-input px-4 py-3 text-sm text-text-primary placeholder:text-text-muted"
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
