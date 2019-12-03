import axios from 'axios';
import Configuration from 'configurations/environment.configuration'

const cli = axios.create({
  baseURL: Configuration.backendUrl,
  timeout: 3000
});

export default cli;