import { ISipMenuItem } from "./sip-menu-item";

export abstract class SipMenuChildren {
    addChild: (menu: ISipMenuItem) => void;
}
