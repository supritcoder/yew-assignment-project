import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillToPartyMasterComponent } from './views/pages/billtopartymaster/billtopartymaster.component';
import { MasterpageComponent } from './views/pages/masterpage/masterpage.component';

const routes: Routes = [
  {
    path:'',
    component:BillToPartyMasterComponent
  },
  {
    path:'add/update_data',
    component:MasterpageComponent
  }
  ,{
    path:'bill_to_party_master',
    component:BillToPartyMasterComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
