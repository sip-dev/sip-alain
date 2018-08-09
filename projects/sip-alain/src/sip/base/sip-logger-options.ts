import { SipLoggerLevel } from "./sip-logger-level";

export interface SipLoggerOptions {
    level: SipLoggerLevel;
    global: boolean;
    globalAs: string;
}
