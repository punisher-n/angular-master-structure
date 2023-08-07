import { Component, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	closeResult = '';


  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService
    ) {}



    showSuccess() {
      this.toastr.success('Hello world!', 'Toastr fun!');
    }

	open(content: any) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with`;
			},
			(reason) => {
				this.closeResult = `Dismissed`;
			},
		);
	}


}
