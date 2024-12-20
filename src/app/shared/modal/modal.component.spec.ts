import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let closeModalSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    closeModalSpy = spyOn(component.closeModal, 'emit');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    expect(component.title).toBe('');
    expect(component.isVisible).toBe(false);
  });

  it('should display the title input in the template', () => {
    const title = 'Test Modal';
    component.title = title;
    fixture.detectChanges();
    
    const modalTitle: DebugElement = fixture.debugElement.query(By.css('.modal-title'));
    expect(modalTitle.nativeElement.textContent).toContain(title);
  });

  it('should emit closeModal event when close() is called', () => {
    component.close();
    expect(closeModalSpy).toHaveBeenCalled();
  });

  it('should display modal when isVisible is true', () => {
    component.isVisible = true;
    fixture.detectChanges();
    
    const modalElement: DebugElement = fixture.debugElement.query(By.css('.modal'));
    expect(modalElement).toBeTruthy();
  });

  it('should hide modal when isVisible is false', () => {
    component.isVisible = false;
    fixture.detectChanges();
    
    const modalElement: DebugElement = fixture.debugElement.query(By.css('.modal'));
    
    expect(modalElement).toBeTruthy();  
    const modalNativeElement = modalElement.nativeElement;
    expect(modalNativeElement.style.display).toBe('none');
  });
});
