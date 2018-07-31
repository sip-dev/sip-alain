//定义模型(model)
export interface PlayerModel {

    id?: number;
    name?: string;
    account_id?: number;
    account_name?: string;
    exp?: number;
    recoverexp?: number;
    x?: number;
    y?: number;
    z?: number;
    heading?: number;
    world_id?: number;
    gender?: string;
    race?: string;
    player_class?: string;
    creation_date?: string;
    last_online?: string;
    cube_size?: number;
    advanced_stigma_slot_size?: number;
    warehouse_size?: number;
    mailboxLetters?: number;
    mailboxUnReadLetters?: number;
    brokerKinah?: number;
    bind_point?: number;
    title_id?: number;
    online?: number;
    note?: string;
    repletionstate?: number;
    rebirth_id?: number;
    memberpoints?: number;
    marry_player_id?: number;
    marrytitle?: any;
    bg_points?: number;
    personal_rating?: number;
    arena_points?: number;

}