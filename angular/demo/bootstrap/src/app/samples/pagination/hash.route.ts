import {AgnosUIAngularModule, toAngularSignal} from '@agnos-ui/angular-bootstrap';
import {hash$} from '@agnos-ui/common/samples/utils/hashUtil';
import {Component, computed} from '@angular/core';
@Component({
	imports: [AgnosUIAngularModule],
	template: `
		<p>A pagination with hrefs provided for each pagination element:</p>
		<p>
			Page hash: <small>{{ '#' + hash() }}</small>
		</p>
		<nav
			auPagination
			auCollectionSize="60"
			auBoundaryLinks="true"
			[auPage]="pageNumber()"
			[auPageLink]="pageLink"
			(auPageChange)="pageChange($event)"
			auAriaLabel="Page navigation with customized hrefs"
		></nav>
	`,
})
export default class HashPaginationComponent {
	hash = toAngularSignal(hash$);

	readonly pageNumber = computed(() => +(this.hash().split('#')[1] ?? 4));

	pageLink = (currentPage: number) => `#${this.hash().split('#')[0]}#${currentPage}`;

	pageChange = (currentPage: number) => (location.hash = `#${this.hash().split('#')[0]}#${currentPage}`);
}
