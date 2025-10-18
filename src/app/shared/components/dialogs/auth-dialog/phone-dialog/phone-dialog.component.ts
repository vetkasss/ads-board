import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-phone-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './phone-dialog.component.html',
  styleUrls: ['./phone-dialog.component.scss']
})
export class PhoneDialogComponent {
  visible: boolean = false;
  phoneNumber: string = '';

  show(phone: string) {
    this.phoneNumber = phone;
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}