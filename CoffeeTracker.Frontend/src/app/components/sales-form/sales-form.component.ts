import {Component, Input, Output, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import {SaleDto, CreateSaleDto, UpdateSaleDto} from '../../models/sale.model';
import {CoffeeDto} from '../../models/coffee.model';
import {ApiService, PaginationParams} from '../../services/api.service';

@Component({
  selector: 'app-sales-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sales-form">
      <form (ngSubmit)="onSubmit()" #saleForm="ngForm">
        <div class="form-group">
          <label for="coffeeId">Coffee:</label>
          <select
            id="coffeeId"
            name="coffeeId"
            [(ngModel)]="selectedCoffeeId"
            required
            #coffeeInput="ngModel"
            class="form-control"
          >
            <option [ngValue]="null">Select a coffee</option>
            @for (coffee of coffees; track coffee.id) {
              <option [ngValue]="coffee.id">{{coffee.name}} - {{coffee.price | currency:'USD':'symbol':'1.2-2'}}</option>
            }
          </select>
          @if (coffeeInput.invalid && coffeeInput.touched && selectedCoffeeId === null) {
            <div class="error-message">Please select a coffee</div>
          }
        </div>

        <div class="form-group">
          <label for="dateAndTimeOfSale">Date and Time:</label>
          <input
            type="datetime-local"
            id="dateAndTimeOfSale"
            name="dateAndTimeOfSale"
            [(ngModel)]="sale.dateAndTimeOfSale"
            #dateInput="ngModel"
            class="form-control"
          />
          <small class="form-text">Leave empty to use current date and time</small>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="saleForm.invalid || loading || selectedCoffeeId === null" class="btn btn-primary">
            {{isEditing ? 'Update Sale' : 'Add Sale'}}
          </button>
          <button type="button" (click)="onCancel()" class="btn btn-secondary">
            Cancel 
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./sales-form.component.css']
})
export class SalesFormComponent implements OnInit {
  @Input() sale: SaleDto = {id: 0, dateAndTimeOfSale: '', total: 0, coffeeName: '', coffeeId: 0};
  @Input() isEditing = false;
  @Output() save = new EventEmitter<CreateSaleDto | UpdateSaleDto>();
  @Output() cancel = new EventEmitter<void>();
  @ViewChild('saleForm') saleForm!: NgForm;

  coffees: CoffeeDto[] = [];
  loading = false;
  selectedCoffeeId: number | null = null; // Add this for the dropdown

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCoffees();
    // Create a copy to avoid modifying the original
    this.sale = {...this.sale};

    // Set selectedCoffeeId to null for new sales, or the actual value for editing
    this.selectedCoffeeId = this.isEditing ? this.selectedCoffeeId : null;

    // Convert backend date format to datetime-local format
    if (this.sale.dateAndTimeOfSale) {
      this.sale.dateAndTimeOfSale = this.convertToDateTimeLocal(this.sale.dateAndTimeOfSale);
    } else if (!this.isEditing) {
      // Set default date to now if not editing
      this.sale.dateAndTimeOfSale = this.getCurrentDateTime();
    }
  }

  private convertToDateTimeLocal(dateString: string): string {
    try {
      // Parse the date string from backend (handles the microseconds)
      const date = new Date(dateString);
      // Convert to datetime-local format (YYYY-MM-DDTHH:MM)
      // Offset for local timezone (same approach as getCurrentDateTime)
      const localTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      return localTime.toISOString().slice(0, 16);
    } catch (error) {
      console.error('Error parsing date: ', error);
      return '';
    }
  }

  loadCoffees(): void {
    this.loading = true;
    const paginationParams: PaginationParams = {
      page: 1,
      pageSize: 100 // Get all coffees
    };

    this.apiService.getPagedCoffees(paginationParams).subscribe({
      next: (data) => {
        this.coffees = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading coffees: ', err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.selectedCoffeeId && this.selectedCoffeeId === null) {
      const saleData = {
        coffeeId: this.selectedCoffeeId,
        dateAndTimeOfSale: this.sale.dateAndTimeOfSale ? this.formatDateForBackend(this.sale.dateAndTimeOfSale) : undefined
      };
      this.save.emit(saleData);
    }
  }

  private formatDateForBackend(dateTimeString: string): string {
    if (!dateTimeString) {
      return '';
    }

    const date = new Date(dateTimeString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Convert to 12-hour format
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;

    return `${month}-${day}-${year} ${displayHours}:${minutes} ${ampm}`;
  }

  onCancel(): void {
    this.selectedCoffeeId = null;
    this.sale = {id: 0, dateAndTimeOfSale: '', total: 0, coffeeName: '', coffeeId: 0};
    this.saleForm.resetForm();
    this.cancel.emit();
  }

  private getCurrentDateTime(): string {
    const now = new Date();
    // Offset for local timezone
    const localTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    return localTime.toISOString().slice(0, 16);
  }
}