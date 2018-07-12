import { Directive, HostListener, Input, ViewContainerRef } from '@angular/core';
import { SipDirective } from '../help/sip-helper';

@Directive({
    selector: '[sipRouterLink]'
})
export class SipRouterLinkDirective extends SipDirective {

    constructor(vcf: ViewContainerRef) {
        super(vcf);
    }

    @Input() sipRouterLink: any[];

    @HostListener('click')
    click() {
        if (this.sipRouterLink)
            this.$business.$navigate(this.sipRouterLink[0], this.sipRouterLink[1]);
    }

}
