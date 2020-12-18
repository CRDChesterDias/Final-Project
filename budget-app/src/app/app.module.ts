import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgApexchartsModule } from "ng-apexcharts";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { ContactComponent } from './contact/contact.component';
import { SignupComponent } from './signup/signup.component';
import { CreatebudgetComponent } from './createbudget/createbudget.component';
import { FooterComponent } from './footer/footer.component';
import { P404Component } from './p404/p404.component';
import { HeroComponent } from './hero/hero.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HomepageComponent,
    LoginComponent,
    MenuComponent,
    ContactComponent,
    SignupComponent,
    CreatebudgetComponent,
    FooterComponent,
    P404Component,
    HeroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgApexchartsModule,

  ],
  // exports: [
  //   MenuComponent,
  //   HeroComponent
  // ],
  providers: [],
  bootstrap: [AppComponent],

})

export class AppModule { }
