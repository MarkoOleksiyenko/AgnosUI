import {BasePO} from '@agnos-ui/base-po';

export const drawerSelectors = {
	rootComponent: '',
};

export class DrawerPO extends BasePO {
	selectors = structuredClone(drawerSelectors);

	override getComponentSelector(): string {
		return this.selectors.rootComponent;
	}
}
