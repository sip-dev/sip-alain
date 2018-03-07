import { Injectable, ComponentFactoryResolver, ViewContainerRef, Optional, TemplateRef, ComponentRef, Type, ViewRef } from '@angular/core';

@Injectable()
/**
 * 在App生成一个容器服务，用于插入内容
 */
export class SipAppContainerService {

    constructor(
        private _cfr: ComponentFactoryResolver
    ) { }

    private _vcRef: ViewContainerRef;

    init(vcRef: ViewContainerRef) {
        if (this._vcRef) return;
        this._vcRef = vcRef;
    }

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

}
