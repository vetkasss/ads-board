import { Component, inject, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService, DialogType } from 'src/app/core/services/modal.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SearchService } from 'src/app/core/services/search.service'; 
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-button-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-auth.component.html',
  styleUrls: ['./button-auth.component.scss']
})
export class ButtonAuthComponent implements OnInit, OnDestroy {
  private modalService = inject(ModalService);
  private authService = inject(AuthService);
  private searchService = inject(SearchService); 
  private router = inject(Router);

  isUserMenuOpen = false;
  currentUser: any = null;

  private userSubscription!: Subscription;

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  ngOnInit(): void {
  
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      console.log('ButtonAuth received user:', user);
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.isUserMenuOpen) {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu')) {
        this.closeMenu();
      }
    }
  }

  getUserName(): string {
    if (this.currentUser && this.currentUser.name) {
      return this.currentUser.name;
    }
    return 'Пользователь';
  }

  onOpenDialog(): void {
    this.modalService.open('login' as DialogType);
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
    this.closeMenu();
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
    this.closeMenu();
  }

  goToMain(): void {
    this.searchService.resetSearch();
    this.router.navigate(['/']);
    this.closeMenu();
  }

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  private closeMenu(): void {
    this.isUserMenuOpen = false;
  }
}