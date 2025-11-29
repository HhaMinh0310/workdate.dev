# Git Configuration Guide

## Cấu hình Git cho repository này

Bạn cần cấu hình Git với thông tin của bạn trước khi commit code.

### Cách 1: Sử dụng Git Command Line (nếu đã cài Git)

Mở terminal/PowerShell trong thư mục project và chạy:

```bash
git config user.email "vinhhuong688@gmail.com"
git config user.name "HhaMinh0310"
```

Hoặc cấu hình global (cho tất cả repositories):

```bash
git config --global user.email "vinhhuong688@gmail.com"
git config --global user.name "HhaMinh0310"
```

### Cách 2: Sử dụng GitHub Desktop

1. Mở GitHub Desktop
2. Vào **File** → **Options** → **Git**
3. Điền:
   - **Name**: `HhaMinh0310`
   - **Email**: `vinhhuong688@gmail.com`

### Cách 3: Chỉnh sửa file .git/config trực tiếp

Nếu repository đã được khởi tạo, bạn có thể chỉnh sửa file `.git/config` và thêm:

```ini
[user]
    email = vinhhuong688@gmail.com
    name = HhaMinh0310
```

### Kiểm tra cấu hình

Sau khi cấu hình, kiểm tra bằng lệnh:

```bash
git config user.email
git config user.name
```

Hoặc xem tất cả cấu hình:

```bash
git config --list
```

## Khởi tạo Git Repository (nếu chưa có)

Nếu repository chưa được khởi tạo, chạy:

```bash
git init
git remote add origin https://github.com/HhaMinh0310/workdate.dev.git
```

Sau đó cấu hình user như trên.

## Thông tin đã cấu hình

- **Email**: vinhhuong688@gmail.com
- **Username**: HhaMinh0310
- **Repository**: https://github.com/HhaMinh0310/workdate.dev

