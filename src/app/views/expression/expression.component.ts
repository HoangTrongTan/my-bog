import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AudioService } from '../../services/audio.service';
import { FortuneService, FortuneSlip } from '../../services/fortune.service';
import { FeedbackService } from './services/feedback.service';
import { FeedbackItem } from './types';
import { formatRelativeTime } from './utils/feedback.utils';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-expression',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatTooltipModule, RouterLink],
  templateUrl: './expression.component.html',
  styleUrl: './expression.component.scss',
})
export class ExpressionComponent implements OnInit {
  public audioService = inject(AudioService);
  public fortuneService = inject(FortuneService);
  public feedbackService = inject(FeedbackService);

  public activeTab = signal<'fortune' | 'feedback'>('fortune');

  // Lucky Fortune State
  public fortuneFocus = signal<'su-nghiep' | 'tai-loc' | 'tinh-duyen' | 'tong-quan'>('su-nghiep');
  public isShaking = signal<boolean>(false);
  public drawnFortune = signal<FortuneSlip | null>(null);
  public userNameInput = signal<string>('');
  public userBirthInput = signal<string>('');

  // Feedback Form State
  public feedbackName = signal<string>('');
  public feedbackEmail = signal<string>('');
  public feedbackCategory = signal<'gop-y' | 'loi-chuc' | 'hop-tac'>('gop-y');
  public feedbackRating = signal<number>(5);
  public feedbackMessage = signal<string>('');

  public formatTime = formatRelativeTime;

  ngOnInit() {
    // Load live feedback items from Google Apps Script Database
    this.feedbackService.getAllFeedback();
  }

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

  public async submitFeedback() {
    const msg = this.feedbackMessage().trim();
    const name = this.feedbackName().trim();
    if (!msg || !name) return;

    try {
      await this.feedbackService.createFeedback({
        fullName: name,
        email: this.feedbackEmail().trim() || '',
        category: this.feedbackCategory(),
        rating: this.feedbackRating(),
        content: msg,
      });

      this.feedbackMessage.set('');
      this.audioService.playClickSound();
    } catch (err) {
      console.error('Submit feedback error:', err);
    }
  }

  public async deleteFeedbackItem(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.audioService.playClickSound();
    await this.feedbackService.deleteFeedback(id);
  }
}
