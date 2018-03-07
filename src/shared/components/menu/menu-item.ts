export interface IMenuItem {
    title?:string;
    icon?:string;
    group?:boolean;
    divider?:boolean;
    show?:boolean;
    open?:boolean;
    disabled?:boolean;
    onClick?:(item?:IMenuItem)=>void;
    children?:IMenuItem[];
}
