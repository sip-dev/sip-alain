import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentFactoryResolver, ComponentRef, EventEmitter, Injectable, TemplateRef, Type, ViewContainerRef, ViewRef } from '@angular/core';
import { SipAppContainerComponent } from '../components/sip-app-container.component';

@Injectable()
/**
 * 在App生成一个容器服务，用于插入内容
 */
export class SipAppContainerService {
    private _app_containt_c: SipAppContainerComponent;
    constructor(
        private _overlay: Overlay,
        private _cfr: ComponentFactoryResolver
    ) {
        let overlayRef = this._overlay.create();
        let compRef = overlayRef.attach(new ComponentPortal(SipAppContainerComponent));
        this._app_containt_c = compRef.instance;
    }

    private get _vcRef(): ViewContainerRef{
        let cmp = this._app_containt_c;
        return cmp && cmp.vcRef;
    };
    get _contextmenu(): TemplateRef<any> {
        let cmp = this._app_containt_c;
        return cmp && cmp.contextmenu;
    };

    /**
     * 
     * @param tmpl TemplateRef内容
     */
    appendTemplate(tmpl: TemplateRef<any>, context?: any): ViewRef {
        let vcRef = this._vcRef;
        let view = vcRef.insert(tmpl.createEmbeddedView(context))
        return view;
    }

    /**
     * 
     * @param type 组件类名
     * @param params 传入参数
     */
    appendComponent<T=any>(type: Type<T>, params?: Object, cfr?: ComponentFactoryResolver): ComponentRef<T> {
        cfr || (cfr = this._cfr);
        let vcRef = this._vcRef;
        let componentFactory = cfr.resolveComponentFactory<T>(type);
        let compRef = vcRef.createComponent<T>(componentFactory);

        if (params) {
            let instance: any = compRef.instance;
            Object.assign(instance, params);
        }

        return compRef;
    }

    onDestroy: EventEmitter<any> = new EventEmitter<any>();

}
