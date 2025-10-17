import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CoffeeDto } from '../models/coffee.model';
import { SaleDto, CreateSaleDto, UpdateSaleDto } from '../models/sale.model';

export interface PaginationParams {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortAscending?: boolean;
    name?: string;
    minPrice?: number;
    maxPrice?: number;
    id?: number;
    coffeeId?: number;
    minDateOfSale?: string;
    maxDateOfSale?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = 'http://localhost: 4200/api';
    constructor(private http: HttpClient) { }

    // Coffee API endpoints
    getPagedCoffees(paginationParams: PaginationParams): Observable<CoffeeDto[]> {
        const params = new HttpParams().set('page', paginationParams.page.toString()).set('pageSize', paginationParams.pageSize.toString());

        return this.http.get<CoffeeDto[]>(`${this.baseUrl}/coffees`, {params});
    }

    getCoffeeById(id: number): Observable<CoffeeDto> {
        return this.http.get<CoffeeDto>(`${this.baseUrl}/coffees/${id}`);
    }

    createCoffee(coffee: CoffeeDto): Observable<CoffeeDto> {
        return this.http.post<CoffeeDto>(`${this.baseUrl}/coffees`, coffee);
    }

    updateCoffee(id: number, coffee: CoffeeDto): Observable<any> {
        return this.http.put(`${this.baseUrl}/coffees/${id}`, coffee);
    }

    deleteCoffee(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/coffees/${id}`);
    }

    // Sale API endpoints
    getPagedSales(paginationParams: PaginationParams): Observable<SaleDto[]> {
        const params = new HttpParams().set('page', paginationParams.page.toString()).set('pageSize', paginationParams.pageSize.toString());

        return this.http.get<SaleDto[]>(`${this.baseUrl}/sales`, {params});
    }

    getSaleById(id: number): Observable<SaleDto> {
        return this.http.get<SaleDto>(`${this.baseUrl}/sales/${id}`);
    }

    createSale(sale: CreateSaleDto): Observable<SaleDto> {
        return this.http.post<SaleDto>(`${this.baseUrl}/sales`, sale);
    }

    updateSale(id: number, sale: UpdateSaleDto): Observable<any> {
        return this.http.put(`${this.baseUrl}/sales/${id}`, sale);
    }

    deleteSale(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/sales/${id}`);
    }
}