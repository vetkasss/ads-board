import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService, DialogType } from 'src/app/core/services/modal.service';
import { LoginComponent as LoginComponent } from "src/app/features/auth/login/login";
import { RegisterComponent as RegisterComponent } from "src/app/features/auth/register/register";

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, LoginComponent, RegisterComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements OnInit, OnDestroy {
  private modalService = inject(ModalService);
  activeForm: DialogType | null = null;

  private subscription = this.modalService.isOpen$.subscribe(isOpen => {
    if (!isOpen) this.destroySelf();
  });

  private typeSubscription = this.modalService.type$.subscribe(type => {
    this.activeForm = type;
  });

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.typeSubscription.unsubscribe();
  }

  close(): void {
    this.modalService.close();
  }

  switchForm(type: DialogType): void {
    this.modalService.switchType(type);
  }

  onOverlayClick(event: MouseEvent): void {
    this.close(); 
    event.stopPropagation();
  }

  private destroySelf(): void {
    const componentRef = (window as any).currentDialogRef;
    if (componentRef) {
      componentRef.destroy();
      delete (window as any).currentDialogRef;
    }
  }
}