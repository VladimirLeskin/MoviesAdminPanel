export enum ENavigationItemIds {
    FRAME_GUESS = "FRAME_GUESS"
}

export interface INavigationItem {
    id: ENavigationItemIds;
    title: string;
    iconClass: React.ComponentType;
}
