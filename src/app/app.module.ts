import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; 
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from 'src/service/api.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BillToPartyMasterComponent } from './views/pages/billtopartymaster/billtopartymaster.component';
import { SearchPipe } from './views/pages/billtopartymaster/search.pipe';
import { MasterpageComponent } from './views/pages/masterpage/masterpage.component';



@NgModule({
  declarations: [
    AppComponent,
    BillToPartyMasterComponent,
    MasterpageComponent,
    SearchPipe
  ],
  imports: [CommonModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(), 
    
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
