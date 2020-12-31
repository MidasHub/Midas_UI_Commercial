export class FormfieldBase {

  controlType: string;
  controlName: string;
  label: string;
  value: string;
  required: boolean;
  order: number;
  maxLength: number;
  minLength: number;
  disabled: boolean;

  constructor(options: {
    controlType?: string,
    controlName?: string,
    label?: string,
    value?: string,
    required?: boolean,
    order?: number,
    maxLength?: number,
    minLength?: number,
    disabled?: boolean
  } = {}) {
    this.controlType = options.controlType || '';
    this.controlName = options.controlName || '';
    this.label = options.label || '';
    this.value = options.value === undefined ? '' : options.value;
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.maxLength = options.maxLength || 0;
    this.minLength = options.minLength || 0;
    this.disabled = options.disabled || false;
  }

}
