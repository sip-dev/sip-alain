import { ISipMenuItem } from "../../base/i-sip-menu-item";

export abstract class SipMenuChildren {
    addChild: (menu: ISipMenuItem) => void;
}
