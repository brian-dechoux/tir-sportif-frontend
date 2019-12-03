export class EnvironmentConfiguration {
  public readonly backendUrl: string;

  constructor() {
    const backendUrl = process.env.BACKEND_URL;
    this.backendUrl = backendUrl === undefined ? 'https://localhost:8443' : backendUrl;
  }
}

export default new EnvironmentConfiguration();
