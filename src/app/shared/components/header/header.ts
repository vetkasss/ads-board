import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { AuthService } from '../../../core/services/auth/auth.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NavigationBarComponent, SearchBarComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  private authService = inject(AuthService);
}