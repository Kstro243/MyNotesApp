import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { API_LoginRequest, API_LoginResponse, API_ResponseObject } from '../shared/interfaces/my-notes-app-interfaces';
import { AuthenticationService } from '../shared/services/authentication/authentication.service';
import { LocalStorageService } from '../shared/services/localStorage/local-storage.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  @Output() setLoader: EventEmitter<boolean> =
    new EventEmitter<boolean>(false);
  @Output() setMessage: EventEmitter<string> =
    new EventEmitter<string>(undefined);

  emailInput: FormControl;
  passwordInput: FormControl;
  constructor(
    private _authService: AuthenticationService,
    private _localStorageService: LocalStorageService
  ) {
    this.emailInput = new FormControl<string>("", [Validators.required]);
    this.passwordInput = new FormControl<string>("", [Validators.required]);
  }

  clearEmailInput() {
    this.emailInput.patchValue('');
  }

  clearPasswordInput() {
    this.passwordInput.patchValue('');
  }

  login(): void {
    this.setLoader.emit(true);

    const email: string = this.emailInput.value ?? '';
    const password: string = this.passwordInput.value ?? '';

    const loginRequest: API_LoginRequest = {
      email,
      password
    }

    this._authService.loginUser(loginRequest).subscribe({
      next: (response: API_ResponseObject<API_LoginResponse>) => {
        this.setLoader.emit(false);
        if(response.message) {
          this.setMessage.emit(response.message);
          return
        }
        this._localStorageService.saveToken(response.data.token);
        this._authService.changeUserLoggedStatus(true);
        this.setMessage.emit("Welcome to MyNotesApp!")
      }, error: () => {
        this.setLoader.emit(false);
        this.setMessage.emit("There has been an error, please try again...");
      }
    })
  }
}
