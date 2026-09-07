import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { FeedbackService } from '../expression/services/feedback.service';
import { FeedbackItem } from '../expression/types';
import { formatRelativeTime } from '../expression/utils/feedback.utils';
import { AudioService } from '../../services/audio.service';

const ADMIN_PASSWORD = 'TrongTanDev';

@Component({
  selector: 'app-admin-feedback',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  templateUrl: './admin-feedback.component.html',
  styleUrl: './admin-feedback.component.scss',
})
export class AdminFeedbackComponent implements OnInit {
  public feedbackService = inject(FeedbackService);
  public audioService = inject(AudioService);

  // Authentication State
  public isAuthenticated = signal<boolean>(false);
  public passwordInput = signal<string>('');
  public authError = signal<string | null>(null);

  // Filters & Search
  public searchQuery = signal<string>('');
  public selectedCategory = signal<string>('all');
  public selectedRating = signal<number>(0); // 0 = all

  // Batch Selection State
  public selectedIds = signal<Set<string>>(new Set());
  public isDeletingBatch = signal<boolean>(false);
  public isDeletingSingleId = signal<string | null>(null);

  public formatTime = formatRelativeTime;

  // Computed Filtered List
  public filteredFeedbacks = computed(() => {
    const list = this.feedbackService.feedbackListSignal();
    const query = this.searchQuery().trim().toLowerCase();
    const cat = this.selectedCategory();
    const rating = this.selectedRating();

    return list.filter((item) => {
      // Search match
      const matchSearch =
        !query ||
        item.fullName?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.content?.toLowerCase().includes(query);

      // Category match
      const matchCategory = cat === 'all' || item.category === cat;

      // Rating match
      const matchRating = rating === 0 || Number(item.rating) === rating;

      return matchSearch && matchCategory && matchRating;
    });
  });

  // Computed Stats
  public totalCount = computed(() => this.feedbackService.feedbackListSignal().length);
  public avgRating = computed(() => {
    const list = this.feedbackService.feedbackListSignal();
    if (list.length === 0) return '0.0';
    const sum = list.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0);
    return (sum / list.length).toFixed(1);
  });
  public wishCount = computed(() =>
    this.feedbackService.feedbackListSignal().filter((f) => f.category === 'loi-chuc').length
  );
  public suggestionCount = computed(() =>
    this.feedbackService.feedbackListSignal().filter((f) => f.category === 'gop-y').length
  );
  public collabCount = computed(() =>
    this.feedbackService.feedbackListSignal().filter((f) => f.category === 'hop-tac').length
  );

  ngOnInit(): void {
    // Check session storage auth
    const savedAuth = sessionStorage.getItem('admin_auth');
    if (savedAuth === 'true') {
      this.isAuthenticated.set(true);
      this.feedbackService.getAllFeedback();
    }
  }

  /**
   * Verify Admin Password
   */
  public verifyPassword(): void {
    const pwd = this.passwordInput().trim();
    if (pwd === ADMIN_PASSWORD) {
      this.isAuthenticated.set(true);
      this.authError.set(null);
      sessionStorage.setItem('admin_auth', 'true');
      this.audioService.playWinFanfareSound();
      this.feedbackService.getAllFeedback();
    } else {
      this.authError.set('Mật khẩu quản trị không chính xác!');
      this.audioService.playClickSound();
    }
  }

  /**
   * Logout Admin
   */
  public logout(): void {
    sessionStorage.removeItem('admin_auth');
    this.isAuthenticated.set(false);
    this.passwordInput.set('');
    this.selectedIds.set(new Set());
    this.audioService.playClickSound();
  }

  /**
   * Checkbox Selection Toggle
   */
  public toggleSelect(id: string): void {
    const current = new Set(this.selectedIds());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedIds.set(current);
  }

  /**
   * Select All Visible Items
   */
  public toggleSelectAll(): void {
    const visible = this.filteredFeedbacks();
    const current = new Set(this.selectedIds());

    const allSelected = visible.length > 0 && visible.every((item) => current.has(item.id));

    if (allSelected) {
      visible.forEach((item) => current.delete(item.id));
    } else {
      visible.forEach((item) => current.add(item.id));
    }
    this.selectedIds.set(current);
  }

  /**
   * Single Delete Item
   */
  public async deleteSingle(id: string): Promise<void> {
    if (!confirm('Bạn có chắc chắn muốn xóa phản hồi này khỏi hệ thống Google DB?')) {
      return;
    }

    this.isDeletingSingleId.set(id);
    this.audioService.playClickSound();

    try {
      const success = await this.feedbackService.deleteFeedback(id);
      if (success) {
        const set = new Set(this.selectedIds());
        set.delete(id);
        this.selectedIds.set(set);
      }
    } finally {
      this.isDeletingSingleId.set(null);
    }
  }

  /**
   * Batch Delete Items
   */
  public async deleteSelectedBatch(): Promise<void> {
    const ids = Array.from(this.selectedIds());
    if (ids.length === 0) return;

    if (!confirm(`Bạn có chắc chắn muốn xóa ${ids.length} phản hồi đã chọn?`)) {
      return;
    }

    this.isDeletingBatch.set(true);
    this.audioService.playClickSound();

    try {
      const success = await this.feedbackService.multiDeleteFeedback(ids);
      if (success) {
        this.selectedIds.set(new Set());
      }
    } finally {
      this.isDeletingBatch.set(false);
    }
  }

  /**
   * Export Feedback Data to CSV File
   */
  public exportToCsv(): void {
    const list = this.filteredFeedbacks();
    if (list.length === 0) return;

    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    csvContent += 'ID,Họ và Tên,Email,Danh Mục,Đánh Giá (Sao),Nội Dung,Thời Gian\n';

    list.forEach((item) => {
      const row = [
        `"${item.id}"`,
        `"${(item.fullName || '').replace(/"/g, '""')}"`,
        `"${(item.email || '').replace(/"/g, '""')}"`,
        `"${item.category}"`,
        `"${item.rating}"`,
        `"${(item.content || '').replace(/"/g, '""')}"`,
        `"${item.createdAt || ''}"`,
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `danh_sach_gop_y_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
