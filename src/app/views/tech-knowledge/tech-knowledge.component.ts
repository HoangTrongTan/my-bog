import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TECH_KNOWLEDGE_ARTICLES, TechKnowledgeArticle } from '../../data/tech-knowledge.data';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-tech-knowledge',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatTooltipModule],
  templateUrl: './tech-knowledge.component.html',
  styleUrl: './tech-knowledge.component.scss'
})
export class TechKnowledgeComponent {
  public audioService = inject(AudioService);

  public articles = signal<TechKnowledgeArticle[]>(TECH_KNOWLEDGE_ARTICLES);
  public selectedCategory = signal<string>('all');
  public searchQuery = signal<string>('');
  public selectedArticle = signal<TechKnowledgeArticle | null>(null);

  public categories = [
    { id: 'all', label: 'Tất Cả Chủ Đề', icon: 'apps' },
    { id: 'aws', label: 'AWS Cloud & VPC', icon: 'cloud' },
    { id: 'docker-k8s', label: 'Docker & Kubernetes', icon: 'layers' },
    { id: 'deployment', label: 'ECS & CI/CD Deployment', icon: 'rocket_launch' }
  ];

  public get filteredArticles(): TechKnowledgeArticle[] {
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();

    return this.articles().filter(item => {
      const matchCat = cat === 'all' || item.category === cat;
      const matchSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.tags.some(t => t.toLowerCase().includes(query));
      return matchCat && matchSearch;
    });
  }

  public setCategory(catId: string) {
    this.selectedCategory.set(catId);
    this.audioService.playClickSound();
  }

  public openModal(article: TechKnowledgeArticle) {
    this.selectedArticle.set(article);
    this.audioService.playClickSound();
  }

  public closeModal() {
    this.selectedArticle.set(null);
    this.audioService.playClickSound();
  }

  public copyCode(code?: string) {
    if (!code) return;
    navigator.clipboard.writeText(code);
    this.audioService.playClickSound();
  }
}
