import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_NoteObject, API_ResponseObject } from '../../interfaces/my-notes-app-interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  apiUrl = environment.apiUrl;
  controller = 'Note';
  constructor(private _http: HttpClient) { }
  getAll(): Observable<API_ResponseObject<API_NoteObject[]>> {
    return this._http.get<API_ResponseObject<API_NoteObject[]>>(
      `${this.apiUrl}/${this.controller}/Get`
    )
  }

  create(noteToCreate: API_NoteObject): Observable<API_ResponseObject<API_NoteObject>> {
    return this._http.post<API_ResponseObject<API_NoteObject>>(
      `${this.apiUrl}/${this.controller}/Create`,
      noteToCreate
    )
  }

  delete(noteId: number): Observable<API_ResponseObject<API_NoteObject>> {
    return this._http.delete<API_ResponseObject<API_NoteObject>>(
      `${this.apiUrl}/${this.controller}/Delete`,
      {
        params: {
          noteId
        }
      }
    )
  }
  edit(noteToEdit: API_NoteObject): Observable<API_ResponseObject<API_NoteObject>> {
    return this._http.put<API_ResponseObject<API_NoteObject>>(
      `${this.apiUrl}/${this.controller}/Update`,
      noteToEdit
    )
  }
  changeState(noteId: number): Observable<API_ResponseObject<API_NoteObject>> {
    return this._http.put<API_ResponseObject<API_NoteObject>>(
      `${this.apiUrl}/${this.controller}/ChangeState?NoteId=${noteId}`, {}
    )
  }
}
