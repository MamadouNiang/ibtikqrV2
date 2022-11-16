import { Injectable } from '@angular/core';
import {SERVER_URL_BE} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  endpoint = SERVER_URL_BE + '/roles/';

  constructor(
    private http: HttpClient,
  ) {
  }

  roles(): Observable<any> {
    return this.http.get(this.endpoint);
  }
}
