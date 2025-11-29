import { supabase } from './supabase';
import { CoupleSession, Task, Reward, User } from '../types';
import { partnershipService } from './partnership.service';

export const coupleSessionService = {
  async getCoupleSessions(partnershipId: string) {
    const { data, error } = await supabase
      .from('couple_sessions')
      .select(`
        *,
        partnerships!inner(
          id,
          user1:profiles!partnerships_user1_id_fkey(id, display_name, avatar_url, status),
          user2:profiles!partnerships_user2_id_fkey(id, display_name, avatar_url, status)
        ),
        tasks(*),
        rewards(*)
      `)
      .eq('partnership_id', partnershipId)
      .order('start_time', { ascending: false });
    if (error) throw error;
    
    // Transform data to match CoupleSession interface
    return data.map((session: any) => {
      const partners: User[] = [];
      if (session.partnerships?.user1) {
        partners.push({
          id: session.partnerships.user1.id,
          displayName: session.partnerships.user1.display_name,
          avatarUrl: session.partnerships.user1.avatar_url,
          status: session.partnerships.user1.status
        });
      }
      if (session.partnerships?.user2) {
        partners.push({
          id: session.partnerships.user2.id,
          displayName: session.partnerships.user2.display_name,
          avatarUrl: session.partnerships.user2.avatar_url,
          status: session.partnerships.user2.status
        });
      }

      return {
        id: session.id,
        title: session.title,
        startTime: session.start_time,
        endTime: session.end_time,
        mode: session.mode,
        location: session.location,
        partners,
        tasks: (session.tasks || []).map((t: any) => ({
          id: t.id,
          ownerUserId: t.owner_user_id,
          title: t.title,
          done: t.is_done,
          difficulty: t.difficulty
        })),
        rewards: (session.rewards || []).map((r: any) => ({
          id: r.id,
          giverUserId: r.giver_user_id,
          receiverUserId: r.receiver_user_id,
          description: r.description
        }))
      };
    });
  },

  async createCoupleSession(sessionData: {
    partnership_id: string;
    title: string;
    start_time: string;
    end_time: string;
    mode?: 'online' | 'offline';
    location?: string;
  }) {
    const { data, error } = await supabase
      .from('couple_sessions')
      .insert(sessionData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getCoupleSessionById(id: string) {
    const { data, error } = await supabase
      .from('couple_sessions')
      .select(`
        *,
        partnerships!inner(
          id,
          user1:profiles!partnerships_user1_id_fkey(id, display_name, avatar_url, status),
          user2:profiles!partnerships_user2_id_fkey(id, display_name, avatar_url, status)
        ),
        tasks(*),
        rewards(*)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    
    // Transform to match CoupleSession interface
    const partners: User[] = [];
    if (data.partnerships?.user1) {
      partners.push({
        id: data.partnerships.user1.id,
        displayName: data.partnerships.user1.display_name,
        avatarUrl: data.partnerships.user1.avatar_url,
        status: data.partnerships.user1.status
      });
    }
    if (data.partnerships?.user2) {
      partners.push({
        id: data.partnerships.user2.id,
        displayName: data.partnerships.user2.display_name,
        avatarUrl: data.partnerships.user2.avatar_url,
        status: data.partnerships.user2.status
      });
    }

    return {
      id: data.id,
      title: data.title,
      startTime: data.start_time,
      endTime: data.end_time,
      mode: data.mode,
      location: data.location,
      partners,
      tasks: (data.tasks || []).map((t: any) => ({
        id: t.id,
        ownerUserId: t.owner_user_id,
        title: t.title,
        done: t.is_done,
        difficulty: t.difficulty
      })),
      rewards: (data.rewards || []).map((r: any) => ({
        id: r.id,
        giverUserId: r.giver_user_id,
        receiverUserId: r.receiver_user_id,
        description: r.description
      }))
    };
  },

  async createTask(sessionId: string, taskData: {
    owner_user_id: string;
    title: string;
    is_done?: boolean;
    difficulty?: 'easy' | 'medium' | 'hard';
  }) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...taskData, session_id: sessionId })
      .select()
      .single();
    if (error) throw error;
    
    // Transform to match Task interface
    return {
      id: data.id,
      ownerUserId: data.owner_user_id,
      title: data.title,
      done: data.is_done || false,
      difficulty: data.difficulty
    };
  },

  async updateTask(taskId: string, updates: {
    title?: string;
    is_done?: boolean;
    difficulty?: 'easy' | 'medium' | 'hard';
  }) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', taskId)
      .select()
      .single();
    if (error) throw error;
    
    return {
      id: data.id,
      ownerUserId: data.owner_user_id,
      title: data.title,
      done: data.is_done || false,
      difficulty: data.difficulty
    };
  },

  async deleteTask(taskId: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
    if (error) throw error;
  },

  async createReward(sessionId: string, rewardData: {
    giver_user_id: string;
    receiver_user_id: string;
    description: string;
  }) {
    const { data, error } = await supabase
      .from('rewards')
      .insert({ ...rewardData, session_id: sessionId })
      .select()
      .single();
    if (error) throw error;
    
    return {
      id: data.id,
      giverUserId: data.giver_user_id,
      receiverUserId: data.receiver_user_id,
      description: data.description
    };
  }
};

