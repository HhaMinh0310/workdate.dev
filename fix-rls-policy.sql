-- =====================================================
-- FIX RLS POLICIES + ADD HELPER FUNCTIONS
-- CHẠY TRONG SUPABASE SQL EDITOR
-- =====================================================

-- ========== HELPER FUNCTION: Get user by email ==========
-- Cho phép tìm user bằng email
CREATE OR REPLACE FUNCTION get_user_by_email(user_email TEXT)
RETURNS TABLE (id UUID, email TEXT) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT au.id, au.email::TEXT
  FROM auth.users au
  WHERE LOWER(au.email) = LOWER(user_email);
END;
$$ LANGUAGE plpgsql;

-- ========== FIX PROFILES ==========
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Cho phép authenticated user tạo profile cho mình
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ========== FIX PARTNERSHIPS ==========
DROP POLICY IF EXISTS "Users can view own partnerships" ON partnerships;
DROP POLICY IF EXISTS "Users can create partnerships" ON partnerships;
DROP POLICY IF EXISTS "Authenticated users can create partnerships" ON partnerships;

-- Cho phép authenticated user tạo partnership
CREATE POLICY "Authenticated users can create partnerships"
ON partnerships FOR INSERT
TO authenticated
WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());

-- Cho phép xem partnerships mà mình tham gia
CREATE POLICY "Users can view own partnerships"
ON partnerships FOR SELECT
TO authenticated
USING (user1_id = auth.uid() OR user2_id = auth.uid());

-- ========== FIX SOLO_SESSIONS ==========
DROP POLICY IF EXISTS "Users can create solo sessions" ON solo_sessions;
DROP POLICY IF EXISTS "Anyone can view open solo sessions" ON solo_sessions;
DROP POLICY IF EXISTS "Hosts can update own sessions" ON solo_sessions;
DROP POLICY IF EXISTS "Hosts can delete own sessions" ON solo_sessions;
DROP POLICY IF EXISTS "Authenticated users can create solo sessions" ON solo_sessions;

-- Cho phép authenticated user tạo solo session
CREATE POLICY "Authenticated users can create solo sessions"
ON solo_sessions FOR INSERT
TO authenticated
WITH CHECK (host_user_id = auth.uid());

-- Cho phép xem session open hoặc session của mình
CREATE POLICY "Anyone can view open solo sessions"
ON solo_sessions FOR SELECT
USING (status = 'open' OR host_user_id = auth.uid());

-- UPDATE và DELETE chỉ cho host
CREATE POLICY "Hosts can update own sessions"
ON solo_sessions FOR UPDATE
TO authenticated
USING (host_user_id = auth.uid());

CREATE POLICY "Hosts can delete own sessions"
ON solo_sessions FOR DELETE
TO authenticated
USING (host_user_id = auth.uid());

-- ========== FIX SESSION_REQUESTS ==========
DROP POLICY IF EXISTS "Users can create requests" ON session_requests;
DROP POLICY IF EXISTS "Authenticated users can create requests" ON session_requests;

CREATE POLICY "Authenticated users can create requests"
ON session_requests FOR INSERT
TO authenticated
WITH CHECK (requester_user_id = auth.uid());

-- ========== FIX COUPLE_SESSIONS ==========
DROP POLICY IF EXISTS "Users can view own couple sessions" ON couple_sessions;
DROP POLICY IF EXISTS "Users can create couple sessions" ON couple_sessions;

-- Cho phép xem couple session của partnership mình
CREATE POLICY "Users can view own couple sessions"
ON couple_sessions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM partnerships
    WHERE partnerships.id = couple_sessions.partnership_id
    AND (partnerships.user1_id = auth.uid() OR partnerships.user2_id = auth.uid())
  )
);

-- Cho phép tạo couple session cho partnership mình
CREATE POLICY "Users can create couple sessions"
ON couple_sessions FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM partnerships
    WHERE partnerships.id = partnership_id
    AND (partnerships.user1_id = auth.uid() OR partnerships.user2_id = auth.uid())
  )
);

-- ========== FIX TASKS ==========
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert tasks in own sessions" ON tasks;

CREATE POLICY "Users can insert tasks in own sessions"
ON tasks FOR INSERT
TO authenticated
WITH CHECK (
  owner_user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM couple_sessions cs
    JOIN partnerships p ON p.id = cs.partnership_id
    WHERE cs.id = session_id
    AND (p.user1_id = auth.uid() OR p.user2_id = auth.uid())
  )
);

-- ========== FIX REWARDS ==========
DROP POLICY IF EXISTS "Users can create rewards" ON rewards;
DROP POLICY IF EXISTS "Users can create rewards in own sessions" ON rewards;

CREATE POLICY "Users can create rewards in own sessions"
ON rewards FOR INSERT
TO authenticated
WITH CHECK (
  giver_user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM couple_sessions cs
    JOIN partnerships p ON p.id = cs.partnership_id
    WHERE cs.id = session_id
    AND (p.user1_id = auth.uid() OR p.user2_id = auth.uid())
  )
);

-- ========== TẠO PROFILE CHO USERS CŨ ==========
INSERT INTO profiles (id, display_name)
SELECT id, COALESCE(raw_user_meta_data->>'display_name', split_part(email::text, '@', 1), 'User')
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- ========== HOÀN THÀNH ==========
-- Sau khi chạy xong, refresh trang web và thử lại!
