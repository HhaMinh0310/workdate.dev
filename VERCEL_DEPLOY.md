# Hướng dẫn Deploy lên Vercel

## Bước 1: Push code lên GitHub
Đảm bảo code đã được push lên GitHub repository: `https://github.com/HhaMinh0310/workdate.dev`

## Bước 2: Deploy trên Vercel

1. Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng GitHub
2. Click **"Add New Project"**
3. Import repository `HhaMinh0310/workdate.dev`
4. Vercel sẽ tự động detect Vite project

## Bước 3: Cấu hình Build Settings

Vercel sẽ tự động detect, nhưng đảm bảo:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Bước 4: Thêm Environment Variables

Trong Vercel project settings → **Environment Variables**, thêm:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Lưu ý**: Thay `your_supabase_project_url` và `your_supabase_anon_key` bằng giá trị thực từ Supabase project của bạn.

## Bước 5: Deploy

Click **"Deploy"** và đợi build hoàn tất.

## Troubleshooting

### Trang trống sau khi deploy

1. **Kiểm tra Console**: Mở Developer Tools → Console để xem lỗi
2. **Kiểm tra Environment Variables**: Đảm bảo đã set đúng trong Vercel
3. **Kiểm tra Build Logs**: Xem build logs trong Vercel dashboard để tìm lỗi
4. **Kiểm tra Network Tab**: Xem có request nào fail không

### Lỗi "Missing Supabase environment variables"

- Đảm bảo đã thêm `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` trong Vercel
- Redeploy sau khi thêm environment variables

### Routing không hoạt động

- File `vercel.json` đã được tạo với cấu hình rewrite đúng
- Đảm bảo đã chuyển từ `HashRouter` sang `BrowserRouter` trong App.tsx

### Build fails

- Kiểm tra `package.json` có đầy đủ dependencies
- Đảm bảo Node.js version phù hợp (Vercel tự động detect)

## Sau khi deploy

1. Vercel sẽ cung cấp URL: `https://your-project.vercel.app`
2. Test tất cả features:
   - Authentication (Register/Login)
   - Solo Mode (Browse/Create sessions)
   - Couple Mode (sau khi setup partnership)

## Custom Domain (Optional)

Trong Vercel project settings → **Domains**, bạn có thể thêm custom domain nếu có.

