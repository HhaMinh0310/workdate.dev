-- Workdate.dev Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- 1. Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'focus')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Create partnerships table
CREATE TABLE partnerships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id != user2_id)
);

-- 3. Create couple_sessions table
CREATE TABLE couple_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partnership_id UUID REFERENCES partnerships(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  mode TEXT CHECK (mode IN ('online', 'offline')),
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES couple_sessions(id) ON DELETE CASCADE NOT NULL,
  owner_user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  is_done BOOLEAN DEFAULT false,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create rewards table
CREATE TABLE rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES couple_sessions(id) ON DELETE CASCADE NOT NULL,
  giver_user_id UUID REFERENCES profiles(id) NOT NULL,
  receiver_user_id UUID REFERENCES profiles(id) NOT NULL,
  description TEXT NOT NULL,
  is_revealed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create solo_sessions table
CREATE TABLE solo_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  host_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  mode TEXT CHECK (mode IN ('online', 'offline')),
  location TEXT,
  description TEXT,
  tech_stack JSONB DEFAULT '[]'::jsonb,
  partner_prefs JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'matched', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create session_requests table
CREATE TABLE session_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  solo_session_id UUID REFERENCES solo_sessions(id) ON DELETE CASCADE NOT NULL,
  requester_user_id UUID REFERENCES profiles(id) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(solo_session_id, requester_user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE solo_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- RLS Policies for partnerships
CREATE POLICY "Users can view own partnerships"
ON partnerships FOR SELECT
USING (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can create partnerships"
ON partnerships FOR INSERT
WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());

-- RLS Policies for couple_sessions
CREATE POLICY "Users can view own couple sessions"
ON couple_sessions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM partnerships
    WHERE partnerships.id = couple_sessions.partnership_id
    AND (partnerships.user1_id = auth.uid() OR partnerships.user2_id = auth.uid())
  )
);

CREATE POLICY "Users can create couple sessions"
ON couple_sessions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM partnerships
    WHERE partnerships.id = couple_sessions.partnership_id
    AND (partnerships.user1_id = auth.uid() OR partnerships.user2_id = auth.uid())
  )
);

-- RLS Policies for tasks
CREATE POLICY "Users can view tasks in own sessions"
ON tasks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM couple_sessions cs
    JOIN partnerships p ON p.id = cs.partnership_id
    WHERE cs.id = tasks.session_id
    AND (p.user1_id = auth.uid() OR p.user2_id = auth.uid())
  )
);

CREATE POLICY "Users can manage own tasks"
ON tasks FOR ALL
USING (owner_user_id = auth.uid())
WITH CHECK (owner_user_id = auth.uid());

-- RLS Policies for rewards
CREATE POLICY "Users can view own rewards"
ON rewards FOR SELECT
USING (giver_user_id = auth.uid() OR receiver_user_id = auth.uid());

CREATE POLICY "Users can create rewards"
ON rewards FOR INSERT
WITH CHECK (giver_user_id = auth.uid());

CREATE POLICY "Givers can update rewards"
ON rewards FOR UPDATE
USING (giver_user_id = auth.uid());

-- RLS Policies for solo_sessions
CREATE POLICY "Anyone can view open solo sessions"
ON solo_sessions FOR SELECT
USING (status = 'open' OR host_user_id = auth.uid());

CREATE POLICY "Users can create solo sessions"
ON solo_sessions FOR INSERT
WITH CHECK (host_user_id = auth.uid());

CREATE POLICY "Hosts can manage own sessions"
ON solo_sessions FOR ALL
USING (host_user_id = auth.uid())
WITH CHECK (host_user_id = auth.uid());

-- RLS Policies for session_requests
CREATE POLICY "Users can view own requests"
ON session_requests FOR SELECT
USING (
  requester_user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM solo_sessions
    WHERE solo_sessions.id = session_requests.solo_session_id
    AND solo_sessions.host_user_id = auth.uid()
  )
);

CREATE POLICY "Users can create requests"
ON session_requests FOR INSERT
WITH CHECK (requester_user_id = auth.uid());

CREATE POLICY "Hosts can update request status"
ON session_requests FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM solo_sessions
    WHERE solo_sessions.id = session_requests.solo_session_id
    AND solo_sessions.host_user_id = auth.uid()
  )
);

