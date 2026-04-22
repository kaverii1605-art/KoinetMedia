import { Routes } from '@angular/router';
import { Homecomponent } from './components/homecomponent/homecomponent';

export const routes: Routes = [
  { path: '', redirectTo: 'homecomponent', pathMatch: 'full' },
  { path: 'homecomponent', component: Homecomponent }
];