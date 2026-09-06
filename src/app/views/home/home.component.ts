import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TextRenderComponent } from '../../components/text-render/text-render.component';
import { PATH_CONFIG } from '../../configs/path';
import {
  faGitAlt,
  faFacebookMessenger,
  faTiktok,
  faInstagram,
  faInvision,
  faFacebook,
} from '@fortawesome/free-brands-svg-icons';
import { faEye, faFaceGrinHearts } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FontAwesomeModule,
    TextRenderComponent,
    MatTooltipModule,
    MatIconModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  textRuns = [
    "FULL-STACK SOFTWARE ENGINEER !",
    `I AM ${new Date().getFullYear() - 2002} YEARS OLD 🔥.`,
    'BUILDING HIGH-SCALE WEB & CLOUD 💻⚡',
    "WELCOME TO MY INTERACTIVE DIGITAL STUDIO 🚀✨"
  ];

  knolages = [
    {
      count: `${new Date().getFullYear() - 2023}+`,
      text: 'Năm Kinh Nghiệm'
    },
    {
      count: `10+`,
      text: 'Dự Án Hoàn Thành'
    },
    {
      count: `100%`,
      text: 'Clean Code & Uptime'
    },
    {
      count: `24/7`,
      text: 'Sẵn Sàng Hợp Tác'
    },
  ];

  techStack = [
    {
      category: 'Frontend Engineering',
      icon: 'code',
      gradient: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-300',
      description: 'Tối ưu Angular Signals, RxJS, Responsive Tailwind & Glassmorphism UI 4K/Mobile.',
      tags: ['Angular 18+', 'Signals', 'RxJS', 'Tailwind CSS', 'SCSS']
    },
    {
      category: 'Backend & APIs',
      icon: 'dns',
      gradient: 'from-purple-500/20 to-indigo-500/20 border-purple-500/40 text-purple-300',
      description: 'Thiết kế RESTful APIs, JWT Guards, Cấu hình Redis Cache & SQL/NoSQL Database.',
      tags: ['Node.js', 'ASP.NET Core', 'Express', 'Redis', 'PostgreSQL']
    },
    {
      category: 'DevOps & Cloud Systems',
      icon: 'cloud_queue',
      gradient: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300',
      description: 'Xây dựng AWS VPC Architecture, EC2, ECS Fargate Docker & CI/CD Pipelines.',
      tags: ['AWS VPC', 'EC2', 'Docker', 'ECS Fargate', 'Prometheus']
    },
    {
      category: 'Innovation & Automation',
      icon: 'bolt',
      gradient: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300',
      description: 'Xử lý thuật toán thông minh, tối ưu hiệu năng & trải nghiệm âm thanh tương tác.',
      tags: ['Algorithm', 'Data Processing', 'Audio Synth', 'WCAG UI']
    }
  ];

  philosophies = [
    {
      icon: 'speed',
      title: 'Tốc Độ & Hiệu Năng',
      desc: 'Tối ưu thời gian phản hồi API tính bằng mili-giây và khung hình render mượt mà 60 FPS.',
      color: 'text-amber-400 border-amber-500/30'
    },
    {
      icon: 'verified',
      title: 'Kiến Trúc Sạch',
      desc: 'Áp dụng SOLID, Modular Architecture & Clean Code tiêu chuẩn doanh nghiệp.',
      color: 'text-cyan-400 border-cyan-500/30'
    },
    {
      icon: 'cloud_done',
      title: 'Hạ Tầng Cloud Native',
      desc: 'Hệ thống hạ tầng linh hoạt trên AWS, sẵn sàng chịu tải lớn và tự phục hồi.',
      color: 'text-purple-400 border-purple-500/30'
    },
    {
      icon: 'palette',
      title: 'Trải Nghiệm Độc Đáo',
      desc: 'Hiệu ứng kính mờ Glassmorphism, âm thanh synth tương tác & chủ đề nhân vật đa dạng.',
      color: 'text-emerald-400 border-emerald-500/30'
    }
  ];

  featuredTools = [
    {
      title: '⛩️ Rút Quẻ May Mắn',
      desc: 'Công cụ lắc hũ rút quẻ linh cát tường & giải mã tử vi thần số học.',
      path: PATH_CONFIG.ABOUT_ME,
      btnText: 'Khám Phá Ngay',
      icon: 'wb_twilight',
      color: 'border-amber-500/40 text-amber-300 hover:border-amber-400'
    },
    {
      title: '📋 Quản Lý Task Board',
      desc: 'Bảng công việc Drag & Drop kéo thả linh hoạt với gợi ý vai trò tự động.',
      path: PATH_CONFIG.PROJECTS,
      btnText: 'Mở Bảng Task',
      icon: 'task_alt',
      color: 'border-cyan-500/40 text-cyan-300 hover:border-cyan-400'
    },
    {
      title: '☁️ Kiến Thức AWS VPC',
      desc: 'Tổng hợp sơ đồ kiến trúc mạng VPC, Subnet, Route Table & NAT Gateway.',
      path: PATH_CONFIG.TECH_KNOWLEDGE,
      btnText: 'Đọc Bài Viết',
      icon: 'cloud_sync',
      color: 'border-purple-500/40 text-purple-300 hover:border-purple-400'
    }
  ];

  PATH = PATH_CONFIG;

  faEye = faEye;
  faFaceGrinHearts = faFaceGrinHearts;

  icons = [
    { name: 'GitAlt', icon: faGitAlt, color: 'linear-gradient(to bottom, #f34f29, #b92e20)' },
    { name: 'FacebookMessenger', icon: faFacebookMessenger, color: 'linear-gradient(to bottom, #00b2ff, #006aff)' },
    { name: 'Tiktok', icon: faTiktok , color: 'linear-gradient(to bottom, #36c5cf, #eb0840)' },
    { name: 'Instagram', icon: faInstagram , color: 'linear-gradient(to bottom, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)' },
    { name: 'Invision', icon: faInvision , color: 'linear-gradient(to bottom, #0077b5, #004471)' },
    { name: 'Facebook', icon: faFacebook , color: 'linear-gradient(to bottom, #274a94, #0d358a)' },
  ];
}
