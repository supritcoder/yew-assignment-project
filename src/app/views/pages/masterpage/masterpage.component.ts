import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/service/api.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContactPersonDetails } from 'src/modal/userdetailsmodal';
import { Observable, Subject } from 'rxjs';
import { PersonDetails } from 'src/modal/TransformedData';
import { Router } from '@angular/router';


@Component({
  selector: 'app-masterpage',
  templateUrl: './masterpage.component.html',
  styleUrls: ['./masterpage.component.css'],
})
export class MasterpageComponent implements OnInit {
  userDetailsFg: FormGroup;
  personalDetailFg: FormGroup;
  selectedItem: any;
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  selectedCountry: string = '';
  selectedState: string = '';
  selectedCity: string = '';
  tableData: any;
  contactDetals: ContactPersonDetails[] = [];
  submitted = false;
  ContactPersonDetails: PersonDetails[] = [];

  private LoadedSubject: Subject<boolean> = new Subject<boolean>();
  private LoadedSubject1: Subject<boolean> = new Subject<boolean>();

  countryLoaded$: Observable<boolean> = this.LoadedSubject.asObservable();
  stateLoaded$: Observable<boolean> = this.LoadedSubject1.asObservable();

  constructor(
    private apiService: ApiService,
    public fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.fetchCountry();
    this.userDetailsFg = this.fb.group({
      RowId: [''],
      ActionId: [0],
      Code: ['', Validators.required],
      Name: ['', Validators.required],
      Address: [''],
      Country: [''],
      State: [''],
      City: [''],
      Mobile: [''],
      Email: [''],
      GSTNo: [''],
      PANNo: [''],
      PinCode: [''],
      Latitude: [''],
      Longitude: [''],
      ContactPersonDetails: this.fb.array(
        [
          (this.personalDetailFg = this.fb.group({
            RowId: [''],
            PersonName: ['', Validators.required],
            PersonMobile: ['', [Validators.required]],
            PersonEmail: ['', Validators.email],
            Department: ['', Validators.required],
            Designation: ['', Validators.required],
          })),
        ],
        Validators.minLength(2)
      ),
    });
  }
  userDetailsGetControl(name: any): AbstractControl | null {
    return this.userDetailsFg.get(name);
  }
  personDetailsGetControl(name: any): AbstractControl | null {
    return this.personalDetailFg.get(name);
  }
  mobileNumberValidator() { }

  ngOnInit(): void {
    if (this.apiService.rowId !== 0) {
      this.apiService
        .getuserDetails(this.apiService.rowId)
        .subscribe((data) => {
          this.userDetailsFg.controls['RowId'].setValue(this.apiService.rowId);
          this.tableData = data.Table[0];
          if (this.tableData) {
            this.userDetailsFg.patchValue({
              GSTNo: this.tableData.GSTNo,
              PANNo: this.tableData.PANNo,
              Code: this.tableData.Code,
              Name: this.tableData.Name,
              Address: this.tableData.Address,
              PinCode: this.tableData.Pincode,
              Mobile: this.tableData.Phone,
              Email: this.tableData.Email,
              Latitude: this.tableData.Latitude,
              Longitude: this.tableData.Longitude,
            });
            this.selectedCountry = this.tableData.Country;
            this.selectedState = this.tableData.State;
            this.selectedCity = this.tableData.City;
          }
          for (const rowData of data.Table1) {
            this.contactDetals.push(rowData);
          }
          this.ContactPersonDetails = this.transformContactPersonDetails(
            this.contactDetals
          );
        });
    }

    this.countryLoaded$.subscribe((loaded) => {
      if (loaded) {
        this.setCountryCode(this.selectedCountry);
      }
    });

    this.stateLoaded$.subscribe((loaded) => {
      if (loaded) {
        this.setStateCode(this.selectedState);
      }
    });
  }

  fetchCountry() {
    this.apiService.getCountries().subscribe((data) => {
      this.countries = data;

      this.LoadedSubject.next(true);
    });
  }
  onCountryChange() {
    //@ts-ignore
    const selectedCountry = this.userDetailsFg.get('Country').value;

    if (selectedCountry) {
      this.apiService.getStatesByCountry(selectedCountry).subscribe((data) => {
        this.states = data;
        this.cities = [];
        this.LoadedSubject1.next(true);
      });
    }
  }

  onStateChange() {
    //@ts-ignore
    const selectedCountry = this.userDetailsFg.get('Country').value;
    //@ts-ignore
    const selectedState = this.userDetailsFg.get('State').value;
    if (selectedCountry && selectedState) {
      this.apiService
        .getCitiesByState(selectedCountry, selectedState)
        .subscribe((data) => {
          this.cities = data;
        });
      if (this.selectedCity) {
        this.userDetailsFg.controls['City'].setValue(this.selectedCity);
      }
    }
  }

