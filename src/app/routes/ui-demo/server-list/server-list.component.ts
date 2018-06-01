import { Component, ViewContainerRef, forwardRef } from '@angular/core';
import { SipPage, SipNgInit, SipBusinessComponent } from 'sip-alain';

@Component({
    selector: 'sip-server-list',
    templateUrl: './server-list.component.html',
    styles: [],
    providers: [{ provide: SipBusinessComponent, useExisting: forwardRef(() => ServerListComponent) }]
})
export class ServerListComponent extends SipPage {

    constructor(vcf: ViewContainerRef) {
        super(vcf);
    }

    params = { id: '' };

    //等效于ngOnInit, 但可以多次使用
    @SipNgInit()
    private _init() {
        this.params = this.$params(this.params);
	}
	
	/**
	 * 基础demo数据可删除
	 */
	serverList = [
		{
			name:'基础资源',
			child:[
				{
					color:'text-red',
					icon:'fa fa-envelope',
					title:'实例',
					des:'自助选择服务器配置、操作系统和网络配置快速创建虚拟机，实例也称云服务器、云主机'
				},{
					color:'text-green',
					icon:'fa fa-cubes',
					title:'自定义镜像',
					des:'带有操作系统的云主机模板，提供主流的 Linux、Windows 模板，并根据上游厂商更新版本时及时制作新模板。用户也可以在将自己名下的云主机制作成模板，以备后用'
				},{
					color:'text-cyan',
					icon:'fa fa-life-saver',
					title:'实例备份',
					des:'实例备份可对实例中的所有本地硬盘中的数据进行备份与恢复，挂接的存储卷数据不会备份'
				},{
					color:'text-orange',
					icon:'fa fa-suitcase',
					title:'存储快照',
					des:'快照是存储卷的一个完全可用拷贝。快照的主要作用是能够进行在线数据备份与恢复'
				}
			]
		},{
			name:'数据库',
			child:[
				{
					color:'text-red',
					isimg:true,
					icon:'./assets/img/server.png',
					title:'实例',
					des:'自助选择服务器配置、操作系统和网络配置快速创建虚拟机，实例也称云服务器、云主机'
				},{
					color:'text-green',
					icon:'fa fa-cubes',
					title:'自定义镜像',
					des:'带有操作系统的云主机模板，提供主流的 Linux、Windows 模板，并根据上游厂商更新版本时及时制作新模板。用户也可以在将自己名下的云主机制作成模板，以备后用'
				},{
					color:'text-cyan',
					icon:'fa fa-life-saver',
					title:'实例备份',
					des:'实例备份可对实例中的所有本地硬盘中的数据进行备份与恢复，挂接的存储卷数据不会备份'
				}
			]
		}
		
	]

}