import { Injectable, inject, ComponentRef, ApplicationRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { createComponent } from '@angular/core';
import { DialogComponent } from '../../shared/dialog/dialog.component';

export type DialogType = 'login' | 'register';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  private typeSubject = new BehaviorSubject<DialogType | null>(null);

  isOpen$ = this.isOpenSubject.asObservable();
  type$ = this.typeSubject.asObservable();

  private appRef = inject(ApplicationRef);
  private currentRef: ComponentRef<DialogComponent> | null = null;

  open(type: DialogType): void {
    if (this.currentRef) return; 

    this.isOpenSubject.next(true);
    this.typeSubject.next(type);

   
    this.currentRef = createComponent(DialogComponent, {
      environmentInjector: this.appRef.injector 
    });
    this.appRef.attachView(this.currentRef.hostView); 
    document.body.appendChild(this.currentRef.location.nativeElement); 

    (window as any).currentDialogRef = this.currentRef; 
  }

  close(): void {
    if (this.currentRef) {
      this.appRef.detachView(this.currentRef.hostView);
      this.currentRef.destroy();
      this.currentRef = null;
    }
    this.isOpenSubject.next(false);
    this.typeSubject.next(null);
  }

  switchType(type: DialogType): void {
    this.typeSubject.next(type);
  }
}