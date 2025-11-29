
# Workdate.dev - MVP Documentation

Đây là tài liệu mô tả cho phiên bản MVP (Minimum Viable Product) của ứng dụng Workdate.dev. Ứng dụng này được xây dựng hoàn toàn ở frontend, sử dụng mock data để mô phỏng hoạt động của backend.

This document outlines the Minimum Viable Product (MVP) for the Workdate.dev application. This version is a frontend-only implementation that uses mock data to simulate backend functionality.

---

## 1. Core Features (Tính năng chính)

Workdate.dev được thiết kế với hai luồng người dùng chính:

1.  **Couple Mode**: Dành cho các cặp đôi muốn có một không gian làm việc chung. Họ có thể cùng nhau tạo danh sách công việc (todo list), theo dõi tiến độ của nhau và đặt ra những "phần thưởng bí mật" để tạo động lực.
2.  **Solo Mode**: Dành cho các lập trình viên độc thân muốn tìm một người bạn đồng hành để cùng làm việc. Người dùng có thể tạo một "phiên làm việc" (workdate session) công khai, hoặc duyệt qua các phiên của người khác để tìm người phù hợp và gửi yêu cầu kết đôi.

---

## 2. Technology Stack (Công nghệ sử dụng)

-   **Framework**: React
-   **Routing**: React Router (`react-router-dom`)
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **Animations**: Framer Motion
-   **State Management**: React Hooks (`useState`, `useEffect`)
-   **Mock Data**: Dữ liệu giả được lưu trong bộ nhớ dưới dạng các đối tượng JavaScript (`services/mockData.ts`) để mô phỏng API service layer.

---

## 3. Application Flow (Luồng hoạt động của ứng dụng)

Luồng hoạt động của người dùng được phân chia rõ ràng giữa hai chế độ.

### 3.1. Landing Page (`/`)

-   Đây là trang đầu tiên người dùng nhìn thấy.
-   Cung cấp hai lựa chọn chính: **Couple Mode** và **Solo Mode**.

### 3.2. Couple Mode Flow

1.  **Couple Dashboard (`/couple`)**:
    -   Hiển thị danh sách các phiên làm việc (workdate) đã được lên lịch.
    -   Mỗi session card hiển thị thông tin tóm tắt như tiêu đề, thời gian, và trạng thái (Online/Offline).
    -   Người dùng có thể nhấp vào một phiên để vào "phòng làm việc" hoặc nhấp vào nút "New Session" để tạo một phiên mới.

2.  **Create Couple Session (`/couple/create`)**:
    -   Một biểu mẫu cho phép cặp đôi lên lịch một buổi làm việc mới.
    -   Các trường thông tin bao gồm: Tiêu đề, Thời gian bắt đầu, Thời lượng, Chế độ (Online/Offline), và Địa điểm (nếu là Offline).
    -   Sau khi gửi, phiên mới sẽ được thêm vào đầu danh sách trên trang Dashboard.

3.  **Couple Session Room (`/couple/session/:id`)**:
    -   Đây là không gian làm việc chính. Giao diện được chia thành hai cột trên desktop ("My Focus" và "Partner's Focus") hoặc hai tab trên mobile.
    -   **My Focus**: Người dùng có thể thêm, sửa, xóa, và đánh dấu hoàn thành các công việc của mình. Họ cũng có thể thay đổi độ khó của công việc.
    -   **Partner's Focus**: Hiển thị danh sách công việc của đối tác ở chế độ chỉ đọc.
    -   **Reward System**:
        -   Người dùng có thể đặt một "phần thưởng bí mật" cho đối tác của mình. Phần thưởng này sẽ bị ẩn đi đối với người nhận.
        -   Họ cũng sẽ thấy một thẻ "Mystery Reward" bị khóa, tượng trưng cho phần thưởng mà đối tác đã đặt cho họ.

### 3.3. Solo Mode Flow

1.  **Solo Dashboard (`/solo`)**:
    -   Trang điều hướng đơn giản, cho phép người dùng chọn giữa "Browse Sessions" (tìm phiên làm việc) hoặc "Host a Session" (tạo phiên làm việc).

2.  **Create Solo Session (`/solo/create`)**:
    -   Một biểu mẫu chi tiết để người dùng tạo một phiên làm việc công khai.
    -   Các trường thông tin bao gồm:
        -   **Session Details**: Tiêu đề, thời gian, chế độ (Online/Offline), địa điểm.
        -   **Work Details**: Ngôn ngữ/công nghệ đang làm việc (tech stack), mô tả ngắn về mục tiêu.
        -   **Partner Preferences**: Yêu cầu về trình độ và "vibe" (phong cách làm việc) của người bạn đồng hành.
    -   Sau khi tạo, phiên này sẽ xuất hiện trong trang "Explore Sessions" cho người khác thấy.

3.  **Browse Solo Sessions (`/solo/browse`)**:
    -   Hiển thị một lưới (grid) các phiên làm việc do những người dùng khác tạo.
    -   Người dùng có thể nhấp vào bất kỳ thẻ session nào để mở một cửa sổ modal xem thông tin chi tiết.
    -   Modal hiển thị đầy đủ thông tin về người host, mục tiêu phiên làm việc, và yêu cầu đối tác.
    -   Ở cuối modal có nút "Request Workdate" để gửi yêu cầu kết đôi (hiện tại chỉ là hành động mô phỏng).

