export class TerminalObj {
    terminalId: string;
    terminalCode: string;
    terminalName:string;
    status: string;
    createdBy:string;
    createdDate:string;
    updatedDate:string;
    minFeeDefault:number;
    owner:boolean;
    ownerName:string;

    constructor(
        terminalId: string,
        terminalCode: string,
        terminalName:string,
        status: string,
        createdBy:string,
        createdDate:string,
        updatedDate:string,
        minFeeDefault:number,
        owner:boolean,
        ownerName:string) {
            this.terminalId=terminalId;
            this.terminalCode=terminalCode;
            this.terminalName=terminalName;
            this.status=status;
            this.createdBy=createdBy;
            this.createdDate=createdDate;
            this.updatedDate=updatedDate;
            this.minFeeDefault= minFeeDefault;
            this.owner= owner;
            this.ownerName= ownerName;
    }
  }
