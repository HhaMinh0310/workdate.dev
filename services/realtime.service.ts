import { supabase } from './supabase';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type PostgresChangeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface SubscriptionOptions<T> {
  table: string;
  event?: PostgresChangeEvent;
  filter?: string;
  onInsert?: (payload: T) => void;
  onUpdate?: (payload: T, oldRecord?: T) => void;
  onDelete?: (oldRecord: T) => void;
  onChange?: (eventType: PostgresChangeEvent, payload: any) => void;
}

/**
 * Create a real-time subscription to a Supabase table
 */
export function subscribeToTable<T = any>(
  channelName: string,
  options: SubscriptionOptions<T>
): RealtimeChannel {
  const { table, event = '*', filter, onInsert, onUpdate, onDelete, onChange } = options;

  const channelConfig: any = {
    event,
    schema: 'public',
    table,
  };

  if (filter) {
    channelConfig.filter = filter;
  }

  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      channelConfig,
      (payload: RealtimePostgresChangesPayload<T>) => {
        const eventType = payload.eventType as PostgresChangeEvent;
        
        // Call the generic onChange handler if provided
        if (onChange) {
          onChange(eventType, payload);
        }

        // Call specific handlers based on event type
        switch (eventType) {
          case 'INSERT':
            if (onInsert && payload.new) {
              onInsert(payload.new as T);
            }
            break;
          case 'UPDATE':
            if (onUpdate && payload.new) {
              onUpdate(payload.new as T, payload.old as T);
            }
            break;
          case 'DELETE':
            if (onDelete && payload.old) {
              onDelete(payload.old as T);
            }
            break;
        }
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`✅ Subscribed to ${table} changes on channel: ${channelName}`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`❌ Error subscribing to ${table} on channel: ${channelName}`);
      }
    });

  return channel;
}

/**
 * Subscribe to task changes for a specific session
 */
export function subscribeToSessionTasks(
  sessionId: string,
  callbacks: {
    onInsert?: (task: any) => void;
    onUpdate?: (task: any) => void;
    onDelete?: (task: any) => void;
  }
): RealtimeChannel {
  return subscribeToTable(`session-tasks-${sessionId}`, {
    table: 'tasks',
    filter: `session_id=eq.${sessionId}`,
    onInsert: callbacks.onInsert,
    onUpdate: callbacks.onUpdate,
    onDelete: callbacks.onDelete,
  });
}

/**
 * Subscribe to reward changes for a specific session
 */
export function subscribeToSessionRewards(
  sessionId: string,
  callbacks: {
    onInsert?: (reward: any) => void;
    onUpdate?: (reward: any) => void;
    onDelete?: (reward: any) => void;
  }
): RealtimeChannel {
  return subscribeToTable(`session-rewards-${sessionId}`, {
    table: 'rewards',
    filter: `session_id=eq.${sessionId}`,
    onInsert: callbacks.onInsert,
    onUpdate: callbacks.onUpdate,
    onDelete: callbacks.onDelete,
  });
}

/**
 * Subscribe to session changes for a specific partnership
 */
export function subscribeToCoupleSessions(
  partnershipId: string,
  callbacks: {
    onInsert?: (session: any) => void;
    onUpdate?: (session: any) => void;
    onDelete?: (session: any) => void;
  }
): RealtimeChannel {
  return subscribeToTable(`partnership-sessions-${partnershipId}`, {
    table: 'couple_sessions',
    filter: `partnership_id=eq.${partnershipId}`,
    onInsert: callbacks.onInsert,
    onUpdate: callbacks.onUpdate,
    onDelete: callbacks.onDelete,
  });
}

/**
 * Subscribe to partnership changes for a specific user
 */
export function subscribeToPartnership(
  partnershipId: string,
  callbacks: {
    onUpdate?: (partnership: any) => void;
    onDelete?: (partnership: any) => void;
  }
): RealtimeChannel {
  return subscribeToTable(`partnership-${partnershipId}`, {
    table: 'partnerships',
    filter: `id=eq.${partnershipId}`,
    onUpdate: callbacks.onUpdate,
    onDelete: callbacks.onDelete,
  });
}

/**
 * Unsubscribe and remove a channel
 */
export async function unsubscribe(channel: RealtimeChannel): Promise<void> {
  try {
    await supabase.removeChannel(channel);
    console.log('🔌 Unsubscribed from channel');
  } catch (error) {
    console.error('Error unsubscribing from channel:', error);
  }
}

/**
 * Transform raw task data from database to Task interface
 */
export function transformTask(rawTask: any) {
  return {
    id: rawTask.id,
    ownerUserId: rawTask.owner_user_id,
    title: rawTask.title,
    done: rawTask.is_done || false,
    difficulty: rawTask.difficulty || 'medium',
  };
}

/**
 * Transform raw reward data from database to Reward interface
 */
export function transformReward(rawReward: any) {
  return {
    id: rawReward.id,
    giverUserId: rawReward.giver_user_id,
    receiverUserId: rawReward.receiver_user_id,
    description: rawReward.description,
  };
}

/**
 * Transform raw session data from database
 */
export function transformSession(rawSession: any) {
  return {
    id: rawSession.id,
    title: rawSession.title,
    startTime: rawSession.start_time,
    endTime: rawSession.end_time,
    mode: rawSession.mode,
    location: rawSession.location,
    partnershipId: rawSession.partnership_id,
  };
}

