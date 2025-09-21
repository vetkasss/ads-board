import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NavigationBarComponent, SearchBarComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  isAuthenticated: boolean = false; 
}