import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Homecomponent } from './components/homecomponent/homecomponent';
import { Navbar } from './components/navbar/navbar';

const routes: Routes = [

   { path: '', redirectTo: 'homecomponent', pathMatch: 'full' },
  { path: 'homecomponent', component: Homecomponent },
  { path: 'navbar', component: Navbar }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
