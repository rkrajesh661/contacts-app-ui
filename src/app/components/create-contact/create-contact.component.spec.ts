import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContactComponent } from './create-contact.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Contact } from '../../models/contact.model';
import { By } from '@angular/platform-browser';

describe('CreateContactComponent', () => {
  let component: CreateContactComponent;
  let fixture: ComponentFixture<CreateContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateContactComponent],
      imports: [ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    const form = component.contactForm;
    expect(form).toBeTruthy();
    expect(form.controls['id'].value).toBeNull();
    expect(form.controls['firstName'].value).toBe('');
    expect(form.controls['lastName'].value).toBe('');
    expect(form.controls['email'].value).toBe('');
  });

  it('should update form values when input contact is provided', () => {
    const contact: Contact = { id: 1, firstName: 'Test', lastName: 'test', email: 'test@test.com' };
    component.contact = contact;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.contactForm.controls['firstName'].value).toBe(contact.firstName);
    expect(component.contactForm.controls['lastName'].value).toBe(contact.lastName);
    expect(component.contactForm.controls['email'].value).toBe(contact.email);
  });

  it('should reset the form when input contact is null', () => {
    component.contact = null;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.contactForm.controls['firstName'].value).toBe(null);
    expect(component.contactForm.controls['lastName'].value).toBe(null);
    expect(component.contactForm.controls['email'].value).toBe(null);
  });

  it('should emit the form value on valid form submission', () => {
    const contact: Contact = { id: 1, firstName: 'Test', lastName: 'test', email: 'test@test.com' };
    component.contactForm.setValue(contact); 
    spyOn(component.formSubmit, 'emit');
    const reset = spyOn(component.contactForm, 'reset');

    component.onSubmit();

    expect(component.formSubmit.emit).toHaveBeenCalledWith(contact);
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
