import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'midas-add-identities',
  templateUrl: './add-identities.component.html',
  styleUrls: ['./add-identities.component.scss']
})
export class AddIdentitiesComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      'documentTypeId': [''],
      'documentCardBank': [''],
      'status': [''],
      'documentKey': ['']
    });
  }

}
