import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService, PaginationParams} from '../../services/api.service';
import {SaleDto, CreateSaleDto, UpdateSaleDto} from '../../models/sale.model';
import {SalesFormComponent} from '../sales-form/sales-form.component';
import {ConfirmationModalComponent} from '../confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'app-sales-list',
    standalone: true,
    imports: [CommonModule, SalesFormComponent, ConfirmationModalComponent],
    template: `
      <div class="sales-list">
        <h2>Sales Records</h2>

        @if (loading) {
          <div class="loading">Loading sales...</div>
        }

        @if (error) {
          <div class="error">Error: {{error}}</div>
        }

        @if (!loading && !error) {
          <div class="sales">
            @for (sale of sales; track sale.id) {
              <div class="sale-item">
                <div class="sale-info">
                  <h3>{{sale.coffeeName}}</h3>
                  <p>Date: {{sale.dateAndTimeOfSale | date: 'short'}}</p>
                  <p>Total: {{sale.total}}</p>
                </div>
                <div class="sale-actions">
                  <button class="edit-btn" (click)="editSale(sale)">Edit</button>
                  <button class="delete-btn" (click)="confirmDelete(sale)">Delete</button>
                </div>
              </div>
            }
          </div>
        }

        @if (showForm) {
          <app-sales-form
            [sale]="selectedSale"
            [isEditing]="isEditing"
            (save)="onSaveSale($event)"
            (cancel)="onCancelForm()">
          </app-sales-form>
        }

        @if (!showForm) {
          <button class="add-btn" (click)="addSale()">Add New Sale</button>
        }

        <app-confirmation-modal
          [isVisible]="showDeleteModal"  
          modalTitle="Delete Sale"
          [message]="deleteMessage"  
          (confirm)="deleteSale()"  
          (cancel)="cancelDelete()">
        </app-confirmation-modal>
      </div>
    `,
    styleUrls: ['././sales-list.component.css']
})
export class SalesListComponent implements OnInit {
  sales: SaleDto[] = [];
  loading = false;
  error: string | null = null;
  showForm = false;
  isEditing = false;
  selectedSale: SaleDto = {id: 0, dateAndTimeOfSale: '', total: 0, coffeeName: '', coffeeId: 0};

  // Modal state
  showDeleteModal = false;
  saleToDelete: SaleDto | null = null;
  deleteMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.loading = true;
    this.error = null;

    const paginationParams: PaginationParams = {
      page: 1,
      pageSize: 10
    };

    this.apiService.getPagedSales(paginationParams).subscribe({
      next: (data) => {
        this.sales = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load sales';
        this.loading = false;
        console.error('Error loading sales: ', err);
      }
    });
  }

  addSale(): void {
    this.selectedSale = {id: 0, dateAndTimeOfSale: '', total: 0, coffeeName: '', coffeeId: 0};
    this.isEditing = false;
    this.showForm = true;
  }

  editSale(sale: SaleDto): void {
    this.selectedSale = {...sale};
    this.isEditing = true;
    this.showForm = true;
  }

  onSaveSale(saleData: CreateSaleDto | UpdateSaleDto): void {
    if (this.isEditing) {
      this.updateSale(saleData as UpdateSaleDto);
    } else {
      this.createSale(saleData as CreateSaleDto);
    }
  }

  createSale(sale: CreateSaleDto): void {
    this.apiService.createSale(sale).subscribe({
      next: () => {
        this.loadSales();
        this.showForm = false;
      },
      error: (err) => {
        this.error = 'Failed to create sale';
        console.error('Error creating sale: ', err);
      }
    });
  }

  updateSale(sale: UpdateSaleDto): void {
    if (this.selectedSale.id) {
      this.apiService.updateSale(this.selectedSale.id, sale).subscribe({
        next: () => {
          this.loadSales();
          this.showForm = false;
        },
        error: (err) => {
          this.error = 'Failed to update sale';
          console.error('Error updating sale: ', err);
        }
      });
    }
  }

  confirmDelete(sale: SaleDto): void {
    this.saleToDelete = sale;
    this.deleteMessage = `Are you sure you want to delete the sale of "${sale.coffeeName}"? This action cannot be undone.`;
    this.showDeleteModal = true;
  }

  deleteSale(): void {
    if (this.saleToDelete) {
      this.apiService.deleteSale(this.saleToDelete.id).subscribe({
        next: () => {
          this.loadSales();
          this.showDeleteModal = false;
          this.saleToDelete = null;
        },
        error: (err) => {
          this.error = 'Failed to delete sale';
          console.error('Error deleting sale: ', err);
          this.showDeleteModal = false;
          this.saleToDelete = null;
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.saleToDelete = null;
  }

  onCancelForm(): void {
    this.showForm = false;
    this.selectedSale = {id: 0, dateAndTimeOfSale: '', total: 0, coffeeName: '', coffeeId: 0};
  }
}