//定义模型(model)
export class TableData {

    num?: string = "";
    name?: string = "";
    status?: string = "";
    statusname?: string = "";
    region?: string = "";
    ip?: string = "";
    spec?: string = "";
    user?: string = "";
    date?: string = "";

    constructor(p?:TableData) {
        if (p){
            Object.assign(this, p);
        }
    }
}