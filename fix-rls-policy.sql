-- =====================================================
-- FIX RLS POLICY cho SOLO_SESSIONS
-- Chạy file này trong Supabase SQL Editor
-- =====================================================

-- 1. Xóa policy cũ
DROP POLICY IF EXISTS "Users can create solo sessions" ON solo_sessions;
DROP POLICY IF EXISTS "Anyone can view open solo sessions" ON solo_sessions;
DROP POLICY IF EXISTS "Hosts can update own sessions" ON solo_sessions;
DROP POLICY IF EXISTS "Hosts can delete own sessions" ON solo_sessions;

-- 2. Tạo policy mới - cho phép INSERT nếu user đã đăng nhập
CREATE POLICY "Authenticated users can create solo sessions"
ON solo_sessions FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. Tạo policy SELECT - ai cũng xem được session open, hoặc session của mình
CREATE POLICY "Anyone can view open solo sessions"
ON solo_sessions FOR SELECT
USING (status = 'open' OR host_user_id = auth.uid());

-- 4. UPDATE và DELETE chỉ cho host
CREATE POLICY "Hosts can update own sessions"
ON solo_sessions FOR UPDATE
USING (host_user_id = auth.uid());

CREATE POLICY "Hosts can delete own sessions"
ON solo_sessions FOR DELETE
USING (host_user_id = auth.uid());

-- 5. Fix policy cho session_requests
DROP POLICY IF EXISTS "Users can create requests" ON session_requests;

CREATE POLICY "Authenticated users can create requests"
ON session_requests FOR INSERT
TO authenticated
WITH CHECK (true);

-- 6. Kiểm tra xem user đã có profile chưa - nếu chưa thì tạo
-- (Dành cho users đăng ký trước khi có trigger)
INSERT INTO profiles (id, display_name)
SELECT id, COALESCE(raw_user_meta_data->>'display_name', email, 'User')
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- ========== HOÀN THÀNH ==========
-- Sau khi chạy, thử tạo session lại.

