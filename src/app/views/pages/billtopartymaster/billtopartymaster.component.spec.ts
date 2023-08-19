import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillToPartyMasterComponent } from './billtopartymaster.component';

describe('BillToPartyMasterComponent', () => {
  let component: BillToPartyMasterComponent;
  let fixture: ComponentFixture<BillToPartyMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillToPartyMasterComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BillToPartyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
