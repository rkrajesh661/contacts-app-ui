import { Component, inject, OnInit } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent implements OnInit {
  private contactService = inject(ContactService);

  contacts: Contact[] = [];
  totalItems = 0;
  searchTerm: string | null = null;
  sortBy: string | null = null;
  isAscending = true;
  selectedContact: Contact | null = null;

  modalVisible = false;
  modalType: 'create' | 'edit' | 'delete' = 'create';
  modalTitle = '';
  currentPage = 1;
  itemsPerPage = 0;

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactService
      .getContacts(
        this.currentPage,
        this.itemsPerPage,
        this.searchTerm,
        this.sortBy,
        this.isAscending
      )
      .subscribe((response) => {
        this.contacts = response.items;
        this.totalItems = response.totalCount;
      });
  }

  onSearch(event: any): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.trim();
    this.currentPage = 1;
    this.loadContacts();
  }

  onFormSubmit(contact: Contact): void {
    if (this.modalType === 'edit') {
      this.contactService.updateContact(contact).subscribe(() => {
        this.loadContacts();
        this.closeModal();
      });
    } else if (this.modalType === 'create') {
      this.contactService.createContact(contact).subscribe(() => {
        this.loadContacts();
        this.closeModal();
      });
    }
  }

  deleteContact(id: number): void {
    this.contactService.deleteContact(id).subscribe(() => {
      this.loadContacts();
      this.closeModal();
    });
  }

  openModal(type: 'create' | 'edit' | 'delete', contact?: Contact): void {
    this.modalType = type;
    this.modalTitle =
      type === 'create' ? 'Create Contact' : type === 'edit' ? 'Edit Contact' : 'Delete Contact';
    this.selectedContact = contact || null;
    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
    this.selectedContact = null;
  }
}
