import {
  Component, inject, signal, OnInit, computed, ViewChild, ElementRef, AfterViewChecked
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ChatService, QuestionItem, QuestionsPage } from '../../core/services/chat.service';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, DatePipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, AfterViewChecked {
  private chatService = inject(ChatService);

  // Submit
  sessionId = '';
  input = '';
  sending = signal(false);
  submitted = signal(false);

  // Q&A board
  questions = signal<QuestionItem[]>([]);
  totalPages = signal(1);
  total = signal(0);
  currentPage = signal(1);
  search = '';
  searchInput = '';
  loading = signal(false);
  loadError = signal(false);
  openItems = signal<Set<string>>(new Set());

  @ViewChild('boardTop') boardTop!: ElementRef;
  private scrollAfterSend = false;

  ngOnInit() {
    this.sessionId = sessionStorage.getItem('be-nurse-session') ?? crypto.randomUUID();
    sessionStorage.setItem('be-nurse-session', this.sessionId);
    this.loadQuestions();
  }

  ngAfterViewChecked() {
    if (this.scrollAfterSend && this.boardTop) {
      this.boardTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.scrollAfterSend = false;
    }
  }

  send() {
    const content = this.input.trim();
    if (!content || this.sending()) return;
    this.sending.set(true);

    this.chatService.sendMessage(this.sessionId, content).subscribe({
      next: () => {
        this.input = '';
        this.sending.set(false);
        this.submitted.set(true);
        this.loadQuestions();
      },
      error: () => this.sending.set(false)
    });
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send(); }
  }

  loadQuestions(page = this.currentPage()) {
    this.loading.set(true);
    this.chatService.getQuestions(this.search, page).subscribe({
      next: (res: QuestionsPage) => {
        this.questions.set(res.items);
        this.totalPages.set(res.totalPages);
        this.total.set(res.total);
        this.currentPage.set(res.page);
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); this.loadError.set(true); }
    });
  }

  doSearch() {
    this.search = this.searchInput;
    this.loadQuestions(1);
  }

  clearSearch() {
    this.search = '';
    this.searchInput = '';
    this.loadQuestions(1);
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages()) return;
    this.loadQuestions(p);
    this.scrollAfterSend = true;
  }

  toggleItem(id: string) {
    this.openItems.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  isOpen(id: string) { return this.openItems().has(id); }

  pages(): number[] {
    const total = this.totalPages();
    const cur = this.currentPage();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: number[] = [1];
    if (cur > 3) pages.push(-1);
    for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
    if (cur < total - 2) pages.push(-1);
    pages.push(total);
    return pages;
  }
}
