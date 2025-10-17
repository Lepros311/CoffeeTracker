import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService, PaginationParams} from '../../services/api.service';
import {CoffeeDto} from '../../models/coffee.model';

@Component({
    selector: 'app-coffee-list',
    standalone: true,
    imports: [CommonModule],
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
                            <h3>{{coffee.name}}</h3>
                            <p>Price: {{coffee.price}}</p>
                            <button (click)="editCoffee(coffee)">Edit</button>
                            <button (click)="deleteCoffee(coffee.id)">Delete</button>
                        </div>
                    }
                </div>
            }
        </div>
    `,
    styleUrls: ['./coffee-list.component.css']
})
export class CoffeeListComponent implements OnInit {
    coffees: CoffeeDto[] = [];
    loading = false;
    error: string | null = null;

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

    editCoffee(coffee: CoffeeDto): void {
        //TODO: Implement edit functionality
        console.log('Edit coffee: ', coffee);
    }

    deleteCoffee(id: number): void {
        //TODO: Implement delete functionality
        console.log('Delete coffee: ', id);
    }
}