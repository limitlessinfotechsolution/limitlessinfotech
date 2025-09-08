// lib/database.ts
import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

// Note: Supabase client may be a mock if environment variables are not set

// Re-export supabase client
export { supabase };

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'employee' | 'client';
  createdAt: Date;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  assigned_to: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'review';
  due_date: string;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: 'task' | 'meeting' | 'message' | 'system' | 'approval';
  title: string;
  message: string;
  action_url?: string;
  read: boolean;
  timestamp: string;
};

export type ApprovalRequest = {
  id: string;
  title: string;
  description: string;
  requested_by: string;
  project_id: string;
  type: 'design' | 'code' | 'deployment' | 'hotfix' | 'feature';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-review' | 'approved' | 'rejected' | 'changes-requested';
  due_date: string;
  assigned_to: string[];
  approval_steps: ApprovalStep[];
  comments: ApprovalComment[];
  files?: string[];
  changes?: string[];
  client_visible: boolean;
  requested_at: string;
  updated_at: string;
};

export type ApprovalStep = {
  id: string;
  step_number: number;
  title: string;
  description: string;
  assigned_to: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  required: boolean;
  comments?: string;
  completed_at?: string;
};

export type ApprovalComment = {
  id: string;
  author_id: string;
  content: string;
  type: 'comment' | 'approval' | 'rejection' | 'change-request';
  timestamp: string;
};

export class DatabaseService {
  static async getTasksByAssignedTo(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .contains('assigned_to', [userId]);

    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }

    return data || [];
  }

  static async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    return data || [];
  }

  static async createNotification(notification: Omit<Notification, 'id' | 'timestamp'>): Promise<Notification | null> {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        id: uuidv4(),
        ...notification,
        timestamp: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return null;
    }

    return data;
  }

  static async updateNotification(notificationId: string, updates: Partial<Notification>): Promise<Notification | null> {
    const { data, error } = await supabase
      .from('notifications')
      .update(updates)
      .eq('id', notificationId)
      .select()
      .single();

    if (error) {
      console.error('Error updating notification:', error);
      return null;
    }

    return data;
  }

  static async getApprovalRequests(): Promise<ApprovalRequest[]> {
    const { data, error } = await supabase
      .from('approval_requests')
      .select('*')
      .order('requested_at', { ascending: false });

    if (error) {
      console.error('Error fetching approval requests:', error);
      return [];
    }

    return data || [];
  }

  static async updateApprovalRequest(requestId: string, updates: Partial<ApprovalRequest>): Promise<ApprovalRequest | null> {
    const { data, error } = await supabase
      .from('approval_requests')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      console.error('Error updating approval request:', error);
      return null;
    }

    return data;
  }
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: 'No rows found'
    return null;
  }

  return data;
};

export const createUser = async (email: string, passwordHash: string): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert([{ id: uuidv4(), email, passwordHash, created_at: new Date() }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
