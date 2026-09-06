export interface ProjectItem {
  id: string;
  category: 'real-world' | 'academic';
  title: string;
  subtitle?: string;
  company?: string;
  companyUrl?: string;
  projectPath?: string;
  stageName: string;
  period: string;
  role: string;
  teamSize?: number;
  highlightBadge?: string;
  techStack: string[];
  devopsStack?: string[];
  features: string[];
  summary: string;
  demoUrl?: string;
  githubUrl?: string;
  isFeatured?: boolean;
}

export const WORK_STAGES = [
  { id: 'stage-4', title: 'Giai Đoạn 4: 360 Real Estate & Cloud DevOps Era', period: '02/2026 - Hiện tại', company: 'Enterprise NAO & ETC Technology' },
  { id: 'stage-3', title: 'Giai Đoạn 3: Aviation & Industrial Realtime Control Systems', period: '05/2025 - 02/2026', company: 'FPT Software & ETC Technology' },
  { id: 'stage-2', title: 'Giai Đoạn 2: Enterprise Dashboard & Operations Systems', period: '11/2024 - 05/2025', company: 'FPT Software' },
  { id: 'stage-1', title: 'Giai Đoạn 1: Nền Tảng Đại Học & Dự Án Nghiên Cứu', period: '2020 - 2025', company: 'SaoDo University' },
];

