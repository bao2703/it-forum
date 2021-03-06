import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { API } from '../shared/common/api';
import { User } from '../../models/user';
import { Post } from '../../models/post';
import { Thread } from '../../models/thread';
import { Role } from '../../models/role';

@Injectable()
export class UserService {

  constructor(private httpClient: HttpClient) {
  }

  getWithReputations(id: number): Observable<User> {
    return this.httpClient.get<User>(`${API.USER.URL}/reputations/${id}`);
  }

  get(id: number): Observable<User> {
    return this.httpClient.get<User>(`${API.USER.URL}/${id}`);
  }

  getWithManagements(id: number): Observable<User> {
    return this.httpClient.get<User>(`${API.USER.MANAGEMENT}/${id}`);
  }

  getUserPosts(id: number): Observable<Post[]> {
    return this.httpClient.get<Post[]>(`${API.USER.URL}/posts/${id}`);
  }

  getUserThreads(id: number): Observable<Thread[]> {
    return this.httpClient.get<Thread[]>(`${API.USER.URL}/threads/${id}`);
  }

  getModerators(topicId: number): Observable<User[]> {
    return this.httpClient.get<User[]>(`${API.USER.URL}/moderators/${topicId}`);
  }

  editRole(id: number, role: Role): Observable<any> {
    return this.httpClient.post(`${API.USER.ROLE}/${id}?role=${role}`, {});
  }

  editManagements(id: number, managements: number[]): Observable<any> {
    return this.httpClient.post(`${API.USER.MANAGEMENT}/${id}`, {
      data: managements,
    });
  }

  updateProfile(user: User): Observable<any> {
    return this.httpClient.post(`${API.USER.URL}/update-profile`, user);
  }

  uploadAvatar(file): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.httpClient.post(`${API.USER.URL}/upload`, formData);
  }
}
