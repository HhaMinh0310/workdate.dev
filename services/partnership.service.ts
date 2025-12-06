import { supabase } from './supabase';

export const partnershipService = {
  async getPartnerships(userId: string) {
    console.log('🔍 Getting partnerships for user:', userId);
    
    const { data, error } = await supabase
      .from('partnerships')
      .select(`
        *,
        user1:profiles!partnerships_user1_id_fkey(id, display_name, avatar_url, status),
        user2:profiles!partnerships_user2_id_fkey(id, display_name, avatar_url, status)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);
    
    console.log('📦 Partnerships result:', { data, error });
    
    if (error) {
      console.error('❌ Partnership error:', error);
      throw error;
    }
    
    // Filter active partnerships in JS (in case RLS causes issues)
    const activePartnerships = data?.filter(p => p.status === 'active') || [];
    console.log('✅ Active partnerships:', activePartnerships);
    
    return activePartnerships;
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
  },

  /**
   * Deactivate a partnership (soft delete)
   * Sets status to 'inactive' so the relationship is preserved but not active
   */
  async deactivatePartnership(partnershipId: string) {
    console.log('🔴 Deactivating partnership:', partnershipId);
    
    const { data, error } = await supabase
      .from('partnerships')
      .update({ 
        status: 'inactive',
        updated_at: new Date().toISOString()
      })
      .eq('id', partnershipId)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Failed to deactivate partnership:', error);
      throw error;
    }
    
    console.log('✅ Partnership deactivated:', data);
    return data;
  },

  /**
   * Remove a partnership completely (hard delete)
   * This will also trigger cascade delete of related couple_sessions if configured
   */
  async removePartnership(partnershipId: string) {
    console.log('🗑️ Removing partnership:', partnershipId);
    
    const { error } = await supabase
      .from('partnerships')
      .delete()
      .eq('id', partnershipId);
    
    if (error) {
      console.error('❌ Failed to remove partnership:', error);
      throw error;
    }
    
    console.log('✅ Partnership removed');
    return true;
  },

  /**
   * Check if two users are partners
   */
  async checkPartnership(user1Id: string, user2Id: string) {
    const { data, error } = await supabase
      .from('partnerships')
      .select('id, status')
      .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
      .eq('status', 'active')
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
};
