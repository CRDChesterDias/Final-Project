import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'pb-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent{
  clickMessage = '';
  constructor(public httpClient: HttpClient, private router: Router){}

  onClickMe() {
    const fname = (<HTMLInputElement>document.getElementById('fname')).value;
    const lname = (<HTMLInputElement>document.getElementById('lname')).value;
    const username = (<HTMLInputElement>document.getElementById('username')).value;
    const pwd = (<HTMLInputElement>document.getElementById('pwd')).value;
    const confirm = (<HTMLInputElement>document.getElementById('retype-pwd')).value;
    if (pwd !== confirm){
      this.clickMessage = 'Passwords do not match!!!!';
    }
    else{
          this.httpClient
          .post('http://localhost:3000/api/signup?firstname=' + fname + '&lastname=' + lname + '&username=' + username
          + ' &password=' + pwd, null)
          .pipe(catchError(this.handleError))
          .subscribe((res) => {
            console.log(res)
            this.clickMessage = 'Success!!!!';
            this.router.navigateByUrl('/');
          });
      }
  }
  handleError(error: HttpErrorResponse): any {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Unable to signup. Try using another username`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}


