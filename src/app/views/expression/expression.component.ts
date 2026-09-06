import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AudioService } from '../../services/audio.service';
import { FortuneService, FortuneRequest, FortuneResponse } from '../../services/fortune.service';

export interface UserFeedback {
  id: string;
  name: string;
  avatar: string;
  category: 'gop-y' | 'loi-chuc' | 'hop-tac';
  rating: number;
  message: string;
  createdAt: string;
  likes: number;
}

export interface FortuneSlip {
  grade: '🌟 ĐẠI CÁT' | '💫 TRUNG CÁT' | '🌸 TIỂU CÁT' | '🍀 CÁT TƯỜNG';
  hexagram: string;
  poem: string[];
  oracleAdvice: string;
  luckyColors: string[];
  luckyNumbers: number[];
}

@Component({
  selector: 'app-expression',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatTooltipModule],
  templateUrl: './expression.component.html',
  styleUrl: './expression.component.scss'
})
export class ExpressionComponent {
  public audioService = inject(AudioService);
  public fortuneService = inject(FortuneService);

  public activeTab = signal<'fortune' | 'feedback'>('fortune');

  // Lucky Fortune State
  public fortuneFocus = signal<'su-nghiep' | 'tai-loc' | 'tinh-duyen' | 'tong-quan'>('su-nghiep');
  public isShaking = signal<boolean>(false);
  public drawnFortune = signal<FortuneSlip | null>(null);
  public userNameInput = signal<string>('');
  public userBirthInput = signal<string>('');

  // Feedback Form State
  public feedbackName = signal<string>('');
  public feedbackCategory = signal<'gop-y' | 'loi-chuc' | 'hop-tac'>('gop-y');
  public feedbackRating = signal<number>(5);
  public feedbackMessage = signal<string>('');

  public feedbackList = signal<UserFeedback[]>([
    {
      id: 'fb-1',
      name: 'Nguyễn Văn Minh',
      avatar: '/access/imgs/me.jpg',
      category: 'loi-chuc',
      rating: 5,
      message: 'Giao diện portfolio cực đỉnh! Các hiệu ứng 3D và tùy chỉnh phong cách nhân vật làm mình rất ấn tượng. Chúc Tấn ngày càng phát triển thành công 🚀',
      createdAt: ' Vừa xong',
      likes: 12
    },
    {
      id: 'fb-2',
      name: 'Trần Thị Thu Hà',
      avatar: '/access/imgs/myImg1.jpg',
      category: 'gop-y',
      rating: 5,
      message: 'Rút quẻ cát tường chuẩn và hay lắm bạn ơi! Trải nghiệm mượt mà, màu sắc Light/Dark mode nhìn rất rõ ràng chuyên nghiệp.',
      createdAt: '10 phút trước',
      likes: 8
    }
  ]);

  public setTab(tab: 'fortune' | 'feedback') {
    this.activeTab.set(tab);
    this.audioService.playClickSound();
  }

  public async drawFortuneSlip() {
    if (this.isShaking()) return;

    this.isShaking.set(true);
    this.audioService.playClickSound();
    this.drawnFortune.set(null);

    // Simulate shaking cylinder delay
    setTimeout(async () => {
      try {
        const result = await this.fortuneService.drawFortuneSlipAi(
          this.fortuneFocus(),
          this.userNameInput(),
          this.userBirthInput()
        );
        this.drawnFortune.set(result);
      } catch (err) {
        console.error('Draw fortune slip error:', err);
      } finally {
        this.isShaking.set(false);
        this.audioService.playClickSound();
      }
    }, 1200);
  }

  public submitFeedback() {
    const msg = this.feedbackMessage().trim();
    if (!msg) return;

    const newFb: UserFeedback = {
      id: 'fb-' + Date.now(),
      name: this.feedbackName().trim() || 'Người Dùng Ẩn Danh',
      avatar: '/access/imgs/me.jpg',
      category: this.feedbackCategory(),
      rating: this.feedbackRating(),
      message: msg,
      createdAt: ' Vừa xong',
      likes: 1
    };

    this.feedbackList.update(list => [newFb, ...list]);
    this.feedbackMessage.set('');
    this.audioService.playClickSound();
  }

  public likeFeedback(id: string) {
    this.feedbackList.update(list =>
      list.map(item => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
    );
    this.audioService.playClickSound();
  }
}
