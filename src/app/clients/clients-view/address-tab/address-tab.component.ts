import { filter } from 'rxjs/operators';
/** Angular Imports */
import { Component } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormfieldBase } from 'app/shared/form-dialog/formfield/model/formfield-base';
import { InputBase } from 'app/shared/form-dialog/formfield/model/input-base';
import { SelectBase } from 'app/shared/form-dialog/formfield/model/select-base';

/** Custom Components */
import { FormDialogComponent } from 'app/shared/form-dialog/form-dialog.component';

/** Custom Services */
import { ClientsService } from '../../clients.service';
import { PouchdbService } from '../../../pouchdb/pouchdb.service';
import { Subject } from 'rxjs';

/**
 * Clients Address Tab Component
 */
@Component({
  selector: 'mifosx-address-tab',
  templateUrl: './address-tab.component.html',
  styleUrls: ['./address-tab.component.scss'],
})
export class AddressTabComponent {
  /** Client Address Data */
  clientAddressData: any;
  /** Client Address Field Config */
  clientAddressFieldConfig: any;
  /** Client Address Template */
  clientAddressTemplate: any;
  /** Client Id */
  clientId?: string | null;
  couchdb_provinces: any[] = [];
  couchdb_districts: any[] = [];
  couchdb_wards: any[] = [];
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];

  /**
   * @param {ActivatedRoute} route Activated Route
   * @param {ClientsService} clientService Clients Service
   * @param {MatDialog} dialog Mat Dialog
   */
  constructor(private route: ActivatedRoute,
    private clientService: ClientsService,
    private dialog: MatDialog,
    private pdb: PouchdbService
  )
  {
    this.route.data.subscribe((data: {clientAddressData: any; clientAddressFieldConfig: any; clientAddressTemplateData: any; }| Data) => {
        this.clientAddressData = data.clientAddressData;
        this.clientAddressFieldConfig = data.clientAddressFieldConfig;
        this.clientAddressTemplate = data.clientAddressTemplateData;
        this.clientId = this.route.parent?.snapshot.paramMap.get('clientId');
        // this.clientService.getClientProvince().subscribe((res: any) => {
        //   this.provinces = res.result.listAddressProvince;
        // });
        this.pdb.init("masterdata_address");
        this.initMasterData();
        this.clientAddressData.map((item: any) => {
          this.getDistrictName(item);
          this.getTownVillageName(item);
        });
      }
    );
  }

  initMasterData() {
    this.getMasterDataProvinces();
    this.getMasterDataDistricts();
    this.getMasterDataWards();
  }

  async getMasterDataProvinces() {
    this.couchdb_provinces = await this.pdb.getItem("masterdata_provinces", false);
    if (this.couchdb_provinces) {
      delete this.couchdb_provinces['_id'];
      delete this.couchdb_provinces['_rev'];
      delete this.couchdb_provinces['time'];
      for (let key in this.couchdb_provinces) {
        let value = this.couchdb_provinces[key];
        this.provinces.push(value);
      }
      console.log("=====Init Master Data Provinces Success!");
    }
    else {
      console.log("=====No provinces data! Reload!");
      this.clientService.getClientProvince().subscribe((res: any) => {
          this.provinces = res.result.listAddressProvince;
          this.pdb.upsertItem("masterdata_provinces", this.provinces);
          this.getMasterDataProvinces();
      });
    }
  }

  async getMasterDataDistricts() {
    this.couchdb_districts = await this.pdb.getItem("masterdata_districts", false);
    if (this.couchdb_districts) {
      delete this.couchdb_districts['_id'];
      delete this.couchdb_districts['_rev'];
      delete this.couchdb_districts['time'];
      for (let key in this.couchdb_districts) {
        let value = this.couchdb_districts[key];
        this.districts.push(value);
      }
      this.clientAddressData.map((item: any) => {
        this.getDistrictName(item);
      });
      console.log("=====Init Master Data Districts Success!");
    }
    else {
      console.log("=====No district data! Reload!");
      this.clientService.getAllDistrict().subscribe((res: any) => {
          this.couchdb_districts = res.result.listAddressDistrict;
          this.pdb.upsertItem("masterdata_districts", this.couchdb_districts);
          this.getMasterDataDistricts();
      });
    }
  }

  async getMasterDataWards() {
    this.couchdb_wards = await this.pdb.getItem("masterdata_wards", false);
    if (this.couchdb_wards) {
      delete this.couchdb_wards['_id'];
      delete this.couchdb_wards['_rev'];
      delete this.couchdb_wards['time'];
      for (let key in this.couchdb_wards) {
        let value = this.couchdb_wards[key];
        this.wards.push(value);
      }
      this.clientAddressData.map((item: any) => {
        this.getTownVillageName(item);
      });
      console.log("=====Init Master Data Wards Success!");
    }
    else {
      console.log("=====No wards data! Reload!");
      this.clientService.getAllTownVillage().subscribe((res: any) => {
          this.couchdb_wards = res.result.listAddressWard;
          this.pdb.upsertItem("masterdata_wards", this.couchdb_wards);
          this.getMasterDataWards();
      });
    }
  }

  getDistrictName(item: any) {

    let couchdb_districts: any[] = [];
    this.districts.filter((v: any) => {
      if (v.provinceId === Number(item.stateProvinceId)) {
        couchdb_districts.push(v);
        if (v.refid === Number(item.countyDistrict)) {
          item.districtName = v.description;
        }
      }
    });
    item.districts = couchdb_districts;
  }

  getTownVillageName(item: any) {

    let couchdb_wards: any[] = [];
    this.wards.filter((v: any) => {
      if (v.districtId === Number(item.countyDistrict)) {
        couchdb_wards.push(v);
        if (v.refid === Number(item.townVillage)) {
          item.townVillageName = v.description;
        }
      }
    });
    item.townVillages = couchdb_wards;
  }

  // getDistrictName(item: any) {
  //   this.clientService.getClientDistrict(item.stateProvinceId).subscribe((res: any) => {
  //     item.districts = res.result.listAddressDistrict;
  //     res.result.listAddressDistrict.filter((v: any) => {
  //       if (v.refid === Number(item.countyDistrict)) {
  //         item.districtName = v.description;
  //       }
  //     });
  //   });
  // }

  // getTownVillageName(item: any) {
  //   this.clientService.getClientTownVillage(item.countyDistrict).subscribe((res: any) => {
  //     item.townVillages = res.result.listAddressWard;
  //     res.result.listAddressWard.filter((v: any) => {
  //       if (v.refid === Number(item.townVillage)) {
  //         item.townVillageName = v.description;
  //       }
  //     });
  //   });
  // }

  /**
   * Adds a client address.
   */
  addAddress() {
    const data = {
      title: 'Add Client Address',
      formfields: this.getAddressFormFields('add'),
      type: 'add',
    };
    const addAddressDialogRef = this.dialog.open(FormDialogComponent, { data });
    addAddressDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        this.clientService
          .createClientAddress(this.clientId, response.data.value.addressType, response.data.value)
          .subscribe((res: any) => {
            this.refresh();
            // const addressData = response.data.value;
            // this.getDistrictName(addressData);
            // this.getTownVillageName(addressData);
            // addressData.addressId = res.resourceId;
            // addressData.addressTypeId = addressData.addressType;
            // addressData.addressType = this.getSelectedValue('addressTypeIdOptions', addressData.addressType).name;
            // addressData.isActive = false;
            // this.clientAddressData.push(addressData);
          });
      }
    });
  }

  /**
   * Edits an existing address.
   * @param {any} address Client address
   * @param {number} index address index
   */
  editAddress(address: any, index: number) {
    const data = {
      title: 'Edit Client Address',
      formfields: this.getAddressFormFields('edit', address),
      layout: { addButtonText: 'Edit' },
    };
    const editAddressDialogRef = this.dialog.open(FormDialogComponent, { data });
    editAddressDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        const addressData = response.data.value;
        addressData.addressId = address.addressId;
        addressData.isActive = address.isActive;
        this.clientService
          .editClientAddress(this.clientId, address.addressTypeId, addressData)
          .subscribe((res: any) => {
            addressData.addressTypeId = address.addressTypeId;
            addressData.addressType = address.addressType;
            this.getDistrictName(addressData);
            this.getTownVillageName(addressData);
            this.clientAddressData[index] = addressData;
          });
      }
    });
  }

  /**
   * Toggles address activity.
   * @param {any} address Client Address
   */
  toggleAddress(address: any) {
    const addressData = {
      addressId: address.addressId,
      isActive: address.isActive ? false : true,
    };
    this.clientService.editClientAddress(this.clientId, address.addressTypeId, addressData).subscribe(() => {
      address.isActive = address.isActive ? false : true;
    });
  }

  /**
   * Checks if field is enabled in address config.
   * @param {any} fieldName Field Name
   */
  isFieldEnabled(fieldName: any) {
    return this.clientAddressFieldConfig.find((fieldObj: any) => fieldObj.field === fieldName)?.isEnabled;
  }

  /**
   * Find Pipe doesn't work with accordian
   * @param {any} fieldName Field Name
   * @param {any} fieldId Field Id
   */
  getSelectedValue(fieldName: any, fieldId: any) {
    return this.clientAddressTemplate[fieldName].find((fieldObj: any) => fieldObj.id === fieldId);
  }

  getSelectedProvince(fieldId: any) {
    return this.provinces.find((fieldObj: any) => fieldObj.refid === fieldId);
  }

  /**
   * Returns address form fields for form dialog.
   * @param {string} formType Form Type
   * @param {any} address Address
   */

  getAddressFormFields(formType?: string, address?: any): any {
    let formfields: FormfieldBase[] = [];
    if (formType === 'add') {
      //   formfields.push(this.isFieldEnabled('addressType') ? new SelectBase({
      //     controlName: 'addressType',
      //     label: 'Address Type',
      //     value: address ? address.addressType : '',
      //     options: { label: 'name', value: 'id', data: this.clientAddressTemplate.addressTypeIdOptions },
      //     order: 1
      //   }) : null);
      // }
      // formfields.push(this.isFieldEnabled('countryId') ? new SelectBase({
      //   controlName: 'countryId',
      //   label: 'Country',
      //   value: address ? address.countryId : '',
      //   options: { label: 'name', value: 'id', data: this.clientAddressTemplate.countryIdOptions },
      //   order: 2
      // }) : null);
      // formfields.push(this.isFieldEnabled('postalCode') ? new InputBase({
      //   controlName: 'postalCode',
      //   label: 'Postal Code',
      //   value: address ? address.postalCode : '',
      //   type: 'text',
      //   order: 3
      // }) : null);
      // formfields.push(this.isFieldEnabled('stateProvinceId') ? new SelectBase({
      //   controlName: 'stateProvinceId',
      //   label: 'State / Province',
      //   value: address ? address.stateProvinceId : '',
      //   options: { label: 'description', value: 'refid', data: this.provinces },
      //   order: 4
      // }) : null);
      // formfields.push(this.isFieldEnabled('countyDistrict') ? new SelectBase({
      //   controlName: 'countyDistrict',
      //   label: 'Country District',
      //   value: address ? Number(address.countyDistrict) : '',
      //   options: { label: 'description', value: 'refid', data: address ? address.districts : []},
      //   order: 5
      // }) : null);
      // formfields.push(this.isFieldEnabled('city') ? new InputBase({
      //   controlName: 'city',
      //   label: 'City',
      //   value: address ? address.city : '',
      //   type: 'text',
      //   order: 6
      // }) : null);
      // formfields.push(this.isFieldEnabled('townVillage') ? new SelectBase({
      //   controlName: 'townVillage',
      //   label: 'Town / Village',
      //   value: address ? Number(address.townVillage) : '',
      //   options: { label: 'description', value: 'refid', data: address ? address.townVillages : []},
      //   order: 7
      // }) : null);
      // formfields.push(this.isFieldEnabled('addressLine3') ? new InputBase({
      //   controlName: 'addressLine3',
      //   label: 'Address Line 3',
      //   value: address ? address.addressLine3 : '',
      //   type: 'text',
      //   order: 8
      // }) : null);
      // formfields.push(this.isFieldEnabled('addressLine2') ? new InputBase({
      //   controlName: 'addressLine2',
      //   label: 'Address Line 2',
      //   value: address ? address.addressLine2 : '',
      //   type: 'text',
      //   order: 9
      // }) : null);
      // formfields.push(this.isFieldEnabled('addressLine1') ? new InputBase({
      //   controlName: 'addressLine1',
      //   label: 'Address Line 1',
      //   value: address ? address.addressLine1 : '',
      //   type: 'text',
      //   order: 10
      // }) : null);
      // formfields.push(this.isFieldEnabled('street') ? new InputBase({
      //   controlName: 'street',
      //   label: 'Street',
      //   value: address ? address.street : '',
      //   type: 'text',
      //   required: false,
      //   order: 11
      // }) : null);

      /* --------*/
      if (this.isFieldEnabled('addressType')) {
        formfields.push(
          new SelectBase({
            controlName: 'addressType',
            label: 'Address Type',
            value: address ? address.addressType : '',
            options: { label: 'name', value: 'id', data: this.clientAddressTemplate.addressTypeIdOptions },
            order: 1,
          })
        );
      }
    }

      if (this.isFieldEnabled('addressLine1')) {
        formfields.push(
          new InputBase({
            controlName: 'addressLine1',
            label: 'Address Line 1',
            value: address ? address.addressLine1 : '',
            type: 'text',
            order: 10,
          })
        );
      }

      if (this.isFieldEnabled('addressLine2')) {
        formfields.push(
          new InputBase({
            controlName: 'addressLine2',
            label: 'Address Line 2',
            value: address ? address.addressLine2 : '',
            type: 'text',
            order: 9,
          })
        );
      }

      if (this.isFieldEnabled('addressLine3')) {
        formfields.push(
          new InputBase({
            controlName: 'addressLine3',
            label: 'Address Line 3',
            value: address ? address.addressLine3 : '',
            type: 'text',
            order: 8,
          })
        );
      }

      if (this.isFieldEnabled('street')) {
        formfields.push(
          new InputBase({
            controlName: 'street',
            label: 'Street',
            value: address ? address.street : '',
            type: 'text',
            required: false,
            order: 11,
          })
        );
      }

      if (this.isFieldEnabled('countryId')) {
        formfields.push(
          new SelectBase({
            controlName: 'countryId',
            label: 'Country',
            value: address ? address.countryId : '',
            options: { label: 'name', value: 'id', data: this.clientAddressTemplate.countryIdOptions },
            order: 2,
          })
        );
      }
      if (this.isFieldEnabled('postalCode')) {
        formfields.push(
          new InputBase({
            controlName: 'postalCode',
            label: 'Postal Code',
            value: address ? address.postalCode : '',
            type: 'text',
            order: 3,
          })
        );
      }

      if (this.isFieldEnabled('stateProvinceId')) {
        formfields.push(
          new SelectBase({
            controlName: 'stateProvinceId',
            label: 'State / Province',
            value: address ? address.stateProvinceId : '',
            options: { label: 'description', value: 'refid', data: this.provinces },
            order: 4,
          })
        );
      }
      if (this.isFieldEnabled('city')) {
        formfields.push(
          new InputBase({
            controlName: 'city',
            label: 'City',
            value: address ? address.city : '',
            type: 'text',
            order: 6,
          })
        );
      }
      if (this.isFieldEnabled('countyDistrict')) {
        formfields.push(
          new SelectBase({
            controlName: 'countyDistrict',
            label: 'Country District',
            value: address ? Number(address.countyDistrict) : '',
            options: { label: 'description', value: 'refid', data: address ? address.districts : [] },
            order: 5,
          })
        );
      }
      if (this.isFieldEnabled('townVillage')) {
        formfields.push(
          new SelectBase({
            controlName: 'townVillage',
            label: 'Town / Village',
            value: address ? Number(address.townVillage) : '',
            options: { label: 'description', value: 'refid', data: address ? address.townVillages : [] },
            order: 7,
          })
        );
      }

      formfields = formfields.filter((field) => field !== null);
      return formfields;

  }

  refresh() {
    window.location.reload();
  }
}
