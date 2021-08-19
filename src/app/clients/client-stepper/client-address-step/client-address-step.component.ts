/** Angular Imports */
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

/** Custom Models */
import { FormfieldBase } from 'app/shared/form-dialog/formfield/model/formfield-base';
import { InputBase } from 'app/shared/form-dialog/formfield/model/input-base';
import { SelectBase } from 'app/shared/form-dialog/formfield/model/select-base';

/** Custom Dialogs */
import { FormDialogComponent } from 'app/shared/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';
import { I18nService } from 'app/core/i18n/i18n.service';

/**
 * Client Address Step Component
 */
@Component({
  selector: 'mifosx-client-address-step',
  templateUrl: './client-address-step.component.html',
  styleUrls: ['./client-address-step.component.scss'],
})
export class ClientAddressStepComponent {
  /** Client Address Field Config */
  @Input() clientAddressFieldConfig: any;
  /** Client Template */
  @Input() clientTemplate: any;

  /** Client Address Data */
  clientAddressData: any[] = [
    {
      addressLine1: '',
      // addressLine2: '',     // Tạm ẩn do không dùng
      // addressLine3: '',     // Tạm ẩn do không dùng
      street: ' ', // lưu thông tin đường
      townVillage: '', // Lưu thông tin phường xã
      countyDistrict: '', // Lưu Thông tin quận huyện
      city: '', // lưu thông tin TP thuộc tỉnh như TP Thủ Đức
      stateProvinceId: 122, // Lưu thông tin tỉnh thành như TPHCM, Bình Dương
      countryId: 27, // Lưu thông tin quốc gia
      addressTypeId: 15, // Lưu loại địa chỉ: 15 là địa chỉ trường trú
      // latitude:'',          // Dùng để lưu GEO data - vĩ độ - tạm ẩn
      // longitude:'',         // Dùng để lưu GEO data - kinh độ - tạm ẩn
      isActive: true,
    },
  ];

  /**
   * @param {MatDialog} dialog Mat Dialog
   */
  constructor(private dialog: MatDialog, private i18n: I18nService) {}

