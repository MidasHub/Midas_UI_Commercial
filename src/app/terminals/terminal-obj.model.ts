export class TerminalObj {
    terminalId: string;
    terminalCode: string;
    terminalName:string;
    status: string;
    createdBy:string;
    createdDate:string;
    lastUpdateDate:string;
    minFeeDefault:number;
    uuid:string;

    constructor(
        uuid: string,
        terminalId: string,
        terminalCode: string,
        terminalName:string,
        status: string,
        createdBy:string,
        createdDate:string,
        lastUpdateDate:string,
        minFeeDefault:number) {
            this.uuid = uuid;
            this.terminalId=terminalId;
            this.terminalCode=terminalCode;
            this.terminalName=terminalName;
            this.status=status;
            this.createdBy=createdBy;
            this.createdDate=createdDate;
            this.lastUpdateDate=lastUpdateDate;
            this.minFeeDefault= minFeeDefault;
    }
  }
  