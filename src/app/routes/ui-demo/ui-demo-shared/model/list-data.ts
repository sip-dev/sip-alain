//定义模型(model)
export class ListData {

    Instance_ID?: string = "";
    Instance_Code?: string = "";
    REGION_ID?: string = "";
    REGION_NAME?: string = "";
    Elastic_IP_ID?: any = null;
    CPU?: number = 0;
    RAM?: number = 0;
    KEYPAIR_ID?: string = "";
    Support_Auto_Scaling?: boolean = false;
    AMI?: string = "";
    CHARGE_OPTION?: string = "";
    Instance_Type?: string = "";
    Public_DNS?: any = null;
    Private_DNS?: any = null;
    Public_Ip_Address?: string = "";
    Private_Ip_Address?: string = "";
    Key_Name?: string = "";
    Groups?: string = "";
    Zone_ID?: string = "";
    Title?: string = "";
    Platform?: string = "";
    Host_Address?: string = "";
    Owner_Id?: string = "";
    Creator_ID?: string = "";
    Creator_Name?: string = "";
    Tag?: any = null;
    SERVICE_ID?: string = "";
    Product_ID?: any = null;
    Allow_Api_Termination?: boolean = false;
    Create_Time?: string = "";
    Instance_Size?: number = 0;
    Image_Size?: number = 0;
    Image_Name?: string = "";
    PENDING_PROGRESS?: any = null;
    RES_SOURCE?: any = null;
    OPER_NAME?: any = null;
    OPER_PROGRESS?: any = null;
    KEYPAIR_NAME?: string = "";
    PRDT_TYPE?: string = "";
    BIZ_STATUS?: number = 0;
    IS_DEFAULT?: boolean = false;
    Status?: string = "";
    SecurityGroupID?: string = "";
    Security_Group_Name?: string = "";
    bandwidth?: number = 0;
    IP_COUNT?: number = 0;
    Address?: string = "";
    IP_DETAIL?: any = null;
    IP_NAME?: string = "";
    projectId?: string = "";
    projectName?: string = "";
    AlterStatus?: any = null;
    AlterVersion?: string = "";
    orderId?: string = "";
    isImported?: number = 0;
    deployAgentStatus?: number = 0;
    expireTime?: any = null;
    supportAutoDeploy?: boolean = false;
    ec2Version?: string = "";
    imageCanModify?: number = 0;
    machineCode?: any = null;

    constructor(p?:ListData) {
        if (p){
            Object.assign(this, p);
        }
    }
}