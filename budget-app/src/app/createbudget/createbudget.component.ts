import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'pb-createbudget',
  templateUrl: './createbudget.component.html',
  styleUrls: ['./createbudget.component.scss'],
})
export class CreatebudgetComponent implements OnInit {
  constructor(public httpClient: HttpClient, private router: Router) {}
  public headers = new HttpHeaders();
  public id:string;
  clickMessage = '';
  ngOnInit(): void {
    const token = localStorage.getItem('jwt');
    this.id = localStorage.getItem('ID');

    this.headers = this.headers.set('Authorization', 'Bearer ' + token);
    this.timeout();
  }
  timeout() {
    let token:string = '';
    token = localStorage.getItem('jwt');
    const base64token = token.split('.')[1];
    let decoded = JSON.parse(window.atob(base64token));
    let d: any = new Date(decoded.exp * 1000);
    if (Date.now() >= d) {
      localStorage.removeItem('jwt');
      this.router.navigateByUrl('/');
    }
    let time: any = decoded.exp * 1000 - new Date().getTime();
    setTimeout(() => {
      this.timeout();
    }, time);
  }

  insert() {
    const category = (<HTMLInputElement>document.getElementById('category'))
      .value;
    const budget = (<HTMLInputElement>document.getElementById('budget')).value;
    const color = (<HTMLInputElement>document.getElementById('color')).value;
    const type_of_budget = (<HTMLInputElement>(
      document.getElementById('budget_type')
    )).value;
    const month = (<HTMLInputElement>document.getElementById('month')).value;
    console.log(
      'Category ' +
        category +
        ' budget ' +
        budget +
        ' color ' +
        color.substring(1) +
        ' type of budget ' +
        type_of_budget +
        ' month ' +
        month
    );

    if (type_of_budget === '1') {
      this.httpClient
        .post(
          'http://localhost:3000/api/insert_allocated_budget?user_id=' +
            this.id +
            '&month=' +
            month +
            '&title=' +
            category +
            '&color=' +
            color.substring(1) +
            '&budget=' +
            budget,
          null,
          { headers: this.headers }
        ).pipe(catchError(this.handleError))
        .subscribe((res) => {
          console.log(res);
        });
      this.httpClient
        .post(
          'http://localhost:3000/api/insert_actual_budget?user_id=' +
            this.id +
            '&month=' +
            month +
            '&title=' +
            category +
            '&color=' +
            color.substring(1) +
            '&budget=0',
          null,
          { headers: this.headers }
        ).pipe(catchError(this.handleError))
        .subscribe((res) => {
          window.alert('Category data added.');
                });
    } else {
      //check if allocation is done first
      this.httpClient
        .post(
          'http://localhost:3000/api/check_allocation?user_id=' +
            this.id +
            '&month=' +
            month +
            '&title=' +
            category,
          null,
          { headers: this.headers }
        ).pipe(catchError(this.handleError))
        .subscribe((res: any) => {
          if (res.status === true) {
            console.log('yes it is present');
            this.httpClient
              .post(
                'http://localhost:3000/api/update_actual_budget?user_id=' +
                  this.id +
                  '&month=' +
                  month +
                  '&title=' +
                  category +
                  '&budget=' +
                  budget,
                null,
                { headers: this.headers }
              ).pipe(catchError(this.handleError))
              .subscribe((result) => {
                window.alert('Category data added.');
              });
          } else {
            window.alert('Category mentioned Does not exist.');
          }
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
      errorMessage = `Data entry failed!!!!`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

}
