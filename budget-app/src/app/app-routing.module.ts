import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { P404Component } from './p404/p404.component';
import { ContactComponent } from './contact/contact.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SignupComponent } from './signup/signup.component';
import { CreatebudgetComponent } from './createbudget/createbudget.component';
const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent,

  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'homepage',
    component: HomepageComponent
  },
  {
    path: 'manage',
    component: CreatebudgetComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