  getdata() {
    //@ts-ignore
    this.selectedCity = this.form1.get('selectedCity').value;
  }
  getCountryName() {
    //@ts-ignore
    const selectedCountryCode = this.userDetailsFg.get('Country').value;
    return (this.selectedCountry =
      this.countries.find((country) => country.iso2 == selectedCountryCode)
        ?.name || '');
  }
  setCountryCode(countryName: string) {
    const selectedCountry = this.countries.find(
      (country) => country.name == countryName
    );
    this.userDetailsFg.controls['Country'].setValue(
      selectedCountry ? selectedCountry.iso2 : ''
    );
  }
  getStateName() {
    //@ts-ignore
    const selectedStateCode = this.userDetailsFg.get('State').value;
    return (this.selectedState =
      this.states.find((state) => state.iso2 == selectedStateCode)?.name || '');
  }
  setStateCode(stateName: string) {
    const selectedState = this.states.find((state) => state.name == stateName);
    this.userDetailsFg.controls['State'].setValue(
      selectedState ? selectedState.iso2 : ''
    );
  }
  addContact() {
    if (this.personalDetailFg.valid) {
      const newContact: any = {
        PersonName: this.personalDetailFg.value.PersonName,
        PersonMobile: this.personalDetailFg.value.PersonMobile,
        PersonEmail: this.personalDetailFg.value.PersonEmail,
        Department: this.personalDetailFg.value.Department,
        Designation: this.personalDetailFg.value.Designation,
      };

      this.ContactPersonDetails.push(newContact);
      this.personalDetailFg.reset();
    } else {
      this.userDetailsFg.markAllAsTouched();
      this.personalDetailFg.markAllAsTouched();
    }
  }

  clearContact() {
    this.personalDetailFg.reset();
  }

  deleteContact(contact: any, index: number): void {
    this.ContactPersonDetails.splice(index, 1);
  }

  editContact(contact: any, index: number) {
    this.personalDetailFg.markAllAsTouched();
    this.personalDetailFg.patchValue({
      PersonName: contact.PersonName,
      PersonMobile: contact.PersonMobile,
      PersonEmail: contact.PersonEmail,
      Department: contact.Department,
      Designation: contact.Designation,
    });
    this.ContactPersonDetails.splice(index, 1);
  }
  transformContactPersonDetails(oldArray: ContactPersonDetails[]) {
    return oldArray.map((item) => ({
      RowId: item.RowId,
      PersonName: item.Name,
      PersonMobile: item['Mobile No'],
      PersonEmail: item.Email,
      Department: item.Department,
      Designation: item.Designation,
    }));
  }

  saveDataValidation() {
  // Scroll to the top of the page smoothly
window.scrollTo({ top: 0, behavior: 'smooth' });

// Get values from form controls
const code = this.userDetailsFg.get('Code')?.value;
const name = this.userDetailsFg.get('Name')?.value;

// Check if there are at least 2 contact details
if (this.ContactPersonDetails.length >= 2) {
    // Loop through each contact person
    for (const contact of this.ContactPersonDetails) {
        // Check if any required details are empty
        if (
            contact.PersonName === '' ||
            contact.PersonMobile === '' ||
            contact.Department === '' ||
            contact.Designation === ''
        ) {
            // Show warning and return if any required data is missing
            this.toastr.warning(
                contact.PersonName + ' data is empty. Click on the edit icon on the table to add data.'
            );
            return; 
        }

        // Check for valid email or mobile number
        if (contact.PersonEmail !== '' || contact.PersonMobile !== '') {
            if (contact.PersonEmail !== '') {
                // Validate email format
                const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.PersonEmail);

                if (!isValidEmail) {
                    // Show warning for invalid email
                    this.toastr.warning('Email format is invalid. Please edit the Email');
                    return;
                }
            }
            if (contact.PersonMobile !== '') {
                // Validate mobile number format
                const isValidMobileNumber = /^\d{10}$/.test(contact.PersonMobile);
                if (!isValidMobileNumber) {
                    // Show warning for invalid mobile number
                    this.toastr.warning(
                        contact.PersonName + ' Mobile number should be 10 digits. Please edit the Mobile No'
                    );
                    return;
                }
            }
        }
    }
    
    // If all checks pass, save the data
    if (code !== '' && name !== '') {
        this.saveData();
    }
} else {
    // Mark form controls as touched and show error messages
    this.userDetailsFg.controls['Code'].markAsTouched();
    this.userDetailsFg.controls['Name'].markAsTouched();
    this.toastr.error('you need to add at least 2 person contact details');
    this.toastr.warning('click on the add button to add person contact details');
}

  }


  saveData() {
    const userDetails = this.userDetailsFg.value;
    const countryName = this.getCountryName();
    const stateName = this.getStateName();

    userDetails.Country = countryName;
    userDetails.State = stateName;
    this.userDetailsFg.patchValue({
      Country: countryName,
      State: stateName,
    });

    const transformedData = {
      ...userDetails, // Spread operator to include all properties
      ContactPersonDetails: this.ContactPersonDetails,
    };
    const jsonData = JSON.stringify(transformedData);
    console.log(jsonData);

    this.apiService.saveData(transformedData).subscribe((data) => {
      this.toastr.success('Data Save sucessfully')
      this.router.navigate(['']);

    });

  }

}