export const PROJECTS_TIMELINE_DATA: ProjectItem[] = [
  {
    id: 'landbase-360',
    category: 'real-world',
    title: 'Landbase 360 - Bất Động Sản 360 VR (Landbase Web)',
    subtitle: 'Nền tảng Quản lý & Trải nghiệm Bất Động Sản 360 Độ Tương Tác',
    company: 'Enterprise NAO',
    companyUrl: 'https://enterprisenao.com/vi',
    projectPath: 'E:\\ID_PTS\\ENAO\\landbase-web',
    stageName: 'Giai Đoạn 4: 360 Real Estate & Cloud DevOps Era',
    period: '02/2026 - Hiện tại',
    role: 'Frontend Developer & DevOps Integration Specialist',
    teamSize: 32,
    isFeatured: true,
    highlightBadge: '🌟 DỰ ÁN TRỌNG ĐIỂM DOANH NGHIỆP 360',
    techStack: ['Angular 19', 'Three.js / WebXR', 'KonvaJS', 'ABP .NET Core', 'Oracle / PostgreSQL', 'Tailwind CSS'],
    devopsStack: ['Docker', 'Kubernetes (K8s)', 'AWS S3 / CloudFront', 'CI/CD Pipeline', 'NGINX'],
    summary: 'Hệ thống quản lý bất động sản 360 cao cấp tích hợp bản đồ quy hoạch GIS, tour thực tế ảo 360 VR panorama, xem mô hình 3D tòa nhà và quản lý hợp đồng mua bán tự động.',
    features: [
      'Trải nghiệm tour ảo 360 VR Panorama siêu mượt trên WebXR và Three.js.',
      'Tích hợp bản đồ GIS quy hoạch bất động sản tương tác đa tầng dữ liệu.',
      'Số hóa quản lý dự án, danh mục căn hộ, tình trạng đặt cọc theo thời gian thực.',
      'Containerize ứng dụng với Docker & triển khai tự động trên Kubernetes (K8s) & AWS.'
    ]
  },
  {
    id: 'detention-center-mgmt',
    category: 'real-world',
    title: 'Hệ Thống Quản Lý Trại Giam Doanh Nghiệp (Web App)',
    subtitle: 'Hệ thống quản trị nghiệp vụ hành chính cho cơ quan nhà nước',
    company: 'ETC Technology',
    stageName: 'Giai Đoạn 4: 360 Real Estate & Cloud DevOps Era',
    period: '02/2026 - Hiện tại',
    role: 'Software Developer (Fullstack)',
    teamSize: 32,
    techStack: ['Angular', 'ABP .NET Core (Rezo)', 'PrimeNG', 'Chart.js', 'Oracle'],
    devopsStack: ['Docker Container', 'IIS / NGINX Server'],
    summary: 'Phát triển các module nghiệp vụ phức tạp, xử lý dữ liệu bảng biểu lớn và báo cáo trực quan cho hệ thống quản lý chuyên dụng.',
    features: [
      'Sử dụng Code Generation của ABP .NET Core Rezo để tăng tốc phát triển module.',
      'Phát triển tính năng chỉnh sửa dữ liệu trực tiếp trên bảng (inline edit) tương tự Excel.',
      'Tối ưu truy vấn dữ liệu lớn, tăng tốc phản hồi UI và nâng cao trải nghiệm người dùng.'
    ]
  },
  {
    id: 'air-cargo-system',
    category: 'real-world',
    title: 'Hệ Thống Xử Lý Nghiệp Vụ Hàng Không (Air Cargo)',
    subtitle: 'Quản lý quy trình vận chuyển và khai thác kho hàng không',
    company: 'ETC Technology',
    stageName: 'Giai Đoạn 3: Aviation & Industrial Realtime Control Systems',
    period: '11/2025 - 02/2026',
    role: 'Software Developer (Fullstack)',
    teamSize: 28,
    techStack: ['Angular', 'ABP .NET Core', 'SQL Server', 'Excel Integration'],
    devopsStack: ['Docker', 'AWS EC2 Deployment'],
    summary: 'Xử lý quy trình xuất nhập kho hàng không, đọc/ghi tập tin Excel dung lượng lớn và kiểm tra tính hợp lệ của dữ liệu hàng hóa.',
    features: [
      'Phát triển màn hình nghiệp vụ tải lên và xử lý tập tin Excel dung lượng lớn.',
      'Tối ưu hóa luồng dữ liệu frontend & backend cho quy trình khai báo hàng hóa.',
      'Trực tiếp sửa lỗi UI/UX và logic backend, đảm bảo hệ thống vận hành 24/7.'
    ]
  },
  {
    id: 'industrial-water-control',
    category: 'real-world',
    title: 'Hệ Thống Điều Khiển Van Nước Công Nghiệp',
    subtitle: 'Dashboard giám sát sơ đồ mạng lưới và điều khiển thiết bị IoT thời gian thực',
    company: 'FPT Software',
    stageName: 'Giai Đoạn 3: Aviation & Industrial Realtime Control Systems',
    period: '05/2025 - 11/2025',
    role: 'Frontend Developer',
    teamSize: 30,
    techStack: ['KonvaJS', 'Angular', 'WebSocket', 'Ant Design', 'Chart.js', 'RxJS'],
    devopsStack: ['Docker', 'Kubernetes'],
    summary: 'Xây dựng đường ống sơ đồ tương tác bằng KonvaJS (kéo thả, vẽ, chỉnh sửa) và nhận cảnh báo WebSocket thời gian thực.',
    features: [
      'Vẽ sơ đồ mạng lưới đường ống nước tương tác kéo thả độ chính xác cao bằng KonvaJS.',
      'Tích hợp WebSocket nhận dữ liệu áp suất/lưu lượng và đưa ra cảnh báo tức thì.',
      'Tối ưu hiệu suất render bằng memoization và lazy loading đối với sơ đồ cực lớn.'
    ]
  },
  {
    id: 'warehouse-logistics',
    category: 'real-world',
    title: 'Hệ Thống Quản Lý & Giám Sát Vận Hành Kho Hàng',
    subtitle: 'Dashboard phân tích dữ liệu kho và theo dõi container xuất nhập',
    company: 'FPT Software',
    stageName: 'Giai Đoạn 2: Enterprise Dashboard & Operations Systems',
    period: '11/2024 - 05/2025',
    role: 'Frontend & Backend Developer',
    teamSize: 34,
    techStack: ['ReactJS', 'TypeScript', 'ASP.NET Core Web API', 'PostgreSQL', 'JWT'],
    devopsStack: ['Docker Containerization', 'AWS S3 Bucket'],
    summary: 'Phát triển hệ thống quản lý tổng thể cho doanh nghiệp vận tải kho cảng, theo dõi lô hàng container và phân quyền người dùng.',
    features: [
      'Viết API RESTful ASP.NET Core cho hệ thống đơn hàng và kiểm kê kho.',
      'Xây dựng các biểu đồ thống kê Chart.js tương tác phân tích hiệu suất khai thác cảng.',
      'Viết truy vấn RAW SQL phức tạp hợp lệ CTE và bộ lọc tìm kiếm động.'
    ]
  },

  // Academic / School Projects
  {
    id: 'fashion-shop-ai',
    category: 'academic',
    title: 'Nền Tảng Thời Trang Tích Hợp AI Recommendation',
    subtitle: 'Dự án đồ án tốt nghiệp đại học tích hợp thuật toán gợi ý AI',
    company: 'SaoDo University',
    stageName: 'Giai Đoạn 1: Nền Tảng Đại Học & Dự Án Nghiên Cứu',
    period: '02/2021 - 05/2021',
    role: 'Sole Developer (100%)',
    techStack: ['Next.js', 'Node.js', 'MongoDB', 'Surprise AI', 'Redux Toolkit', 'VNPay'],
    summary: 'E-commerce thương mại điện tử tích hợp vòng quay may mắn, thanh toán trực tuyến VNPay và hệ thống gợi ý sản phẩm cá nhân hóa bằng thuật toán Surprise AI.',
    features: [
      'Hệ thống gợi ý sản phẩm thông minh dựa trên lịch sử xem và sở thích người dùng.',
      'Tích hợp cổng thanh toán VNPay và bình luận thời gian thực.',
      'Vòng quay may mắn nhận mã giảm giá và tối ưu hóa SEO bài viết.'
    ]
  },
  {
    id: 'smart-irrigation-iot',
    category: 'academic',
    title: 'Ứng Dụng Nông Nghiệp Thông Minh IoT (Smart Irrigation)',
    subtitle: 'Hệ thống tự động tưới nước theo độ ẩm đất & nhiệt độ môi trường',
    company: 'SaoDo University',
    stageName: 'Giai Đoạn 1: Nền Tảng Đại Học & Dự Án Nghiên Cứu',
    period: '06/2021 - 07/2021',
    role: 'Sole Developer (100%)',
    techStack: ['C++', 'ESP-32', 'Arduino IDE', 'Blynk App', 'Temperature & Soil Sensors'],
    summary: 'Giải pháp phần cứng & ứng dụng di động tự động bật/tắt van tưới cây dựa trên dữ liệu cảm biến thời gian thực.',
    features: [
      'Tự động kích hoạt rơ-le tưới nước khi độ ẩm đất xuống dưới ngưỡng quy định.',
      'Theo dõi nhiệt độ, độ ẩm môi trường trực tiếp từ xa trên điện thoại di động.'
    ]
  },
  {
    id: 'student-portal-app',
    category: 'academic',
    title: 'Cổng Thông Tin Sinh Viên & Giảng Viên (Student Portal Mobile)',
    subtitle: 'Ứng dụng di động quản lý thời khóa biểu, điểm số và thông báo',
    company: 'SaoDo University',
    stageName: 'Giai Đoạn 1: Nền Tảng Đại Học & Dự Án Nghiên Cứu',
    period: '07/2021 - 10/2021',
    role: 'Sole Developer (100%)',
    techStack: ['Android Studio', 'Java', 'PHP Backend API', 'Volley', 'RecyclerView'],
    summary: 'Mobile app phục vụ sinh viên và nhà trường tra cứu lịch học, xem bảng điểm và nhận thông báo phân quyền.',
    features: [
      'Phân quyền tài khoản giảng viên và sinh viên toàn trường.',
      'Hiển thị lịch học linh hoạt theo ngày, tháng, môn học và giảng viên.'
    ]
  }
];
