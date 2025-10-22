import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService, PaginationParams} from '../../services/api.service';
import {SaleDto} from '../../models/sale.model';

@Component({
    selector: 'app-sales-list',
    standalone: true,
    imports: [CommonModule],
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

        @if (!showForm) {
          <button class="add-btn" (click)="addSale()">Add New Sale</button>
        }
      </div>
    `,
    styleUrls: ['././sales-list.component.css']
})
export class SalesListComponent implements OnInit {
  sales: SaleDto[] = [];
  loading = false;
  error: string | null = null;
  showForm = false;

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
    // TODO: Implement add sale
    console.log('Add sale');
  }

  editSale(sale: SaleDto): void {
    // TODO: Implement edit sale
    console.log('Edit sale: ', sale);
  }

  confirmDelete(sale: SaleDto): void {
    // TODO Implement delete confirmation
    console.log('Delete sale: ', sale);
  }
}