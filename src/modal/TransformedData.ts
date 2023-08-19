export interface PersonDetails {
    RowId: number;
    PersonName: string;
    PersonMobile: string;
    PersonEmail: string;
    Department: string;
    Designation: string;
  }
  
  export interface TransformedData {
    RowId: number;
    ActionId: number;
    Code: string;
    Name: string;
    Address: string;
    Country: string;
    State: string;
    City: string;
    Mobile: string;
    Email: string;
    GSTNo: string;
    PANNo: string;
    Latitude: string;
    Longitude: string;
    ContactPersonDetails: PersonDetails[];
  }
  