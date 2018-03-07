import { IMenuItem } from "./menu-item";

export abstract class MenuChildren {
    addChild: (menu: IMenuItem) => void;
}
