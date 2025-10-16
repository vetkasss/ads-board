import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { StoreService } from 'src/app/core/services/store/store.service';
import { Ad } from 'src/app/core/models/ad.model';
import { AdCardComponent } from 'src/app/features/ads/ad-card/ad-card';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, RouterModule, AdCardComponent],
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.scss'],
})
export class ProfilePageComponent implements OnInit {
  userAds: Ad[] = [];
  adsCount: number = 0;

  constructor(
    private router: Router,
    private storeService: StoreService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUserAds();
  }

  private loadUserAds(): void {
    // Получаем объявления из локального хранилища
    const currentUserId = this.authService.currentUser?.id || 0;
    this.userAds = this.storeService.getUserAds(currentUserId);
    this.adsCount = this.userAds.length;
  }

  onNewAdClick(): void {
    this.router.navigate(['/new-ad']);
  }

  onAdClick(ad: Ad): void {
    this.router.navigate(['/ads', ad.id]);
  }
}