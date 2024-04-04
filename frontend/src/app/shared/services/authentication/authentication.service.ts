import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { API_ResponseObject, API_LoginRequest, API_LoginResponse } from '../../interfaces/my-notes-app-interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  apiUrl = environment.apiUrl;
  controller = 'Authentication';
  private isUserLogedSubject = new BehaviorSubject<boolean | null>(null);
  isUserLoged$ = this.isUserLogedSubject.asObservable();
  constructor(private _http: HttpClient) { }

  loginUser(user: API_LoginRequest): Observable<API_ResponseObject<API_LoginResponse>> {
    return this._http.post<API_ResponseObject<API_LoginResponse>>(
      `${this.apiUrl}/${this.controller}/Login`,
      user
    )
  }

  changeUserLoggedStatus(isLogged: boolean) {
    this.isUserLogedSubject.next(isLogged)
  }
}
