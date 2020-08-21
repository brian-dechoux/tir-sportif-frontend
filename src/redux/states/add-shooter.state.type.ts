export interface AddShooterState {
  callback: () => Promise<number>;
  firstname: string;
  lastname: string;
  resolved: boolean;
}

export default AddShooterState;
