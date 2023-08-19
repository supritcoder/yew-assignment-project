import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/service/api.service';
import { UserDataModal } from 'src/modal/userdatamodal';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-billtopartymaster',
  templateUrl: './billtopartymaster.component.html',
  styleUrls: ['./billtopartymaster.component.css']
})
export class BillToPartyMasterComponent implements OnInit {
  billToPartyData: UserDataModal[] = [];
  SearchText = ''


  constructor(private apiService: ApiService, private toastr: ToastrService) {
  }
  confirmationModalOpen = false;

  openConfirmationModal() {
    this.confirmationModalOpen = true;
  }

  closeConfirmationModal() {
    this.confirmationModalOpen = false;
  }

  deleteItem() {
    // Perform the delete action here
    console.log('Item deleted');

    // Close the confirmation modal
    this.confirmationModalOpen = false;
  }



  ngOnInit(): void {
    this.fetchBillToPartyData();
  }

  fetchBillToPartyData(): void {

    this.apiService.getBillToPartyData().subscribe((res) => {
      this.billToPartyData = res.Table as UserDataModal[];

    })
  }

  edit(RowId: number) {
    this.apiService.rowId = RowId
  }

  deleteRow(id: number) {
    if (confirm(`Are you sure to delete the record`)) {
      this.apiService.deleteRow(id).subscribe((data) => {

        this.toastr.success("Data deleted successfully !!");
        setTimeout(() => {
          window.location.reload();
        }, 500); 
      });
    }
  }

}
