# Supabase Setup Guide for Workdate.dev

This guide will help you set up Supabase for the Workdate.dev application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: `workdate-dev` (or your preferred name)
   - **Database Password**: Create a strong password (save it securely)
   - **Region**: Choose the region closest to you (e.g., Southeast Asia)
4. Wait for the project to be created (2-3 minutes)

## Step 2: Get API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: Keep this secret (only for admin operations)

## Step 3: Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste the entire contents of `supabase-schema.sql` file
4. Click **"Run"** to execute the SQL
5. Verify tables were created by going to **Table Editor** - you should see:
   - `profiles`
   - `partnerships`
   - `couple_sessions`
   - `tasks`
   - `rewards`
   - `solo_sessions`
   - `session_requests`

## Step 4: Configure Environment Variables

1. In your project root, create a `.env` file (if it doesn't exist)
2. Add the following:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace the values with your actual Supabase project URL and anon key from Step 2.

**Important**: Never commit the `.env` file to git. It's already in `.gitignore`.

## Step 5: Install Dependencies

If you haven't already, install the Supabase client:

```bash
npm install @supabase/supabase-js
```

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/register`
3. Create a test account
4. Check Supabase dashboard → **Authentication** → **Users** to verify the user was created
5. Check **Table Editor** → **profiles** to verify the profile was auto-created

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure your `.env` file exists in the project root
- Verify the variable names are exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your dev server after creating/updating `.env`

### RLS Policy errors
- Make sure you ran all the SQL from `supabase-schema.sql`
- Check that Row Level Security is enabled on all tables
- Verify policies were created in **Authentication** → **Policies**

### Profile not created on signup
- Check the trigger was created: `on_auth_user_created`
- Verify the function `handle_new_user()` exists
- Check Supabase logs for errors

## Next Steps

After setup, you can:
- Create partnerships between users (for Couple Mode)
- Create solo sessions (for Solo Mode)
- Test the full authentication flow

## Notes

- The free tier includes 500MB database storage and 2GB bandwidth/month
- All data is secured with Row Level Security (RLS) policies
- The `anon` key is safe to expose in frontend code (RLS protects your data)
- Never expose the `service_role` key in frontend code

