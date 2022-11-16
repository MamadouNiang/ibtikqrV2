import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import {ipAuth} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  jwt: any;
  username: any;
  roles: any;
  redirectUrl: string;

  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  login(data: any) {
    return this.http.post(ipAuth, data);
  }

  saveToken(jwt: any) {
    localStorage.setItem('token', jwt);
    this.jwt = jwt;
    this.parseJWT();
  }


  parseJWT() {
    let jwtHelper = new JwtHelperService();
    let objJWT = jwtHelper.decodeToken(this.jwt);
    this.username =  localStorage.getItem('username');
    this.roles = localStorage.getItem('roleList');
  }

  isAdmin() {
    return this.roles.indexOf('ADMINISTRATEUR') >= 0;
  }

  isUser() {
    return this.roles.indexOf('SAISIE') >= 0;
  }

  isDGB() {
    return this.roles.indexOf('CONSULTATION') >= 0;
  }

  isAuthenticated() {
    return this.roles;
  }

  loadToken() {
    this.jwt = localStorage.getItem('token');
    this.parseJWT();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('roleName');
    localStorage.removeItem('roleList');
    this.initParams();
  }

  initParams() {
    this.jwt = undefined;
    this.username = undefined;
    this.roles = undefined;
    this.router.navigateByUrl('/login');
  }

  updatePassword(data): Observable<any> {
    return this.http.patch(ipAuth,data);
  }
}
