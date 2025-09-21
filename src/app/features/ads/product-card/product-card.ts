import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ad } from '../../../shared/ad.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCardComponent {
  @Input() ad!: Ad;
  @Output() cardClick = new EventEmitter<Ad>();
}