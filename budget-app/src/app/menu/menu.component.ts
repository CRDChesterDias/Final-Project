import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'pb-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  // @Input() onBeforeAddingProcessor: (value: any) => Number;
  constructor( private router: Router) { }
  isloggedin = false
  ngOnInit(): void {
  }
  ngDoCheck(){
    const token = localStorage.getItem('jwt');
    if(token === null){
      this.isloggedin = false;
    }
    else{
      const base64token = token.split('.')[1];
      let decoded = JSON.parse(window.atob(base64token));
      let d:any = new Date(decoded.exp * 1000);
      if (Date.now() >= d){
        localStorage.removeItem('jwt');
        this.isloggedin = false;
    }
    else{
      this.isloggedin = true;
    }
  }
    // let time = decoded.exp * 1000 - new Date().getTime();
  }

  Logout(){
    localStorage.removeItem('jwt');
    this.router.navigateByUrl('/');
    this.isloggedin = false;
  }
}
