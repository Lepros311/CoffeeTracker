import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SaleDto, CreateSaleDto, UpdateSaleDto} from '../../models/sale.model';
import {CoffeeDto} from '../../models/coffee.model';
import {ApiService, PaginationParams} from '../../services/api.service';

@Component({
  selector: 'app-sales-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sales-form">
      <h3>{{isEditing ? 'Edit Sale' : 'Add New Sale'}}</h3>

      <form (ngSubmit)="onSubmit()" #saleForm="ngForm">
        <div class="form-group">
          <label for="coffeeId">Coffee:</label>
          <select
            id="coffeeId"
            name="coffeeId"
            [(ngModel)]="sale.coffeeId"
            required
            #coffeeInput="ngModel"
            class="form-control"
          >
            <option value="">Select a coffee</option>
            @for (coffee of coffees; track coffee.id) {
              <option [value]="coffee.id">{{coffee.name}} - $/{{coffee.price}}</option>
            }
          </select>
          @if (coffeeInput.invalid && coffeeInput.touched) {
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
          <button type="submit" [disabled]="saleForm.invalid" class="btn btn-primary">
            {{isEditing ? 'Update Sale' : 'Add Sale'}}
          </button>
          <button type="button" (click)="onCancel()" class="btn btn-secondary">
            Cancel 
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['././sales-form.component.css']
})
export class SalesFormComponent implements OnInit {
  @Input() sale: SaleDto = {id: 0, dateAndTimeOfSale: '', total: 0, coffeeName: '', coffeeId: 0};
  @Input() isEditing = false;
  @Output() save = new EventEmitter<CreateSaleDto | UpdateSaleDto>();
  @Output() cancel = new EventEmitter<void>();

  coffees: CoffeeDto[] = [];
  loading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCoffees();
    // Create a copy to avoid modifying the original
    this.sale = {...this.sale};

    // Set default date to now if not editing
    if (!this.isEditing && !this.sale.dateAndTimeOfSale) {
      this.sale.dateAndTimeOfSale = this.getCurrentDateTime();
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
    if (this.sale.coffeeId) {
      const saleData = {
        coffeeId: this.sale.coffeeId,
        dateAndTimeOfSale: this.sale.dateAndTimeOfSale || undefined
      };
      this.save.emit(saleData);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private getCurrentDateTime(): string {
    const now = new Date();
    // Formate for datetime-local input
    return now.toISOString().slice(0, 16);
  }
}