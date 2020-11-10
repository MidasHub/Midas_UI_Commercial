/**
 * Alert model.
 */
export interface Alert {
  type?: string;
  message: string;
  msgClass?: string;
  msgDuration?: number
  hPosition?: any ;
  vPosition?: any;
}
