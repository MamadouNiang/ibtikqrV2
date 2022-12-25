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

  updateRoleToUser(id, roleIds): Observable<any> {
    return this.http.post(this.endpoint + '/add-roles/' + id, roleIds);
  }
  updateRegionsToUser(id, regionIds): Observable<any> {
    return this.http.post(this.endpoint + '/add-regions/' + id, regionIds);
  }
  removeRegionsToUser(id, regionIds): Observable<any> {
    return this.http.post(this.endpoint + '/remove-regions/' + id, regionIds);
  }
  deleteRoleToUser(id, roleIds): Observable<any> {
    return this.http.post(this.endpoint + '/remove-roles/' + id, roleIds);
  }

  activate(ids): Observable<any> {
    return this.http.post(this.endpoint + '/activate', ids);
  }

  deactivates(ids): Observable<any> {
    return this.http.post(this.endpoint + '/deactivate', ids);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(this.endpoint);
  }
}
