import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

const USER_KEY = 'currentUser';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private endpoint_1: string = 'auth/login';
  private endpoint_2: string = 'auth/auth_refresh_token';
  private endpoint_3: string = 'auth/refresh_token';
  private endpoint_4: string = 'reset_password';

  public currentUser: Observable<User>;

  private currentUserSubject: BehaviorSubject<any>;

  private getLocalStorage: any = localStorage.getItem('currentUser');
  configService: any;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(this.getLocalStorage));

    this.currentUser = this.currentUserSubject.asObservable();
  }

  public httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get getAccessToken() {
    return localStorage.getItem('accessToken');
  }
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {

      console.error('An error occurred:', error.error);
    } else {

    }
    return throwError(error);
  }

  /**
   * User Login
   * @param getData
   * @returns
   */
  public login(getData: any): Observable<any> {
    let body: any = JSON.stringify(getData);
    let userData: any;
    return this.http.post<any>(`${environment.AUTH_API_PARTH}${this.endpoint_1}`, body, this.httpOptions)
      .pipe(map((resp: any) => {

        if (resp && resp.data.token.accessToken) {

          userData = {
            'photo': resp.data.photo,
            'email': resp.data.email,
            'firstName': resp.data.person.firstName,
            'middleName': resp.data.person.middleName,
            'lastName': resp.data.person.lastName,
            'userTitle': resp.data.person.title,
            'id': resp.data.id,
            'location_id': resp.data.location.id,
            'location_name': resp.data.location.name,
            'location_level_id': resp.data.location.level.id,
            'passwordExpired': resp.data.passwordExpired,
            'requestPasswordChange': resp.data.requestPasswordChange,
            'token': resp.data.token.accessToken,
            'refreshToken': resp.data.token.refreshToken,
            'expireIn': resp.data.token.expireIn,
            'role': resp.data.roles[0].name,
            'role_id': resp.data.roles[0].id,
            'roleTitle': resp.data.roles[0].title,
            'permissions': resp.data.roles[0].permissions,
            'location': resp.data.location
          }

          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem(USER_KEY, JSON.stringify(userData));
          // localStorage.setItem(ACCESSTOKEN, JSON.stringify(resp.data.token.accessToken));

          // notify
          this.currentUserSubject.next(resp);
        }
        return resp;
      }));
  }

  /**
   * Auth Refresh Token
   * @param formValues
   * @param email
   * @returns
   */
  public authRefreshToken(formValues: any, email: any): Observable<any> {
    let body: any = JSON.stringify({ 'email': email, 'password': formValues.password });
    let userData: any;
    return this.http.post<any>(`${environment.AUTH_API_PARTH}${this.endpoint_2}`, body, this.httpOptions)
      .pipe(
        map((resp: any) => {
          userData = {
            'photo': this.currentUserValue.photo,
            'email': this.currentUserValue.email,
            'firstName': this.currentUserValue.firstName,
            'middleName': this.currentUserValue.middleName,
            'lastName': this.currentUserValue.lastName,
            'userTitle': this.currentUserValue.userTitle,
            'id': this.currentUserValue.id,
            'location_id': this.currentUserValue.location_id,
            'location_name': this.currentUserValue.location_name,
            'location_level_id': this.currentUserValue.location_level_id,
            'passwordExpired': this.currentUserValue.passwordExpired,
            'requestPasswordChange': this.currentUserValue.requestPasswordChange,
            'token': resp.data.accessToken,
            'refreshToken': resp.data.refreshToken,
            'expireIn': resp.data.expireIn,
            'role': this.currentUserValue.role,
            'role_id': this.currentUserValue.role_id,
            'roleTitle': this.currentUserValue.roleTitle,
            'permissions': this.currentUserValue.permissions
          }
          localStorage.setItem(USER_KEY, JSON.stringify(userData));
          return resp;
        })
      );
  }

  /**
   * refreshToken to get to new accesss token
   * @param refreshToken
   * @returns
   */
  public refreshToken(refreshToken: any): Observable<any> {
    let body: any = JSON.stringify({ 'refreshToken': refreshToken });
    let userData: any;
    return this.http.post<any>(`${environment.AUTH_API_PARTH}${this.endpoint_3}`, body, this.httpOptions)
      .pipe(
        map((resp: any) => {
          userData = {
            'photo': this.currentUserValue.photo,
            'email': this.currentUserValue.email,
            'firstName': this.currentUserValue.firstName,
            'middleName': this.currentUserValue.middleName,
            'lastName': this.currentUserValue.lastName,
            'userTitle': this.currentUserValue.userTitle,
            'id': this.currentUserValue.id,
            'location_id': this.currentUserValue.location_id,
            'location_name': this.currentUserValue.location_name,
            'location_level_id': this.currentUserValue.location_level_id,
            'passwordExpired': this.currentUserValue.passwordExpired,
            'requestPasswordChange': this.currentUserValue.requestPasswordChange,
            'token': resp.data.accessToken,
            'refreshToken': resp.data.refreshToken,
            'expireIn': resp.data.expireIn,
            'role': this.currentUserValue.role,
            'role_id': this.currentUserValue.role_id,
            'roleTitle': this.currentUserValue.roleTitle,
            'permissions': this.currentUserValue.permissions
          }
          localStorage.setItem(USER_KEY, JSON.stringify(userData));
          // notify
          this.currentUserSubject.next(resp);
          return resp;
        })
      );
  }

  /**
   * get user details form local storage
   */
  get getUserDetails(): User {
    let currentUser: User;
    // get the currentUser details from localStorage
    currentUser = JSON.parse(this.getLocalStorage);
    return currentUser;
  }


  /**
   * User logout
   */
  public logout() {
    // remove user from local storage to log user out
    // localStorage.removeItem('currentUser');
    localStorage.clear();
    //redirect to the login page
    this.router.navigate(['/login']);
    // notify
    this.currentUserSubject.next(null);
  }
  public sendEmail(getEmail:any): Observable<any> {
    let body = JSON.stringify(getEmail);
    return this.http.post<any>(`${environment.AUTH_API_PARTH}${this.endpoint_4}`, body, this.httpOptions)

      .pipe(
        map((resp: any) => resp),

         catchError(this.handleError)

      );

  }


}
