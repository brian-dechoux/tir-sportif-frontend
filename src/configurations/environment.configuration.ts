export class EnvironmentConfiguration {
  public readonly backendUrl: string;

  constructor() {
    const backendUrl = process.env.BACKEND_URL;
    this.backendUrl = backendUrl === undefined ? 'http://localhost:8080' : backendUrl;
  }
}

export default new EnvironmentConfiguration();
