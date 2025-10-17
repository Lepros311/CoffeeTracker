export interface SaleDto {
    id: number; 
    dateAndTimeOfSale: string;
    total: number;
    coffeeName: string;
    coffeeId: number;
}

export interface CreateSaleDto {
    coffeeId: number;
    dateAndTimeOfSale?: string;
}

export interface UpdateSaleDto {
    coffeeId?: number;
    dateAndTimeOfSale?: string;
}