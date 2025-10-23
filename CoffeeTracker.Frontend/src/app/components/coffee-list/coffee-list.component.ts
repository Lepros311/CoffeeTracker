import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService, PaginationParams} from '../../services/api.service';
import {CoffeeDto} from '../../models/coffee.model';
import {CoffeeFormComponent} from './coffee-form/coffee-form.component'
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'app-coffee-list',
    standalone: true,
    imports: [CommonModule, CoffeeFormComponent, ConfirmationModalComponent],
    template: `
        <div class="coffee-list">
            <h2>Coffee List</h2>

            @if (loading) {
                <div class="loading">Loading coffees...</div>
            }

            @if (error) {
                <div class="error">Error: {{error}}</div>
            }

            @if (!loading && !error) {
                <div class="coffees">
                    @for (coffee of coffees; track coffee.id) {
                        <div class="coffee-item">
                            <div class="coffee-info">
                              <h3>{{coffee.name}}</h3>
                              <p>Price: {{coffee.price}}</p>
                            </div>
                            <div class="coffee-actions">
                              <button class="edit-btn" (click)="editCoffee(coffee)">Edit</button>
                              <button class="delete-btn" (click)="confirmDelete(coffee)">Delete</button>
                            </div>
                        </div>
                    }
                </div>
            }

            @if (showForm) {
                <app-coffee-form
                    [coffee]="selectedCoffee"
                    [isEditing]="isEditing"
                    (save)="onSaveCoffee($event)"
                    (cancel)="onCancelForm()">
                </app-coffee-form>
            }

            @if (!showForm) {
                <button class="add-btn" (click)="addCoffee()">Add New Coffee</button>
            }

            <app-confirmation-modal
                [isVisible]="showDeleteModal"
                modalTitle="Delete Coffee"
                [message]="deleteMessage"
                (confirm)="deleteCoffee()"
                (cancel)="cancelDelete()">
            </app-confirmation-modal>
        </div>
    `,
    styleUrls: ['./coffee-list.component.css']
})
export class CoffeeListComponent implements OnInit {
    coffees: CoffeeDto[] = [];
    loading = false;
    error: string | null = null;
    showForm = false;
    isEditing = false;
    selectedCoffee: CoffeeDto = {id: 0, name: '', price: 0};

    showDeleteModal = false;
    coffeeToDelete: CoffeeDto | null = null;
    deleteMessage = '';

    constructor(private apiService: ApiService) {}

    ngOnInit(): void {
        this.loadCoffees();
    }

    loadCoffees(): void {
        this.loading = true;
        this.error = null;

        const paginationParams: PaginationParams = {
            page: 1,
            pageSize: 10
        };

        this.apiService.getPagedCoffees(paginationParams).subscribe({
            next: (data) => {
                this.coffees = data;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load coffees';
                this.loading = false;
                console.error('Error loading coffees: ', err);
            }
        });
    }

    addCoffee(): void {
        this.selectedCoffee = {id: 0, name: '', price: 0};
        this.isEditing = false;
        this.showForm = true;
    }

    editCoffee(coffee: CoffeeDto): void {
        this.selectedCoffee = {...coffee};
        this.isEditing = true;
        this.showForm = true;
    }

    onSaveCoffee(coffee: CoffeeDto): void {
        if (this.isEditing) {
            this.updateCoffee(coffee);
        } else {
            this.createCoffee(coffee);
        }
    }

    createCoffee(coffee: CoffeeDto): void {
        this.apiService.createCoffee(coffee).subscribe({
            next: () => {
                this.loadCoffees();
                this.showForm = false;
            },
            error: (err) => {
                this.error = 'Failed to create coffee';
                console.error('Error creating coffee: ', err);
            }
        });
    }

    updateCoffee(coffee: CoffeeDto): void {
        this.apiService.updateCoffee(coffee.id, coffee).subscribe({
            next: () => {
                this.loadCoffees();
                this.showForm = false;
            },
            error: (err) => {
                this.error = 'Failed to update coffee';
                console.error('Error updating coffee: ', err);
            }
        });
    }

    confirmDelete(coffee: CoffeeDto): void {
        this.coffeeToDelete = coffee;
        this.deleteMessage = `Are you sure you want to delete "${coffee.name}"? This action cannot be undown.`;
        this.showDeleteModal = true;
    }

    deleteCoffee(): void {
        if (this.coffeeToDelete) {
            this.apiService.deleteCoffee(this.coffeeToDelete.id).subscribe({
                next: () => {
                    this.loadCoffees();
                    this.showDeleteModal = false;
                    this.coffeeToDelete = null;
                },
                error: (err) => {
                    this.error = 'Failed to delete coffee';
                    console.error('Error deleting coffee: ', err);
                    this.showDeleteModal = false;
                    this.coffeeToDelete = null;
                }
            });
        }
    }

    cancelDelete(): void {
        this.showDeleteModal = false;
        this.coffeeToDelete = null;
    }

    onCancelForm(): void {
      this.showForm = false;
      this.selectedCoffee = {id: 0, name: '', price: 0};
    }
}