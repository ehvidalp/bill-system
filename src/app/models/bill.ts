export interface Bill{
  id?: string;
  providerId: string;
  serie: string;
  numberBill: string;
  date: Date | number;
  total: number;
  iva: number;
  subTotal: number;
  createdBy: string;
  file: any;
  nit?: string;
  category: string;
  tradename?: string;
  totalBills?: number;
  sumTotal?: number;
}
