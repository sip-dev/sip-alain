import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { SipInit, SipInject, SipModal, SipNgDestroy, SipNgInit, SipPrepareData, SipProvideModals } from 'sip-alain';
import { FormComponent } from '../ui-demo-shared/components/form/form.component';
import { UserService } from '../ui-demo-shared/services/user.service';

@Component({
    selector: 'sip-list-form',
    templateUrl: './list-form.component.html',
    styles: [],
    providers: [...SipProvideModals(ListFormComponent)]
})
export class ListFormComponent extends SipModal {

    constructor(vcf: ViewContainerRef) {
        super(vcf);
    }

    params = { id: '', datas: null };
    loading = false;
    @ViewChild('form1') form1:FormComponent;

    //等效于ngOnInit, 但可以多次使用
    @SipNgInit()
    private _ngInit() {
        this.$logger.debug('_ngInit')
        this.params = this.$params(this.params);
        // if (this.params.datas)
            this.form1.form.$model = this.params.datas;
    }

    @SipInject(UserService)
    private _userSrv:UserService;

    @SipPrepareData()
    private _prepareData(owner:any) {
        this.$logger.debug('_prepareData', owner);
        return of(null).pipe(delay(1000), map(function(r){console.log('map')}));
    }

    @SipPrepareData()
    private _prepareData1(owner:any) {
        this.$logger.debug('_prepareData 1', owner);
        return of(null)
    }

    @SipInit()
    private _init() {
        this.$logger.debug('_init');
    }


    @SipInit()
    private _init1() {
        this.$logger.debug('_init1');
    }

    @SipNgDestroy()
    private _destroy() {
        this.$logger.debug('_destroy list from');
    }

    save() {
        let datas = this.form1.getSaveData();
        if (!datas) return;
        this.loading = true;
        this.$logger.debug('datas', datas);
        setTimeout(() => {
            this.loading = false;
            this.$close(true);
        }, 400);
        return;
    }

}