import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";

//** Logger */
import { Logger } from "../core/logger/logger.service";
import { CommonHttpParams } from "app/shared/CommonHttpParams";
const log = new Logger("Bank-Service");
@Injectable({
  providedIn: "root",
})
export class BanksService {
  private credentialsStorageKey = "midasCredentials";
  private accessToken: any;
  private GatewayApiUrlPrefix: any;
  public cards: any;
  public banks: any;
  public offices: any;
  public cardTypes: any;
  public documentCardBanks: any[];
  public documentOffices: any[];
  public documentCardTypes: any[];

  constructor(private http: HttpClient, private commonHttpParams: CommonHttpParams) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    this.GatewayApiUrlPrefix = environment.GatewayApiUrlPrefix;
  }

  getListOfficeCommon() {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/common/get_list_office`, httpParams);
  }

  addBank(bank: any) {
    const banks = this.banks.getValue();
    banks.push({
      ...bank,
      cards: [],
      status: "O",
    });
    this.banks.next(banks);
  }

  addCard(card: any) {
    const cards = this.cards.getValue();
    this.cards.next([...cards, card]);
    const banks = this.banks.getValue();
    banks.map((bank: any) => {
      if (bank.bankCode === card.bankCode) {
        bank.cards.push(card);
      }
    });
    this.banks.next(banks);
  }

  updateCard(card: any) {
    const cards = this.cards.getValue().map((c: any) => {
      if (card.refid === c.refid) {
        return {
          ...c,
          ...card,
        };
      }
      return c;
    });
    this.cards.next(cards);
    const banks = this.banks.getValue();
    banks.map((bank: any) => {
      if (bank.bankCode === card.bankCode) {
        bank.cards = bank.cards.map((c: any) => {
          if (card.refid === c.refid) {
            return {
              ...c,
              ...card,
            };
          }
          return c;
        });
      }
    });
    this.banks.next(banks);
  }

  getOffices(): BehaviorSubject<any> {
    if (!this.offices) {
      this.getOfficesCommon();
    }
    return this.offices;
  }

  getBanks(): BehaviorSubject<any> {
    if (!this.banks) {
      this.getData();
    }
    return this.banks;
  }

  getAllCardOnDueDay(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/card/get_all_card_on_due_day`, httpParams);
  }

  storeBank(bankCode: string, bankName: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("bankCode", bankCode);
    httpParams = httpParams.set("bankName", bankName);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/common/store_bank_info`, httpParams);
  }

  getOfficesCommon() {
    if (!this.offices) {
      this.offices = new BehaviorSubject(null);
    }
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    this.http.post<any>(`${this.GatewayApiUrlPrefix}/common/get_list_office`, httpParams).subscribe((result) => {
      if (result?.result) {
        const { listOffice = [] } = result.result;

        this.offices.next(listOffice);

      }
    });
  }

  getData() {
    if (!this.cards) {
      this.cards = new BehaviorSubject(null);
    }
    if (!this.banks) {
      this.banks = new BehaviorSubject(null);
    }
    if (!this.cardTypes) {
      this.cardTypes = new BehaviorSubject(null);
    }
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    this.http.post<any>(`${this.GatewayApiUrlPrefix}/card/get_all_bincode_info`, httpParams).subscribe((result) => {
      if (result?.result) {
        const { ListBinCodeEntity = [], listBank = [], listCardType = [] } = result.result;
        listBank.map((bank: any) => {
          bank.cards = ListBinCodeEntity.filter((v: any) => v.bankCode === bank.bankCode);
        });
        this.cards.next(ListBinCodeEntity);
        this.banks.next(listBank);
        this.cardTypes.next(listCardType);
      }
    });
  }

  getCards(): BehaviorSubject<any> {
    if (!this.cards) {
      this.getData();
    }
    return this.cards;
  }

  getCardInfo(binCode: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("bincode", binCode);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/card/get_bincode_info`, httpParams);
  }

  storeBinCode(binCode: string, bankCode: string, cardType: string, cardClass: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("bincode", binCode);
    httpParams = httpParams.set("bankCode", bankCode);
    httpParams = httpParams.set("cardType", cardType);
    httpParams = httpParams.set("cardClass", cardClass);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/card/store_bincode_info`, httpParams);
  }

  getCardType(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/common/get_list_card_type`, httpParams);
  }

  gerListBank(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/common/get_list_bank`, httpParams);
  }


  getCardTypes(): BehaviorSubject<any> {
    if (!this.cardTypes) {
      this.getData();
    }
    return this.cardTypes;
  }

  getInfoBinCode(binCode: string): BehaviorSubject<any> {
    const result = new BehaviorSubject(null);
    this.getCardInfo(binCode).subscribe((res: any) => {

      if (res?.result?.bankBinCode) {
        result.next({ ...res.result.bankBinCode, existBin: true });
      } else {
        result.next({ ...res, existBin: false });
      }

      // this.getData();
    });
    return result;
  }

  storeInfoBinCode(body: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("binCode", body.binCode);
    httpParams = httpParams.set("cardType", body.cardType);
    httpParams = httpParams.set("bankCode", body.bankCode);

    return this.http.post(`${this.GatewayApiUrlPrefix}/common/store_info_bin_code`, httpParams);
  }

  storeExtraCardInfo(body: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("userId", body.userId);
    httpParams = httpParams.set("userIdentifyId", body.userIdentifyId);
    httpParams = httpParams.set("dueDay", body.dueDay);
    httpParams = httpParams.set("expireDate", `${body.dueDay}/${body.expireDate}`);
    httpParams = httpParams.set("limit", body.limitCard);
    httpParams = httpParams.set("classCard", body.classCard);
    httpParams = httpParams.set("isValid", body.isValid ? '1':'0');

    return this.http.post(`${this.GatewayApiUrlPrefix}/card/store_extra_card_info`, httpParams);
  }

  bankCardDataInit() {
    if (this.accessToken) {
      this.getBanks().subscribe((result: any) => {
        if (result) {
          this.documentCardBanks = result;
        }
      });
      this.getCardTypes().subscribe((result: any) => {
        if (result) {
          this.documentCardTypes = result;
        }
      });
      this.getOffices().subscribe((result: any) => {
        if (result) {
          this.documentOffices = result;
        }
      });
    }
  }
  //----end Class---//
}
