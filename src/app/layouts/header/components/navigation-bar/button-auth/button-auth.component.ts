import { Component, Input } from '@angular/core';
import { ModalService, DialogType } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-button-auth',
  standalone: true,
  templateUrl: './button-auth.component.html',
  styleUrls: ['./button-auth.component.scss']
})
export class ButtonAuthComponent {
  @Input() isAuthenticated: boolean = false;

  constructor(private modalService: ModalService) {}

  onOpenDialog(): void {
    this.modalService.open('login' as DialogType);
  }
}