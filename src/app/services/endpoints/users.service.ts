import {Injectable} from '@angular/core';
import {SERVER_URL_BE} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  endpoint = SERVER_URL_BE + '/users';

  constructor(
    private http: HttpClient,
  ) {
  }

  users(data): Observable<any> {
    return this.http.post(this.endpoint, data);
  }
  getAllUsers(): Observable<any> {
    return this.http.get(this.endpoint);
  }
}
