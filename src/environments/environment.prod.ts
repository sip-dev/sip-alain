import { SipLoggerLevel } from 'sip-alain';

export const environment = {
  SERVER_URL: `./`,
  production: true,
  useHash: true,
  hmr: false,
  loggerLevel:SipLoggerLevel.WARN,
  MOCKMODULE: []
};
