export interface GetShooterWithBillsListElementResponse {
  id: number;
  lastname: string;
  firstname: string;
}

export interface GetShooterFinanceResponse {
  lastname: string;
  firstname: string;
  unpaidBills: GetShooterBillResponse[];
  licenseBills: GetShooterBillResponse[];
  participationBills: GetShooterBillResponse[];
}

export interface GetShooterBillResponse {
  id: number;
  value: number;
  paid: boolean;
  paidDate?: string;
  priceType: string;
  challengeName?: string;
  startDate?: string;
  subscriptionDate?: string;
}
