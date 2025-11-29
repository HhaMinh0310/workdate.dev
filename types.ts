export interface User {
  id: string;
  displayName: string;
  avatarUrl?: string;
  status: 'online' | 'offline' | 'focus';
}

export interface Task {
  id: string;
  ownerUserId: string;
  title: string;
  done: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Reward {
  id: string;
  giverUserId: string;
  receiverUserId: string;
  description: string;
}

export interface CoupleSession {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  partners: User[];
  tasks: Task[];
  rewards: Reward[];
  mode?: 'online' | 'offline';
  location?: string;
}

export interface SoloSession {
  id: string;
  hostUserId: string;
  hostUser: User;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  mode: 'online' | 'offline';
  location?: string;
  description: string;
  techStack: string[];
  partnerPreferences: {
    level: string;
    role: string[];
    vibe: string[];
  };
}