---

## 4. Proposed Backend & Database Schema (Cấu trúc Backend và Database đề xuất)

Hiện tại ứng dụng sử dụng mock data. Để xây dựng một phiên bản hoàn chỉnh, dưới đây là cấu trúc cơ sở dữ liệu và API được đề xuất.

### 4.1. Database Schema

Sử dụng cơ sở dữ liệu quan hệ (PostgreSQL, MySQL) hoặc NoSQL (MongoDB).

**1. `users` table**
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | ID định danh người dùng |
| `email` | VARCHAR | UNIQUE, NOT NULL | Email đăng nhập |
| `password_hash`| VARCHAR | NOT NULL | Mật khẩu đã được mã hóa |
| `display_name` | VARCHAR | NOT NULL | Tên hiển thị |
| `avatar_url` | VARCHAR | | URL ảnh đại diện |
| `created_at` | TIMESTAMP | | Thời gian tạo tài khoản |

**2. `partnerships` table (để liên kết cặp đôi)**
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | ID của mối quan hệ |
| `user1_id` | UUID | FK -> users.id | ID người dùng thứ nhất |
| `user2_id` | UUID | FK -> users.id | ID người dùng thứ hai |
| `status` | ENUM | 'active', 'pending' | Trạng thái mối quan hệ |
| `created_at` | TIMESTAMP | | |

**3. `couple_sessions` table**
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | ID của phiên làm việc |
| `partnership_id`| UUID | FK -> partnerships.id | Liên kết với cặp đôi |
| `title` | VARCHAR | NOT NULL | Tiêu đề phiên |
| `start_time` | TIMESTAMP | NOT NULL | Thời gian bắt đầu |
| `end_time` | TIMESTAMP | | Thời gian kết thúc |
| `mode` | ENUM | 'online', 'offline' | |
| `location` | VARCHAR | | Địa điểm (nếu offline) |

**4. `tasks` table**
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | ID công việc |
| `session_id` | UUID | FK -> couple_sessions.id | Thuộc về phiên làm việc nào |
| `owner_user_id`| UUID | FK -> users.id | Người sở hữu công việc |
| `title` | VARCHAR | NOT NULL | Tên công việc |
| `is_done` | BOOLEAN | DEFAULT false | Trạng thái hoàn thành |
| `difficulty` | ENUM | 'easy', 'medium', 'hard'| Độ khó |

**5. `rewards` table**
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | |
| `session_id` | UUID | FK -> couple_sessions.id | |
| `giver_user_id`| UUID | FK -> users.id | Người đặt phần thưởng |
| `receiver_user_id`| UUID | FK -> users.id | Người nhận phần thưởng |
| `description`| TEXT | NOT NULL | Nội dung phần thưởng |

**6. `solo_sessions` table**
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | |
| `host_user_id` | UUID | FK -> users.id | Người tạo phiên |
| `title` | VARCHAR | NOT NULL | |
| `date` | DATE | NOT NULL | |
| `start_time` | TIME | NOT NULL | |
| `end_time` | TIME | | |
| `mode` | ENUM | 'online', 'offline' | |
| `location` | VARCHAR | | |
| `description`| TEXT | | Mô tả công việc, mục tiêu |
| `tech_stack` | JSONB / TEXT[] | | Các công nghệ sử dụng |
| `partner_prefs`| JSONB | | Yêu cầu về đối tác |
| `status` | ENUM | 'open', 'matched', 'closed'| Trạng thái phiên |

**7. `session_requests` table (quản lý yêu cầu kết đôi)**
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | |
| `solo_session_id` | UUID | FK -> solo_sessions.id | |
| `requester_user_id`| UUID | FK -> users.id | Người gửi yêu cầu |
| `status` | ENUM | 'pending', 'accepted', 'rejected' | |

### 4.2. Proposed API Endpoints (Gợi ý API)

-   **Auth**:
    -   `POST /api/auth/register`
    -   `POST /api/auth/login`
    -   `GET /api/auth/me`
-   **Couple Sessions**:
    -   `GET /api/couple/sessions`
    -   `POST /api/couple/sessions`
    -   `GET /api/couple/sessions/:id` (bao gồm tasks và rewards)
    -   `POST /api/couple/sessions/:id/tasks`
    -   `PUT /api/tasks/:taskId` (cập nhật trạng thái, độ khó)
    -   `DELETE /api/tasks/:taskId`
    -   `POST /api/couple/sessions/:id/rewards`
-   **Solo Sessions**:
    -   `GET /api/solo/sessions` (có thể filter)
    -   `POST /api/solo/sessions`
    -   `GET /api/solo/sessions/:id`
    -   `POST /api/solo/sessions/:id/request` (gửi yêu cầu tham gia)

---

## 5. How to Run (Cách chạy ứng dụng)

Vì đây là một dự án frontend tĩnh không cần quá trình build, bạn chỉ cần:

1.  Clone a repository (if applicable) or have the files locally.
2.  Mở file `index.html` trực tiếp bằng trình duyệt web.

The application will run, and all functionality will be powered by the mock data defined in the source code.
