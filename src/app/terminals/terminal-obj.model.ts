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
    usingName:string;
    isTransferAble:boolean;

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
        isTransferAble:boolean,
        ownerName:string,
        usingName: string) {
            this.terminalId=terminalId;
            this.terminalCode=terminalCode;
            this.terminalName=terminalName;
            this.status=status;
            this.createdBy=createdBy;
            this.createdDate=createdDate;
            this.updatedDate=updatedDate;
            this.minFeeDefault= minFeeDefault;
            this.owner= owner;
            this.isTransferAble= isTransferAble;
            this.ownerName= ownerName;
            this.usingName= usingName;
    }
  }
