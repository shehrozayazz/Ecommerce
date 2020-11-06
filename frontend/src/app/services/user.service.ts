import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { CartService } from './cart.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userIdd: string;
  private token: string;
  isAuthenticated = false;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  private SERVER_URL = environment.SERVER_URL;

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private http: HttpClient,
    private toast: ToastrService
  ) {}
  createUser(
    email: string,
    password: string,
    password2: string,
    fname: string,
    lname: string
  ) {
   this.spinner.show();
    const authData = {
      email: email,
      password: password,
      password2: password2,
      fname: fname,
      lname: lname,
    };

    this.http
      .post('http://localhost:3000/api/auth/register', authData)
      .subscribe(
        (response) => {
          // this.toast.info(
          //   `Registered `,
          //   'The user has been registered',
          //   {
          //     timeOut: 1500,
          //     progressBar: true,
          //     progressAnimation: 'increasing',
          //     positionClass: 'toast-top-right',
          //   }
          // );
          // setTimeout(() => {
          //   /** spinner ends after 5 seconds */
          //   this.spinner.hide();
          // }, 3000);
          setTimeout(()=>{


            this.router.navigate(['/login'])

          } ,1000)
        },
        (err) => {
          this.spinner.hide();

          this.authStatusListener.next(false);
        }
      );
  }

  getToken() {
    return this.token;
  }
  getUserId() {
    return this.userIdd;
  }

  logout() {
    this.isAuthenticated = false;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    let cartDataClient = {
      total: 0,
      prodData: [{ incart: 0, id: 0 }],
    };

    localStorage.setItem('cart', JSON.stringify(cartDataClient));
    this.token = null;
    this.userIdd = null;
    this.authStatusListener.next(false);
    this.router.navigate(['/login']);
  }
  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  login(email: string, password: string) {
    const authData = { email: email, password: password };

    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        'http://localhost:3000/api/auth/login',
        authData
      )
      .subscribe(
        (response) => {
          this.token = response.token;
          if (this.token) {
            this.userIdd = response.userId;
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(this.token, expirationDate, this.userIdd);

            this.isAuthenticated = true;
            this.authStatusListener.next(true);
          }
          this.router.navigate(['/']);
        },
        (err) => {
          this.authStatusListener.next(false);
        }
      );
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getIsAuth() {
    return this.isAuthenticated;
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 100);
  }

  saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userIdd = authInfo.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }
}
