import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../services/theme.service';
import { AudioService } from '../../services/audio.service';

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskRole = 'frontend' | 'backend' | 'devops' | 'uiux' | 'fullstack';
export type TaskPriority = 'high' | 'medium' | 'normal';

export interface TaskItem {
  id: string;
  title: string;
  role: TaskRole;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
}

const AI_ROLE_TASKS: Record<TaskRole, Array<{ title: string; priority: TaskPriority }>> = {
  frontend: [
    { title: 'Tối ưu hóa Angular Signals & OnPush Change Detection', priority: 'high' },
    { title: 'Refactor giao diện Glassmorphic chuẩn responsive 4K/Mobile', priority: 'medium' },
    { title: 'Kiểm thử Lighthouse performance & Core Web Vitals', priority: 'normal' }
  ],
  backend: [
    { title: 'Thiết kế RESTful API contracts & JWT Auth Guards', priority: 'high' },
    { title: 'Viết Unit Test & Integration Test cho Core Services', priority: 'medium' },
    { title: 'Tối ưu truy vấn SQL Database & Cấu hình Redis Cache', priority: 'high' }
  ],
  devops: [
    { title: 'Cấu hình AWS VPC Peering, NAT Gateway & Route Tables', priority: 'high' },
    { title: 'Xây dựng Docker multi-stage build & CI/CD ECS Fargate', priority: 'high' },
    { title: 'Triển khai hệ thống giám sát Prometheus & Grafana', priority: 'medium' }
  ],
  uiux: [
    { title: 'Thiết kế hệ thống Dark/Light Design Tokens & Preset Palette', priority: 'medium' },
    { title: 'Tạo hiệu ứng Micro-animations & Chuyển trạng thái mượt mà', priority: 'normal' },
    { title: 'Kiểm tra chuẩn truy cập WCAG Accessibility cho UI', priority: 'normal' }
  ],
  fullstack: [
    { title: 'Review Code Architecture Guidelines & Merge Pull Requests', priority: 'high' },
    { title: 'Lập kế hoạch Sprint Backlog & Milestone Release Roadmap', priority: 'high' },
    { title: 'Tích hợp Gemini AI Endpoints cho hệ thống thông minh', priority: 'medium' }
  ]
};

@Component({
  selector: 'app-todo-list-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatTooltipModule],
  templateUrl: './todo-list-modal.component.html'
})
export class TodoListModalComponent {
  public themeService = inject(ThemeService);
  public audioService = inject(AudioService);

  public isOpen = signal<boolean>(false);
  public tasks = signal<TaskItem[]>([]);
  public draggedTaskId = signal<string | null>(null);

  public selectedRole: TaskRole = 'frontend';
  public newTaskTitle = '';

  constructor() {
    this.loadTasks();
  }

  public openModal() {
    this.isOpen.set(true);
    this.audioService.playClickSound();
  }

  public closeModal() {
    this.isOpen.set(false);
    this.audioService.playClickSound();
  }

  public getTasksByStatus(status: TaskStatus): TaskItem[] {
    return this.tasks().filter(t => t.status === status);
  }

  // --- Drag & Drop Handlers ---
  public onDragStart(event: DragEvent, task: TaskItem) {
    this.draggedTaskId.set(task.id);
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', task.id);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  public onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  public onDrop(event: DragEvent, targetStatus: TaskStatus) {
    event.preventDefault();
    const taskId = this.draggedTaskId() || event.dataTransfer?.getData('text/plain');
    if (taskId) {
      this.moveTask(taskId, targetStatus);
    }
    this.draggedTaskId.set(null);
  }

  public onDragEnd() {
    this.draggedTaskId.set(null);
  }

  public moveTask(taskId: string, targetStatus: TaskStatus) {
    this.tasks.update(current =>
      current.map(t => (t.id === taskId ? { ...t, status: targetStatus } : t))
    );
    this.audioService.playClickSound();
    this.saveTasks();
  }

  public addCustomTask() {
    if (!this.newTaskTitle.trim()) return;

    const newTask: TaskItem = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: this.newTaskTitle.trim(),
      role: this.selectedRole,
      status: 'todo',
      priority: 'high',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.tasks.update(current => [newTask, ...current]);
    this.newTaskTitle = '';
    this.audioService.playClickSound();
    this.saveTasks();
  }

