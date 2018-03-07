import { Directive, ViewContainerRef, Input, HostListener } from '@angular/core';
import { SipDirective } from '../../core/extends/sip-helper';

@Directive({
    selector: '[sipRouterLink]'
})
export class RouterLinkDirective extends SipDirective {

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
