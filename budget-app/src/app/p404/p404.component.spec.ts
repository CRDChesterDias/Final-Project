import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P404Component } from './p404.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('P404Component', () => {
  let component: P404Component;
  let fixture: ComponentFixture<P404Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ P404Component ]
      ,
      imports: [RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(P404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
