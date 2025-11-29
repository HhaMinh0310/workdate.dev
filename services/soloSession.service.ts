import { supabase } from './supabase';
import { SoloSession } from '../types';

export const soloSessionService = {
  async getSoloSessions(filters?: {
    mode?: 'online' | 'offline';
    status?: 'open' | 'matched' | 'closed';
    date?: string;
  }) {
    let query = supabase
      .from('solo_sessions')
      .select(`
        *,
        host_user:profiles!solo_sessions_host_user_id_fkey(id, display_name, avatar_url, status)
      `)
      .eq('status', filters?.status || 'open')
      .order('created_at', { ascending: false });

    if (filters?.mode) {
      query = query.eq('mode', filters.mode);
    }

    if (filters?.date) {
      query = query.eq('date', filters.date);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Transform to match SoloSession interface
    return data.map((session: any) => ({
      id: session.id,
      hostUserId: session.host_user_id,
      hostUser: {
        id: session.host_user.id,
        displayName: session.host_user.display_name,
        avatarUrl: session.host_user.avatar_url,
        status: session.host_user.status
      },
      title: session.title,
      date: session.date,
      startTime: session.start_time,
      endTime: session.end_time,
      mode: session.mode,
      location: session.location,
      description: session.description || '',
      techStack: session.tech_stack || [],
      partnerPreferences: session.partner_prefs || {
        level: 'Any',
        role: [],
        vibe: []
      }
    }));
  },

  async createSoloSession(sessionData: {
    host_user_id: string;
    title: string;
    date: string;
    start_time: string;
    end_time?: string;
    mode: 'online' | 'offline';
    location?: string;
    description: string;
    tech_stack: string[];
    partner_prefs: {
      level: string;
      role: string[];
      vibe: string[];
    };
  }) {
    const { data, error } = await supabase
      .from('solo_sessions')
      .insert(sessionData)
      .select(`
        *,
        host_user:profiles!solo_sessions_host_user_id_fkey(id, display_name, avatar_url, status)
      `)
      .single();
    if (error) throw error;

    return {
      id: data.id,
      hostUserId: data.host_user_id,
      hostUser: {
        id: data.host_user.id,
        displayName: data.host_user.display_name,
        avatarUrl: data.host_user.avatar_url,
        status: data.host_user.status
      },
      title: data.title,
      date: data.date,
      startTime: data.start_time,
      endTime: data.end_time,
      mode: data.mode,
      location: data.location,
      description: data.description || '',
      techStack: data.tech_stack || [],
      partnerPreferences: data.partner_prefs || {
        level: 'Any',
        role: [],
        vibe: []
      }
    };
  },

  async getSoloSessionById(id: string) {
    const { data, error } = await supabase
      .from('solo_sessions')
      .select(`
        *,
        host_user:profiles!solo_sessions_host_user_id_fkey(id, display_name, avatar_url, status)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;

    return {
      id: data.id,
      hostUserId: data.host_user_id,
      hostUser: {
        id: data.host_user.id,
        displayName: data.host_user.display_name,
        avatarUrl: data.host_user.avatar_url,
        status: data.host_user.status
      },
      title: data.title,
      date: data.date,
      startTime: data.start_time,
      endTime: data.end_time,
      mode: data.mode,
      location: data.location,
      description: data.description || '',
      techStack: data.tech_stack || [],
      partnerPreferences: data.partner_prefs || {
        level: 'Any',
        role: [],
        vibe: []
      }
    };
  },

  async requestWorkdate(sessionId: string, requesterUserId: string) {
    const { data, error } = await supabase
      .from('session_requests')
      .insert({
        solo_session_id: sessionId,
        requester_user_id: requesterUserId,
        status: 'pending'
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getMySessions(hostUserId: string) {
    const { data, error } = await supabase
      .from('solo_sessions')
      .select(`
        *,
        host_user:profiles!solo_sessions_host_user_id_fkey(id, display_name, avatar_url, status)
      `)
      .eq('host_user_id', hostUserId)
      .order('created_at', { ascending: false });
    if (error) throw error;

    return data.map((session: any) => ({
      id: session.id,
      hostUserId: session.host_user_id,
      hostUser: {
        id: session.host_user.id,
        displayName: session.host_user.display_name,
        avatarUrl: session.host_user.avatar_url,
        status: session.host_user.status
      },
      title: session.title,
      date: session.date,
      startTime: session.start_time,
      endTime: session.end_time,
      mode: session.mode,
      location: session.location,
      description: session.description || '',
      techStack: session.tech_stack || [],
      partnerPreferences: session.partner_prefs || {
        level: 'Any',
        role: [],
        vibe: []
      }
    }));
  }
};