  /**
   * Adds a client address
   */
  addAddress() {
    const data = {
      title: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.buttonAdd'),
      formfields: this.getAddressFormFields(),
    };
    const addAddressDialogRef = this.dialog.open(FormDialogComponent, { data });
    addAddressDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        const addressData = response.data.value;

        addressData.isActive = false;
        for (const key in addressData) {
          if (addressData[key] === '' || addressData[key] === undefined) {
            delete addressData[key];
          }
        }
        this.clientAddressData.push(addressData);
      }
    });
  }

  /**
   * Edit Address
   * @param {any} address Address
   * @param {number} index Address index
   */
  editAddress(address: any, index: number) {
    const data = {
      title: 'Edit Client Address',
      formfields: this.getAddressFormFields(address),
      layout: { addButtonText: 'Edit' },
    };
    const editAddressDialogRef = this.dialog.open(FormDialogComponent, { data });
    editAddressDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        const addressData = response.data.value;
        addressData.isActive = address.isActive;
        for (const key in addressData) {
          if (addressData[key] === '' || addressData[key] === undefined) {
            delete addressData[key];
          }
        }
        this.clientAddressData[index] = addressData;
      }
    });
  }

  /**
   * @param {any} address Client Address
   * @param {number} index Address index
   */
  deleteAddress(address: any, index: number) {
    const deleteAddressDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `address type : ${address.addressType} ${index}` },
    });
    deleteAddressDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.clientAddressData.splice(index, 1);
      }
    });
  }

  /**
   * Toggles address activity
   * @param {any} address Address
   */
  toggleAddress(address: any) {
    address.isActive = address.isActive ? false : true;
  }

  /**
   * Checks if field is enabled in address configuration
   * @param {any} address Address
   */
  isFieldEnabled(fieldName: any) {
    return this.clientAddressFieldConfig.find((fieldObj: any) => fieldObj.field === fieldName)?.isEnabled;
  }

  /**
   * Retrieves field Id from name.
   * Find pipe doesn't work with accordian.
   * @param {any} address Address
   */
  getSelectedValue(fieldName: any, fieldId: any) {
    return this.clientTemplate.address[0][fieldName].find((fieldObj: any) => fieldObj.id === fieldId);
  }

  /**
   * Gets formfields for form dialog.
   * @param {any} address Address
   */
  getAddressFormFields(address?: any) {
    let formfields: FormfieldBase[] = [];
    // formfields.push(
    //   this.isFieldEnabled('addressType')
    //     ? new SelectBase({
    //         controlName: 'addressTypeId',
    //         label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelAddressType'),
    //         value: address ? address.addressTypeId : '',
    //         options: { label: 'name', value: 'id', data: this.clientTemplate.address[0].addressTypeIdOptions },
    //         order: 1,
    //         required: true,
    //       })
    //     : null
    // );

    // formfields.push(
    //   this.isFieldEnabled('addressLine1')
    //     ? new InputBase({
    //         controlName: 'addressLine1',
    //         label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelAddressLine1'),
    //         value: address ? address.addressLine1 : '',
    //         type: 'text',
    //         order: 2,
    //       })
    //     : null
    // );
    // formfields.push(
    //   this.isFieldEnabled('addressLine2')
    //     ? new InputBase({
    //         controlName: 'addressLine2',
    //         label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelAddressLine2'),
    //         value: address ? address.addressLine2 : '',
    //         type: 'text',
    //         order: 3,
    //       })
    //     : null
    // );
    // formfields.push(
    //   this.isFieldEnabled('addressLine3')
    //     ? new InputBase({
    //         controlName: 'addressLine3',
    //         label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelAddressLine3'),
    //         value: address ? address.addressLine3 : '',
    //         type: 'text',
    //         order: 4,
    //       })
    //     : null
    // );

    // formfields.push(
    //   this.isFieldEnabled('street')
    //     ? new InputBase({
    //         controlName: 'street',
    //         label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelStreet'),
    //         value: address ? address.street : '...',
    //         type: 'text',
    //         required: true,
    //         order: 5,
    //       })
    //     : null
    // );

    // formfields.push(
    //   this.isFieldEnabled('townVillage')
    //     ? new InputBase({
    //         controlName: 'townVillage',
    //         label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelTownVillage'),
    //         value: address ? address.townVillage : '',
    //         type: 'text',
    //         order: 6,
    //       })
    //     : null
    // );
    // formfields.push(
    //   this.isFieldEnabled('countyDistrict')
    //     ? new InputBase({
    //         controlName: 'countyDistrict',
    //         label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelDistrict'),
    //         value: address ? address.countyDistrict : '',
    //         type: 'text',
    //         order: 7,
    //       })
    //     : null
    // );
    // formfields.push(
    //   this.isFieldEnabled('city')
    //     ? new InputBase({
    //         controlName: 'city',
    //         label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelCity'),
    //         value: address ? address.city : '',
    //         type: 'text',
    //         order: 8,
    //       })
    //     : null
    // );
    // formfields.push(
    //   this.isFieldEnabled('stateProvinceId')
    //     ? new SelectBase({
    //         controlName: 'stateProvinceId',
    //         label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelStateProvince'),
    //         value: address ? address.stateProvinceId : '',
    //         options: { label: 'name', value: 'id', data: this.clientTemplate.address[0].stateProvinceIdOptions },
    //         order: 9,
    //       })
    //     : null
    // );

    // formfields.push(
    //   this.isFieldEnabled('countryId')
    //     ? new SelectBase({
    //         controlName: 'countryId',
    //         label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelCountry'),
    //         value: address ? address.countryId : '',
    //         options: { label: 'name', value: 'id', data: this.clientTemplate.address[0].countryIdOptions },
    //         order: 10,
    //       })
    //     : null
    // );
    // formfields.push(
    //   this.isFieldEnabled('postalCode')
    //     ? new InputBase({
    //         controlName: 'postalCode',
    //         label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelPostalCode'),
    //         value: address ? address.postalCode : '',
    //         type: 'text',
    //         order: 11,
    //       })
    //     : null
    // );

    if (this.isFieldEnabled('addressType')) {
      formfields.push(
        new SelectBase({
          controlName: 'addressTypeId',
          label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelAddressType'),
          value: address ? address.addressTypeId : '',
          options: { label: 'name', value: 'id', data: this.clientTemplate.address[0].addressTypeIdOptions },
          order: 1,
          required: true,
        })
      );
    }

    if (this.isFieldEnabled('addressLine1')) {
      formfields.push(
        new InputBase({
          controlName: 'addressLine1',
          label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelAddressLine1'),
          value: address ? address.addressLine1 : '',
          type: 'text',
          order: 2,
        })
      );
    }
    if (this.isFieldEnabled('addressLine2')) {
      formfields.push(
        new InputBase({
          controlName: 'addressLine2',
          label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelAddressLine2'),
          value: address ? address.addressLine2 : '',
          type: 'text',
          order: 3,
        })
      );
    }
    if (this.isFieldEnabled('addressLine3')) {
      formfields.push(
        new InputBase({
          controlName: 'addressLine3',
          label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelAddressLine3'),
          value: address ? address.addressLine3 : '',
          type: 'text',
          order: 4,
        })
      );
    }

    if (this.isFieldEnabled('street')) {
      formfields.push(
        new InputBase({
          controlName: 'street',
          label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelStreet'),
          value: address ? address.street : '...',
          type: 'text',
          required: true,
          order: 5,
        })
      );
    }

    if (this.isFieldEnabled('townVillage')) {
      formfields.push(
        new InputBase({
          controlName: 'townVillage',
          label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelTownVillage'),
          value: address ? address.townVillage : '',
          type: 'text',
          order: 6,
        })
      );
    }

    if (this.isFieldEnabled('countyDistrict')) {
      formfields.push(
        new InputBase({
          controlName: 'countyDistrict',
          label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelDistrict'),
          value: address ? address.countyDistrict : '',
          type: 'text',
          order: 7,
        })
      );
    }

    if (this.isFieldEnabled('city')) {
      formfields.push(
        new InputBase({
          controlName: 'city',
          label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelCity'),
          value: address ? address.city : '',
          type: 'text',
          order: 8,
        })
      );
    }

    if (this.isFieldEnabled('stateProvinceId')) {
      formfields.push(
        new SelectBase({
          controlName: 'stateProvinceId',
          label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelStateProvince'),
          value: address ? address.stateProvinceId : '',
          options: { label: 'name', value: 'id', data: this.clientTemplate.address[0].stateProvinceIdOptions },
          order: 9,
        })
      );
    }

    if (this.isFieldEnabled('countryId')) {
      formfields.push(
        new SelectBase({
          controlName: 'countryId',
          label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelCountry'),
          value: address ? address.countryId : '',
          options: { label: 'name', value: 'id', data: this.clientTemplate.address[0].countryIdOptions },
          order: 10,
        })
      );
    }

    if (this.isFieldEnabled('postalCode')) {
      formfields.push(
        new InputBase({
          controlName: 'postalCode',
          label: this.i18n.getTranslate('Client_Component.ClientStepper.AddressStep.labelPostalCode'),
          value: address ? address.postalCode : '',
          type: 'text',
          order: 11,
        })
      );
    }

    formfields = formfields.filter((field) => field !== null);
    return formfields;
  }

  /**
   * Returns the array of client addresses
   */
  get address() {
    return { address: this.clientAddressData };
  }
}
