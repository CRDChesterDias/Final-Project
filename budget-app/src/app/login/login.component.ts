import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{
  constructor(public httpClient: HttpClient, private router: Router){}

  login(): void {
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const pwd = (document.getElementById('pwd') as HTMLInputElement).value;

    this.httpClient
          .post('http://localhost:3000/api/login?username=' + username + '&password=' + pwd, null)
          .pipe(catchError(this.handleError))
          .subscribe((res: any) => {
            const token = res.token;
            localStorage.setItem('jwt', token);
            localStorage.setItem('ID', res.id);
            this.router.navigateByUrl('/homepage');
        });
  }

  handleError(error: HttpErrorResponse): any {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Incorrect Combination Entered`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
