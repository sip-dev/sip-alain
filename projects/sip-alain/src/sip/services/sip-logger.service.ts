import { Injectable, Injector } from '@angular/core';
import { SipAlainConfig } from '../base/sip-alain-config';
import { SipLoggerLevel } from '../base/sip-logger-level';
import { SipLoggerOptions } from '../base/sip-logger-options';

const DEFAULT_OPTIONS: SipLoggerOptions = {
  level: SipLoggerLevel.WARN,
  global: true,
  globalAs: "sipLogger"
};

@Injectable()
export class SipLoggerService {
  private _level: SipLoggerLevel;
  private _globalAs: string;

  constructor(injector: Injector, config:SipAlainConfig) {

    // Move this to the constructor definition when optional parameters are working with @Injectable: https://github.com/angular/angular/issues/7344
    let { level, global, globalAs } = Object.assign({}, DEFAULT_OPTIONS, config.loggerOptions);

    this._level = level;
    this._globalAs = globalAs;

    global && this._global();

  }

  error(message?: any, ...optionalParams: any[]) {
    this.isErrorEnabled() && console.error.apply(console, arguments);
  }

  warn(message?: any, ...optionalParams: any[]) {
    this.isWarnEnabled() && console.warn.apply(console, arguments);
  }

  info(message?: any, ...optionalParams: any[]) {
    this.isInfoEnabled() && console.info.apply(console, arguments);
  }

  log(message?: any, ...optionalParams: any[]) {
    this.isLogEnabled() && console.log.apply(console, arguments);
  }

  private _global = () => (<any>window)[this._globalAs] = this;

  isErrorEnabled = (): boolean => this.level >= SipLoggerLevel.ERROR;
  isWarnEnabled = (): boolean => this.level >= SipLoggerLevel.WARN;
  isInfoEnabled = (): boolean => this.level >= SipLoggerLevel.INFO;
  isDebugEnabled = (): boolean => this.level >= SipLoggerLevel.DEBUG;
  isLogEnabled = (): boolean => this.level >= SipLoggerLevel.LOG;

  get level(): SipLoggerLevel { return this._level; }

  set level(level: SipLoggerLevel) {
    this._level = level;
  }

}
