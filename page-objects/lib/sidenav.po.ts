import {BasePO} from '@agnos-ui/base-po';

export const sidenavSelectors = {
	rootComponent: '',
};

export class SidenavPO extends BasePO {
	selectors = structuredClone(sidenavSelectors);

	override getComponentSelector(): string {
		return this.selectors.rootComponent;
	}
}