  public generateAiTasks() {
    const aiTasks = AI_ROLE_TASKS[this.selectedRole] || [];
    const newItems: TaskItem[] = aiTasks.map((t, idx) => ({
      id: 'ai_' + Date.now() + '_' + idx,
      title: t.title,
      role: this.selectedRole,
      status: 'todo',
      priority: t.priority,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    // Avoid duplicate titles
    const currentTitles = new Set(this.tasks().map(t => t.title));
    const filteredNew = newItems.filter(t => !currentTitles.has(t.title));

    if (filteredNew.length > 0) {
      this.tasks.update(current => [...filteredNew, ...current]);
      this.saveTasks();
    }

    this.audioService.playClickSound();
  }

  public deleteTask(taskId: string) {
    this.tasks.update(current => current.filter(t => t.id !== taskId));
    this.audioService.playClickSound();
    this.saveTasks();
  }

  public clearDoneTasks() {
    this.tasks.update(current => current.filter(t => t.status !== 'done'));
    this.audioService.playClickSound();
    this.saveTasks();
  }

  // --- Badge Helper Labels & Styles ---
  public getRoleLabel(role: TaskRole): string {
    switch (role) {
      case 'frontend': return 'Frontend';
      case 'backend': return 'Backend';
      case 'devops': return 'DevOps';
      case 'uiux': return 'UI/UX';
      case 'fullstack': return 'Fullstack';
      default: return role;
    }
  }

  public getRoleBadgeClass(role: TaskRole): string {
    switch (role) {
      case 'frontend': return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40';
      case 'backend': return 'bg-purple-500/20 text-purple-300 border border-purple-500/40';
      case 'devops': return 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
      case 'uiux': return 'bg-pink-500/20 text-pink-300 border border-pink-500/40';
      case 'fullstack': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
      default: return 'bg-slate-800 text-slate-300';
    }
  }

  public getPriorityLabel(priority: TaskPriority): string {
    switch (priority) {
      case 'high': return '🔥 Gấp';
      case 'medium': return '⚡ Quan Trọng';
      case 'normal': return '☕ Thường';
      default: return priority;
    }
  }

  public getPriorityBadgeClass(priority: TaskPriority): string {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border border-red-500/40';
      case 'medium': return 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
      case 'normal': return 'bg-blue-500/20 text-blue-300 border border-blue-500/40';
      default: return 'bg-slate-800 text-slate-300';
    }
  }

  public get modalThemeClass(): string {
    const style = this.themeService.activeCharacterStyle();
    if (style === 'style-ninja') {
      return 'bg-stone-950 border-2 border-red-600/60 shadow-[0_0_50px_rgba(239,68,68,0.4)]';
    } else if (style === 'style-robot') {
      return 'bg-slate-950 border-2 border-cyan-500/60 shadow-[0_0_50px_rgba(6,182,212,0.4)]';
    } else if (style === 'style-quantum') {
      return 'bg-slate-950 border-2 border-purple-500/60 shadow-[0_0_50px_rgba(168,85,247,0.4)]';
    } else if (style === 'style-quan-van-truong') {
      return 'bg-emerald-950/90 border-2 border-emerald-500/60 shadow-[0_0_50px_rgba(16,185,129,0.4)]';
    } else if (style === 'style-sports') {
      return 'bg-amber-950/90 border-2 border-amber-500/60 shadow-[0_0_50px_rgba(245,158,11,0.4)]';
    } else if (style === 'style-horror') {
      return 'bg-neutral-955 border-2 border-red-700/80 shadow-[0_0_60px_rgba(220,38,38,0.5)]';
    } else {
      return 'bg-slate-950 border-2 border-pink-500/60 shadow-[0_0_50px_rgba(236,72,153,0.4)]';
    }
  }

  // --- LocalStorage ---
  private loadTasks() {
    try {
      const saved = localStorage.getItem('personal_todo_tasks');
      if (saved) {
        this.tasks.set(JSON.parse(saved));
      } else {
        // Initial default tasks
        this.tasks.set([
          { id: 't1', title: 'Tối ưu hóa Angular Signals & Tailwind CSS UI', role: 'frontend', status: 'todo', priority: 'high', createdAt: '10:00 AM' },
          { id: 't2', title: 'Triển khai AWS VPC & Subnet Architecture', role: 'devops', status: 'in-progress', priority: 'high', createdAt: '09:30 AM' },
          { id: 't3', title: 'Thiết kế REST API cho hệ thống Bói Quẻ Gemini', role: 'backend', status: 'done', priority: 'medium', createdAt: '08:15 AM' }
        ]);
      }
    } catch {
      // Fallback
    }
  }

  private saveTasks() {
    try {
      localStorage.setItem('personal_todo_tasks', JSON.stringify(this.tasks()));
    } catch {
      // Ignore
    }
  }
}
