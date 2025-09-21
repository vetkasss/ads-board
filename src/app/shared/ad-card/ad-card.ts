import { Component, Input } from '@angular/core';
import { Ad } from '../../shared/ad.model'; 

@Component({
  selector: 'app-ad-card',
  templateUrl: './ad-card.html',
  styleUrls: ['./ad-card.scss']
})
export class AdCard {
  @Input() ad!: Ad; 
}