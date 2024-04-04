import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }
  saveToken(token: string) {
    localStorage.setItem('tokenValue', token)
  }

  getToken(): string {
    return localStorage.getItem('tokenValue') ?? "";
  }
}
