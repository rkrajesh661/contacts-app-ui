import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { PaginatedResponse } from '../models/paginatedResponse.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private apiUrl = 'http://localhost:5001/api/contacts';
  private searchQuery = new BehaviorSubject<string>('');
  private http = inject(HttpClient);

  getContacts(
    pageNumber: number = 1,
    pageSize: number = 2,
    searchTerm: string | null = null,
    sortBy: string | null = null,
    isAscending: boolean = true
  ): Observable<PaginatedResponse<Contact>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (searchTerm) params = params.set('searchTerm', searchTerm);
    if (sortBy) params = params.set('sortBy', sortBy);

    params = params.set('isAscending', isAscending);

    return this.http.get<PaginatedResponse<Contact>>(this.apiUrl, {
      params,
    });
  }

  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact);
  }

  updateContact(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${contact.id}`, contact);
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.next(query);
  }

  getSearchQuery(): Observable<string> {
    return this.searchQuery.asObservable();
  }
}
