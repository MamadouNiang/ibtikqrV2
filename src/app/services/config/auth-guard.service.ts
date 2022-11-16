import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {AuthentificationService} from "./authentification.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{
  canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  this.auth.redirectUrl = state.url;
    if (this.auth.redirectUrl != '/login'){
      return this.checkConnexion();
    }else{
      window.localStorage.clear();
      return true;
    }
}

  checkConnexion(): boolean {
    if (window.localStorage.getItem("token")) {
      return true;
    }
    return false;
  }

  constructor(private auth: AuthentificationService, private router : Router) { }
}
