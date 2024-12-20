import { TestBed } from '@angular/core/testing';

import { ContactService } from './contact.service';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Contact } from '../models/contact.model';
import { PaginatedResponse } from '../models/paginatedResponse.model';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;

  const mockContacts: Contact[] = [
    { id: 1, firstName: 'Test1 First',  lastName: 'test1 last', email: 'test1@test.com' },
    { id: 2, firstName: 'Test2 First',  lastName: 'test2 last', email: 'test2@test.com' },
  ];

  const mockPaginatedResponse: PaginatedResponse<Contact> = {
    items: mockContacts,
    totalCount: 2
  };

  const baseUrl = 'http://localhost:5001/api/contacts';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactService],
    });
    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getContacts', () => {
    it('should fetch contacts from the API', () => {
      service.getContacts(1, 2).subscribe((response) => {
        expect(response).toEqual(mockPaginatedResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}?pageNumber=1&pageSize=2&isAscending=true`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should include searchTerm in the request if provided', () => {
      const searchTerm = 'Test';

      service.getContacts(1, 2, searchTerm).subscribe((response) => {
        expect(response).toEqual(mockPaginatedResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}?pageNumber=1&pageSize=2&searchTerm=Test&isAscending=true`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should include sortBy and isAscending in the request if provided', () => {
      const sortBy = 'firstName';
      const isAscending = false;

      service.getContacts(1, 2, null, sortBy, isAscending).subscribe((response) => {
        expect(response).toEqual(mockPaginatedResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}?pageNumber=1&pageSize=2&sortBy=firstName&isAscending=false`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });
  });

  describe('createContact', () => {
    it('should create a new contact and return it', () => {
      const newContact: Contact = { id: 3, firstName: 'Test First Name', lastName: 'lastName', email: 'test@test.com' };

      service.createContact(newContact).subscribe((contact) => {
        expect(contact).toEqual(newContact);
      });

      const req = httpMock.expectOne(`${baseUrl}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newContact);
      req.flush(newContact);
    });
  });

  describe('updateContact', () => {
    it('should update an existing contact and return the updated contact', () => {
      const updatedContact: Contact = { id: 1, firstName: 'Test First Name', lastName: 'lastName', email: 'test.updated@test.com' };

      service.updateContact(updatedContact).subscribe((contact) => {
        expect(contact).toEqual(updatedContact);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedContact);
      req.flush(updatedContact);
    });
  });

  describe('deleteContact', () => {
    it('should delete a contact and return void', () => {
      const contactId = 1;

      service.deleteContact(contactId).subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('setSearchQuery', () => {
    it('should update the search query', () => {
      const query = 'Test';

      service.setSearchQuery(query);

      service.getSearchQuery().subscribe((searchQuery) => {
        expect(searchQuery).toBe(query);
      });
    });
  });

  describe('getSearchQuery', () => {
    it('should return the current search query', () => {
      const query = 'test';

      service.setSearchQuery(query);

      service.getSearchQuery().subscribe((searchQuery) => {
        expect(searchQuery).toBe(query);
      });
    });
  });
});
