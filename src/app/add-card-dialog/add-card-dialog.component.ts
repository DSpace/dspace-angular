import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CardsApiFacadeService } from '../commons/facade/cards-api-facade.service';
@Component({
  selector: 'app-add-card-dialog',
  templateUrl: './add-card-dialog.component.html',
  styleUrls: ['./add-card-dialog.component.scss']
})
export class AddCardDialogComponent {
  card: FormGroup;
  submitted = false;
  @Output() rightPaneInitlized = new EventEmitter<string>();
  @Output() closePanel = new EventEmitter<boolean>();

  constructor(private cardAPIFacadeService: CardsApiFacadeService,
    private fb: FormBuilder) {
    this.card = this.fb.group({
      card_number: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiry_date: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      card_holder_name: ['', [Validators.required]]
    });
  }
  ngAfterViewInit(): void {
    this.rightPaneInitlized.emit('');

  }

  onCardNumberInput(event: any) {
    const input = event.target.value;

    // Remove non-numeric characters
    const numericInput = input.replace(/\D/g, '');

    // Limit to 16 digits
    const truncatedInput = numericInput.slice(0, 16);

    // Update the form control value
    this.card.get('card_number').setValue(truncatedInput);
  }

  onExpiryDateInput(event: any) {
    debugger;
    const input = event.target.value;
    const inputLength = input.length;
    const formattedInput = input.replace(/\D/g, ''); // Remove non-numeric characters
    const truncatedInput = formattedInput.slice(0, 4); // Limit to MM/YY format
    const parts = truncatedInput.match(/^(\d{0,2})(\d{0,2})$/);
    if (inputLength > 3) {
      if (parts) {
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        if ((month >= 1 && month <= 12) || month === 0) {
          // Allow zero as a placeholder for incomplete month input
          if (year >= 0 && year <= 99) {
            this.card.get('expiry_date').setValue(`${month === 0 ? '' : month}/${year}`);
          } else {
            this.card.get('expiry_date').setValue('');
          }
        } else {
          this.card.get('expiry_date').setValue('');
        }
      } else {
        this.card.get('expiry_date').setValue('');
      }
    }
  }

  onCVVInput(event: any) {
    const input = event.target.value;

    // Remove non-numeric characters
    const numericInput = input.replace(/\D/g, '');

    // Limit to 3 digits
    const truncatedInput = numericInput.slice(0, 3);

    // Update the form control value
    this.card.get('cvv').setValue(truncatedInput);
  }

  onNameInput(event: any) {
    const input = event.target.value;

    const upperCase = input.toUpperCase();
    // Update the form control value
    this.card.get('card_holder_name').setValue(upperCase);
  }

  saveCard() {
    this.submitted = true;
    if (this.card.valid) {
      this.cardAPIFacadeService.cardPost(this.card.value).pipe().subscribe((data) => {
        console.log(data);
        this.close();
      });
    }
    

  }

  close() {
    console.log('Emmited');
    console.log('Emmited');
    this.closePanel.emit(true);
  }

}
