-- =====================================================
-- FIX RLS POLICIES - CHẠY TRONG SUPABASE SQL EDITOR
-- =====================================================

-- ========== FIX PARTNERSHIPS ==========
DROP POLICY IF EXISTS "Users can view own partnerships" ON partnerships;
DROP POLICY IF EXISTS "Users can create partnerships" ON partnerships;

-- Cho phép authenticated user tạo partnership
CREATE POLICY "Authenticated users can create partnerships"
ON partnerships FOR INSERT
TO authenticated
WITH CHECK (true);

-- Cho phép xem partnerships mà mình tham gia
CREATE POLICY "Users can view own partnerships"
ON partnerships FOR SELECT
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
WITH CHECK (true);

-- Cho phép xem session open hoặc session của mình
CREATE POLICY "Anyone can view open solo sessions"
ON solo_sessions FOR SELECT
USING (status = 'open' OR host_user_id = auth.uid());

-- UPDATE và DELETE chỉ cho host
CREATE POLICY "Hosts can update own sessions"
ON solo_sessions FOR UPDATE
USING (host_user_id = auth.uid());

CREATE POLICY "Hosts can delete own sessions"
ON solo_sessions FOR DELETE
USING (host_user_id = auth.uid());

-- ========== FIX SESSION_REQUESTS ==========
DROP POLICY IF EXISTS "Users can create requests" ON session_requests;
DROP POLICY IF EXISTS "Authenticated users can create requests" ON session_requests;

CREATE POLICY "Authenticated users can create requests"
ON session_requests FOR INSERT
TO authenticated
WITH CHECK (true);

-- ========== FIX COUPLE_SESSIONS ==========
DROP POLICY IF EXISTS "Users can view own couple sessions" ON couple_sessions;
DROP POLICY IF EXISTS "Users can create couple sessions" ON couple_sessions;

-- Cho phép xem couple session của partnership mình
CREATE POLICY "Users can view own couple sessions"
ON couple_sessions FOR SELECT
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

CREATE POLICY "Users can insert tasks in own sessions"
ON tasks FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM couple_sessions cs
    JOIN partnerships p ON p.id = cs.partnership_id
    WHERE cs.id = session_id
    AND (p.user1_id = auth.uid() OR p.user2_id = auth.uid())
  )
);

-- ========== FIX REWARDS ==========
DROP POLICY IF EXISTS "Users can create rewards" ON rewards;

CREATE POLICY "Users can create rewards in own sessions"
ON rewards FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM couple_sessions cs
    JOIN partnerships p ON p.id = cs.partnership_id
    WHERE cs.id = session_id
    AND (p.user1_id = auth.uid() OR p.user2_id = auth.uid())
  )
);

-- ========== TẠO PROFILE CHO USERS CŨ ==========
-- (Nếu có users đăng ký trước khi có trigger)
INSERT INTO profiles (id, display_name)
SELECT id, COALESCE(raw_user_meta_data->>'display_name', email, 'User')
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- ========== HOÀN THÀNH ==========
-- Sau khi chạy xong, thử tạo session lại!
