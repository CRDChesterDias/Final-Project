import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatebudgetComponent } from './createbudget.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('CreatebudgetComponent', () => {
  let component: CreatebudgetComponent;
  let fixture: ComponentFixture<CreatebudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatebudgetComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatebudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the correct header', () => {
    const fixture = TestBed.createComponent(CreatebudgetComponent);
     fixture.detectChanges();
     const compiled = fixture.debugElement.nativeElement;
     //expect(compiled.querySelector('h1').textContent).toEqual('Manage Budget');
     expect(compiled.querySelector('p').textContent).toEqual('Manage Budget');
    });
});
