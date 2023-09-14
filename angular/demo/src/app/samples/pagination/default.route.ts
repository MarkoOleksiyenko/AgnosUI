import {AgnosUIAngularModule} from '@agnos-ui/angular';
import {Component} from '@angular/core';

@Component({
	standalone: true,
	imports: [AgnosUIAngularModule],
	template: `
		<h5>Basic pagination:</h5>
		<nav au-pagination [(page)]="page" [collectionSize]="60"></nav>

		<h5>No direction links:</h5>
		<nav au-pagination [collectionSize]="60" [(page)]="page" [directionLinks]="false"></nav>

		<h5>With boundary links:</h5>
		<nav au-pagination [collectionSize]="60" [(page)]="page" [boundaryLinks]="true"></nav>

		<div class="mb-3">
			Current page: <span id="defaultPage">{{ page }}</span>
		</div>

		<h5>Disabled pagination:</h5>
		<nav au-pagination [collectionSize]="60" [(page)]="pageAlone" ariaLabel="Disabled pagination" [disabled]="true"></nav>
	`,
})
export default class DefaultPaginationComponent {
	page = 4;
	pageAlone = 1;
}
