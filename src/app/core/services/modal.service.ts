import { Injectable, inject, ComponentRef, ApplicationRef, EnvironmentInjector, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { createComponent } from '@angular/core';
import { DialogComponent } from '../dialog/auth-dialog/dialog.component';

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
  private environmentInjector = inject(EnvironmentInjector);
  private rendererFactory = inject(RendererFactory2);
  private renderer: Renderer2;
  
  private currentRef: ComponentRef<DialogComponent> | null = null;

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  open(type: DialogType): void {
    if (this.isOpenSubject.value) {
      console.warn('Modal is already open');
      return;
    }

    try {
      this.isOpenSubject.next(true);
      this.typeSubject.next(type);

      this.currentRef = createComponent(DialogComponent, {
        environmentInjector: this.environmentInjector
      });

      this.appRef.attachView(this.currentRef.hostView);

      this.renderer.appendChild(document.body, this.currentRef.location.nativeElement);

      this.disableBodyScroll();

      this.renderer.addClass(document.body, 'modal-open');

    } catch (error) {
      console.error('Error opening modal:', error);
      this.cleanup(); 
    }
  }

  close(): void {
    if (!this.isOpenSubject.value) return;

    try {
      this.cleanup();
      this.isOpenSubject.next(false);
      this.typeSubject.next(null);

    } catch (error) {
      console.error('Error closing modal:', error);
    }
  }

  switchType(type: DialogType): void {
    if (!this.isOpenSubject.value) {
      console.warn('Cannot switch type - modal is not open');
      return;
    }
    this.typeSubject.next(type);
  }

  private cleanup(): void {
    // Уничтожаем компонент
    if (this.currentRef) {
      this.appRef.detachView(this.currentRef.hostView);
      this.currentRef.destroy();
      this.currentRef = null;
    }

    this.enableBodyScroll();
    this.renderer.removeClass(document.body, 'modal-open');
  }

  private disableBodyScroll(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  private enableBodyScroll(): void {
    this.renderer.removeStyle(document.body, 'overflow');
  }

  get isOpen(): boolean {
    return this.isOpenSubject.value;
  }

  //Получаем текущий тип диалога
  get currentType(): DialogType | null {
    return this.typeSubject.value;
  }
}