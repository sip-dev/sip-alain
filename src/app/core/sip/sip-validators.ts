import { Validators, FormControl } from '@angular/forms';
import { Lib } from 'sip-lib';

export class SipValidators {
    static required(control: FormControl) {
        let ret = Validators.required(control);
        if (ret) ret.requiredText = '请输入或选择值';
        return ret;
    };
    static min(min: number) {
        let vFn = Validators.min(min);
        return function (control: FormControl) {
            let ret = vFn(control);
            if (ret) ret.minText = '不能小于：' + min;
            return ret;
        }
    };
    static max(max: number) {
        let vFn = Validators.max(max);
        return function (control: FormControl) {
            let ret = vFn(control);
            if (ret) ret.maxText = '不能大于：' + max;
            return ret;
        }
    };
    static minLength(min: number) {
        let vFn = Validators.minLength(min);
        return function (control: FormControl) {
            let ret = vFn(control);
            if (ret) ret.minLengthText = '长度不能小于：' + min;
            return ret;
        }
    };
    static maxLength(max: number) {
        let vFn = Validators.maxLength(max);
        return function (control: FormControl) {
            let ret = vFn(control);
            if (ret) ret.maxLengthText = '长度不能大于：' + max;
            return ret;
        }
    };
    static email(control: FormControl) {
        let ret = Validators.email(control);
        if (ret) ret.emailText = '非法email';
        return ret;
    };
    static pattern(pattern: string | RegExp) {
        let vFn = Validators.pattern(pattern);
        return function (control: FormControl) {
            let ret = vFn(control);
            if (ret) ret.patternText = '不匹配正则：' + pattern.toString();
            return ret;
        }
    };
    static range(min: number, max: number) {
        return function (control: FormControl) {
            let value = ~~control.value;
            if (value < min || value > max)
                return {
                    range: { min: min, max: max },
                    rangeText: Lib.format('范围：{0} - {1}', min, max)
                };
        };
    };
    static rangeLength(minLength: number, maxLength: number) {
        return function (control: FormControl) {
            let value = control.value;
            let len = value ? (value + '').length : 0;
            if (len < minLength || len > maxLength)
                return {
                    rangeLength: {
                        minLength: minLength, maxLength: maxLength
                    },
                    rangeLengthText: Lib.format('长度范围：{0} - {1}', minLength, maxLength)
                };
        };
    };
    static confirm(confirmControl: FormControl) {
        return function (control: FormControl): { [s: string]: boolean } {
            if (control.value !== confirmControl.value) {
                return { confirm: true, error: true };
            }
        };
    };
}
