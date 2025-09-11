import {BasePO} from '@agnos-ui/base-po';

export class SidenavDemoPO extends BasePO {
	override getComponentSelector(): string {
		return '.container';
	}
}
