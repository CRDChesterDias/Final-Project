import { Component } from '@angular/core';
import {enableProdMode} from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { HeroComponent } from './hero/hero.component';

enableProdMode();

@Component({
  selector: 'pb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'budget-app';

}
