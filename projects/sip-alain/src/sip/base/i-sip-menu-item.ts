export interface ISipMenuItem {
    title?:string;
    icon?:string;
    group?:boolean;
    divider?:boolean;
    arg?:any;
    show?:boolean;
    open?:boolean;
    disabled?:boolean;
    onClick?:(item?:ISipMenuItem)=>void;
    children?:ISipMenuItem[];
}

