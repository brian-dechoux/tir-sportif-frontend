import cli from '../configurations/http-client.configuration';
import { AxiosResponse } from 'axios';
import { AuthenticationResponse } from './models/auth.model';

class AuthService {

  login(username: string, password: string): Promise<AxiosResponse<AuthenticationResponse>> {
    const payload = {
      username: username,
      password: password
    };
    return cli.post("/authentication/login", payload);
  }

  logout(): Promise<AxiosResponse<null>> {
    return cli.post("/authentication/logout");
  }

}

export default new AuthService();
