import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ButtonAuthComponent } from './button-auth/button-auth.component';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonAuthComponent],
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  onNewAdClick(): void {
    this.router.navigate(['/new-ad']);
  }
}