import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { LocalStorageService } from '../localStorage/local-storage.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private _authService: AuthenticationService,
    private _localStorageService: LocalStorageService
  ) { }
  intercept(
    req: HttpRequest<any>, 
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this._localStorageService.getToken();
    req = req.clone({
      setHeaders: { 
        Authorization: `Bearer ${token}`
      }
    })
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this._authService.changeUserLoggedStatus(false);
        }
        return throwError(() => new Error(err.message));
      })
    );
  }

}
