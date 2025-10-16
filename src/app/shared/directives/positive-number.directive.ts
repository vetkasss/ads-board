import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[appPositiveNumber]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PositiveNumberDirective),
      multi: true
    }
  ]
})
export class PositiveNumberDirective implements ControlValueAccessor {
  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    let sanitizedValue: number | null = null;
    
    if (value !== '') {
      const numericString = value.replace(/[^0-9]/g, '');
      if (numericString) {
        const numValue = parseInt(numericString, 10);
        sanitizedValue = numValue >= 0 ? numValue : 0;
      }
    }
    
    input.value = sanitizedValue !== null ? sanitizedValue.toString() : '';
    this.onChange(sanitizedValue);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: number | null): void {
    if (value !== null && value < 0) {
      value = 0;
    }
    this.el.nativeElement.value = value !== null ? value.toString() : '';
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }
}