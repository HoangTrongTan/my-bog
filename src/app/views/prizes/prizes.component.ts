import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AudioService } from '../../services/audio.service';

export interface PrizeItem {
  id: string;
  rank: string;
  rankEn: string;
  badgeType: 'third' | 'consolation';
  date: string;
  contest: string;
  institution: string;
  title: string;
  titleEn: string;
  description: string;
  impact: string;
  techStack: string[];
  qaHighlights?: string[];
  icon: string;
  colorScheme: {
    bgGradient: string;
    borderColor: string;
    badgeBg: string;
    textColor: string;
    glowColor: string;
  };
}

@Component({
  selector: 'app-prizes',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './prizes.component.html',
  styleUrl: './prizes.component.scss',
})
export class PrizesComponent {
  public audioService = inject(AudioService);

  public selectedPrize = signal<PrizeItem | null>(null);
  public activeFilter = signal<'all' | 'third' | 'consolation'>('all');

  public prizes: PrizeItem[] = [
    {
      id: 'sao-do-portal',
      rank: 'GIẢI BA',
      rankEn: 'THIRD PRIZE',
      badgeType: 'third',
      date: '31/05/2023',
      contest: 'Cuộc thi "Sáng Tạo Khoa Học và Công Nghệ"',
      institution: 'Trường Đại Học Sao Đỏ',
      title: 'Phần mềm Cổng thông tin Trường Đại học Sao Đỏ trên thiết bị di động',
      titleEn: 'Sao Do University Information Portal software on smartphones',
      description:
        'Nghiên cứu, thiết kế và xây dựng phần mềm Cổng thông tin điện tử tích hợp trên thiết bị di động (smartphone). Ứng dụng giúp hàng nghìn sinh viên và giảng viên tra cứu thời khóa biểu, kết quả học tập, thông báo nhà trường và các dịch vụ trực tuyến mọi lúc mọi nơi.',
      impact:
        'Giải pháp đạt vị trí Giải Ba xuất sắc cấp Trường, tối ưu hóa trải nghiệm truy cập thông tin nhà trường trên nền tảng di động với giao diện thân thiện và tốc độ phản hồi vượt trội.',
      techStack: [
        'Mobile Application',
        'Android / iOS UI',
        'RESTful API',
        'Smart Portal',
        'UX/UI Optimization',
      ],
      icon: 'military_tech',
      colorScheme: {
        bgGradient: 'from-amber-500/20 via-slate-900/90 to-yellow-950/40',
        borderColor: 'border-amber-400/60',
        badgeBg: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950',
        textColor: 'text-amber-400',
        glowColor: 'rgba(245, 158, 11, 0.35)',
      },
    },
    {
      id: 'dsa-quiz-qa',
      rank: 'GIẢI KHUYẾN KHÍCH',
      rankEn: 'CONSOLATION PRIZE',
      badgeType: 'consolation',
      date: '31/05/2023',
      contest: 'Cuộc thi "Sáng Tạo Khoa Học và Công Nghệ"',
      institution: 'Trường Đại Học Sao Đỏ',
      title:
        'Phần mềm ôn thi trắc nghiệm học phần Cấu trúc dữ liệu và Giải thuật & Kiểm thử phần mềm trên smartphone',
      titleEn:
        'Multiple-choice exam review software for the Data Structures and Algorithms module. Testing and ensuring software quality on smartphones.',
      description:
        'Phát triển ứng dụng ôn luyện kiến thức Cấu Trúc Dữ Liệu & Giải Thuật với ngân hàng câu hỏi trắc nghiệm thông minh. Đồng thời áp dụng quy trình kiểm thử phần mềm toàn diện (Software QA & Performance Testing) trên thiết bị di động để đảm bảo độ tin cậy và mượt mà.',
      impact:
        'Giải thưởng Khuyến Khích khẳng định năng lực chuyên sâu về lý thuyết giải thuật cũng như quy trình Đảm bảo Chất lượng Phần mềm (QA/QC Testing) thực tế trên thiết bị di động.',
      techStack: [
        'Data Structures & Algorithms',
        'Exam Quiz Engine',
        'Software Testing & QA',
        'Mobile Quality Assurance',
        'Performance Benchmarking',
      ],
      qaHighlights: [
        'Xây dựng bộ Test Cases kiểm thử chức năng & giao diện',
        'Kiểm thử hiệu năng (Stress & Performance Testing) trên smartphone',
        'Tối ưu hóa bộ nhớ & thuật toán tính điểm thời gian thực',
      ],
      icon: 'workspace_premium',
      colorScheme: {
        bgGradient: 'from-cyan-500/20 via-slate-900/90 to-blue-950/40',
        borderColor: 'border-cyan-400/60',
        badgeBg: 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950',
        textColor: 'text-cyan-400',
        glowColor: 'rgba(6, 182, 212, 0.35)',
      },
    },
  ];

  public get filteredPrizes(): PrizeItem[] {
    const filter = this.activeFilter();
    if (filter === 'all') return this.prizes;
    return this.prizes.filter((p) => p.badgeType === filter);
  }

  public setFilter(filter: 'all' | 'third' | 'consolation') {
    this.activeFilter.set(filter);
    this.audioService.playClickSound();
  }

  public openModal(prize: PrizeItem) {
    this.selectedPrize.set(prize);
    this.audioService.playClickSound();
  }

  public closeModal() {
    this.selectedPrize.set(null);
    this.audioService.playClickSound();
  }
}
