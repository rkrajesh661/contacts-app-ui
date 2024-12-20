import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactListComponent } from './contact-list.component';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';
import { of } from 'rxjs';
import { ModalComponent } from '../../shared/modal/modal.component';
import { CreateContactComponent } from '../create-contact/create-contact.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginatedResponse } from '../../models/paginatedResponse.model';

describe('ContactListComponent', () => {
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;
  let contactServiceMock: jasmine.SpyObj<ContactService>;

  const mockContacts: Contact[] = [
    { id: 1, firstName: 'Test1FirstName', lastName: 'Test1LastName', email: 'test1@test.com' },
    { id: 2, firstName: 'Test2FirstName', lastName: 'Test1LastName', email: 'test2@test.com' }
  ];
  const mockPaginatedResponse: PaginatedResponse<Contact> = {
      items: mockContacts,
      totalCount: 2
  };

  beforeEach(async () => {
    contactServiceMock = jasmine.createSpyObj('ContactService', [
      'getContacts', 
      'createContact', 
      'updateContact', 
      'deleteContact'
    ]);
    
    await TestBed.configureTestingModule({
      declarations: [
        ContactListComponent,
        ModalComponent,
        CreateContactComponent
      ],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        { provide: ContactService, useValue: contactServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
    contactServiceMock.getContacts.and.returnValue(of(mockPaginatedResponse));
    fixture.detectChanges(); 
  });

  it('should create', () => {  
    expect(component).toBeTruthy();
  });

  it('should load contacts on ngOnInit', () => { 
    contactServiceMock.getContacts.and.returnValue(of(mockPaginatedResponse));

    component.ngOnInit();
    fixture.detectChanges();

    expect(contactServiceMock.getContacts).toHaveBeenCalled();
    expect(component.contacts).toEqual(mockContacts);
    expect(component.totalItems).toBe(2);
  });

  it('should search contacts and reset page to 1', () => {
    const mockContacts = [
      { id: 1, firstName: 'Test1FirstName', lastName: 'Test1LastName', email: 'test1@test.com' }
    ];
    const mockPaginatedResponse: PaginatedResponse<Contact> = {
        items: mockContacts,
        totalCount: 1
    };
    contactServiceMock.getContacts.and.returnValue(of(mockPaginatedResponse));

    const event = { target: { value: 'Test1FirstName' } };

    component.onSearch(event);
    fixture.detectChanges();

    expect(component.searchTerm).toBe('Test1FirstName');
    expect(component.currentPage).toBe(1);
    expect(contactServiceMock.getContacts).toHaveBeenCalled();
    expect(component.contacts).toEqual(mockContacts);
  });

  it('should submit the form to create a new contact', () => {
    const mockContact: Contact = { id: 3, firstName: 'New', lastName: 'Contact', email: 'new@example.com' };
    contactServiceMock.createContact.and.returnValue(of(mockContact));

    component.modalType = 'create';
    component.selectedContact = mockContact;

    component.onFormSubmit(mockContact);
    fixture.detectChanges();

    expect(contactServiceMock.createContact).toHaveBeenCalledWith(mockContact);
    expect(component.contacts.length).toBe(2);
  });

  it('should update an existing contact on form submit', () => {
    const mockContact: Contact = { id: 1, firstName: 'Updated', lastName: 'Contact', email: 'updated@test.com' };
    contactServiceMock.updateContact.and.returnValue(of(mockContact));

    component.modalType = 'edit';
    component.selectedContact = mockContact;

    component.onFormSubmit(mockContact);
    fixture.detectChanges();

    expect(contactServiceMock.updateContact).toHaveBeenCalledWith(mockContact);
    expect(component.contacts.length).toBe(2);
  });

  it('should delete a contact', () => {
    const mockPaginatedResponse: PaginatedResponse<Contact> = {
        items: [
          { id: 1, firstName: 'Test1FirstName', lastName: 'Test1LastName', email: 'test1@test.com' }
        ],
        totalCount: 1
    };
    const mockContactId = 1;
    contactServiceMock.getContacts.and.returnValue(of(mockPaginatedResponse));
    contactServiceMock.deleteContact.and.returnValue(of());

    component.deleteContact(mockContactId);
    fixture.detectChanges();

    expect(contactServiceMock.deleteContact).toHaveBeenCalledWith(mockContactId);
    expect(component.modalVisible).toBeFalse();
  });

  it('should open the modal for creating a contact', () => {
    component.openModal('create');
    fixture.detectChanges();

    expect(component.modalVisible).toBeTrue();
    expect(component.modalType).toBe('create');
    expect(component.modalTitle).toBe('Create Contact');
  });

  it('should open the modal for editing a contact', () => {
    const mockContact: Contact = { id: 1, firstName: 'Test', lastName: 'test', email: 'test@test.com' };

    component.openModal('edit', mockContact);
    fixture.detectChanges();

    expect(component.modalVisible).toBeTrue();
    expect(component.modalType).toBe('edit');
    expect(component.selectedContact).toEqual(mockContact);
  });

  it('should close the modal', () => {
    component.closeModal();
    fixture.detectChanges();

    expect(component.modalVisible).toBeFalse();
    expect(component.selectedContact).toBeNull();
  });
});
