import { CoupleSession, SoloSession, User } from '../types';

export const CURRENT_USER: User = {
  id: 'u1',
  displayName: 'Alex',
  avatarUrl: 'https://i.pravatar.cc/150?u=u1',
  status: 'online',
};

export const PARTNER_USER: User = {
  id: 'u2',
  displayName: 'Sam',
  avatarUrl: 'https://i.pravatar.cc/150?u=u2',
  status: 'focus',
};

// Changed from const to let to allow adding new sessions for the demo
export let MOCK_COUPLE_SESSIONS: CoupleSession[] = [
  {
    id: 'cs1',
    title: 'Sunday Deep Work Date',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3600000).toISOString(),
    mode: 'online',
    partners: [CURRENT_USER, PARTNER_USER],
    tasks: [
      { id: 't1', ownerUserId: 'u1', title: 'Finish API integration', done: true, difficulty: 'hard' },
      { id: 't2', ownerUserId: 'u1', title: 'Refactor Auth component', done: false, difficulty: 'medium' },
      { id: 't3', ownerUserId: 'u2', title: 'Design landing page', done: false, difficulty: 'medium' },
      { id: 't4', ownerUserId: 'u2', title: 'Write documentation', done: true, difficulty: 'easy' },
    ],
    rewards: [
      { id: 'r1', giverUserId: 'u1', receiverUserId: 'u2', description: 'Dinner at that sushi place' },
      { id: 'r2', giverUserId: 'u2', receiverUserId: 'u1', description: 'Secret Reward' },
    ],
  },
];

// Function to add a new session to the mock data array
export const addCoupleSession = (session: CoupleSession) => {
  MOCK_COUPLE_SESSIONS.unshift(session); // unshift adds the new session to the beginning of the array
};


export const MOCK_SOLO_SESSIONS: SoloSession[] = [
  {
    id: 'ss1',
    hostUserId: 'u3',
    hostUser: { id: 'u3', displayName: 'Jordan', avatarUrl: 'https://i.pravatar.cc/150?u=u3', status: 'online' },
    title: 'Rust Learning Sprint',
    date: '2023-10-25',
    startTime: '19:00',
    endTime: '22:00',
    mode: 'online',
    description: 'Going through the Rust book. Looking for someone to hold me accountable. Silent work mostly.',
    techStack: ['Rust', 'Systems'],
    partnerPreferences: {
      level: 'Any',
      role: ['Backend'],
      vibe: ['Silent', 'Focus'],
    },
  },
  {
    id: 'ss2',
    hostUserId: 'u4',
    hostUser: { id: 'u4', displayName: 'Casey', avatarUrl: 'https://i.pravatar.cc/150?u=u4', status: 'offline' },
    title: 'Frontend Polish & Chill',
    date: '2023-10-26',
    startTime: '14:00',
    endTime: '17:00',
    mode: 'offline',
    location: 'Starbucks, Downtown',
    description: 'Building a portfolio site. Need feedback on design.',
    techStack: ['React', 'Tailwind', 'Figma'],
    partnerPreferences: {
      level: 'Mid/Senior',
      role: ['Frontend', 'Designer'],
      vibe: ['Chatty', 'Coffee'],
    },
  },
  {
    id: 'ss6',
    hostUserId: 'u6',
    hostUser: { id: 'u6', displayName: 'Sarah', avatarUrl: 'https://i.pravatar.cc/150?u=sarah_bakes', status: 'online' },
    title: 'Baking & Planning',
    date: '2023-10-28',
    startTime: '09:00',
    endTime: '12:00',
    mode: 'online',
    description: 'I am planning my bakery menu while waiting for dough to rise. Need a body double to keep me off TikTok!',
    techStack: ['Excel', 'Notion', 'Pastry'],
    partnerPreferences: {
      level: 'Any',
      role: ['Planner', 'Creative'],
      vibe: ['Casual', 'Background Noise'],
    },
  },
  {
    id: 'ss7',
    hostUserId: 'u7',
    hostUser: { id: 'u7', displayName: 'Emily', avatarUrl: 'https://i.pravatar.cc/150?u=emily_med', status: 'focus' },
    title: 'Med School Study Block',
    date: '2023-10-28',
    startTime: '20:00',
    endTime: '23:00',
    mode: 'online',
    description: 'Intense study session for anatomy finals. Pomodoro 50/10. Camera ON required for accountability.',
    techStack: ['Anatomy', 'Flashcards', 'Coffee'],
    partnerPreferences: {
      level: 'Student',
      role: ['Student', 'Researcher'],
      vibe: ['Strict', 'Silent'],
    },
  },
  {
    id: 'ss8',
    hostUserId: 'u8',
    hostUser: { id: 'u8', displayName: 'Jessica', avatarUrl: 'https://i.pravatar.cc/150?u=jess_design', status: 'online' },
    title: 'Interior Design Moodboards',
    date: '2023-10-29',
    startTime: '15:00',
    endTime: '18:00',
    mode: 'offline',
    location: 'Library, West Wing',
    description: 'Sourcing materials and creating layouts for a client. Happy to chat during breaks.',
    techStack: ['AutoCAD', 'Pinterest', 'Sketching'],
    partnerPreferences: {
      level: 'Any',
      role: ['Designer', 'Architect'],
      vibe: ['Creative', 'Chill'],
    },
  },
    {
    id: 'ss3',
    hostUserId: 'u5',
    hostUser: { id: 'u5', displayName: 'Taylor', avatarUrl: 'https://i.pravatar.cc/150?u=u5', status: 'online' },
    title: 'LeetCode Grind',
    date: '2023-10-27',
    startTime: '20:00',
    endTime: '23:00',
    mode: 'online',
    description: 'Prepping for interviews. Doing 2 mediums and 1 hard.',
    techStack: ['Python', 'Algo'],
    partnerPreferences: {
      level: 'Junior/Mid',
      role: ['Fullstack'],
      vibe: ['Serious', 'Discussion'],
    },
  },
];