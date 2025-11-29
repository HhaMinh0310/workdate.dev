import { supabase } from './supabase';

export const partnershipService = {
  async getPartnerships(userId: string) {
    const { data, error } = await supabase
      .from('partnerships')
      .select(`
        *,
        user1:profiles!partnerships_user1_id_fkey(id, display_name, avatar_url, status),
        user2:profiles!partnerships_user2_id_fkey(id, display_name, avatar_url, status)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('status', 'active');
    if (error) throw error;
    return data;
  },

  async getPartnershipById(partnershipId: string) {
    const { data, error } = await supabase
      .from('partnerships')
      .select(`
        *,
        user1:profiles!partnerships_user1_id_fkey(id, display_name, avatar_url, status),
        user2:profiles!partnerships_user2_id_fkey(id, display_name, avatar_url, status)
      `)
      .eq('id', partnershipId)
      .single();
    if (error) throw error;
    return data;
  },

  async createPartnership(user1Id: string, user2Id: string) {
    const { data, error } = await supabase
      .from('partnerships')
      .insert({
        user1_id: user1Id,
        user2_id: user2Id,
        status: 'active'
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

