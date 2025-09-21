import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonAuthComponent } from './button-auth/button-auth.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthRoutingModule } from "src/app/features/auth/auth-routing.module";
@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [CommonModule, ButtonAuthComponent, AuthRoutingModule],
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {
  @Input() isAuthenticated: boolean = false;
}