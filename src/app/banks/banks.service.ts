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
  public cardTypes: any;
  public documentCardBanks: any[];
  public documentCardTypes: any[];

  constructor(private http: HttpClient, private commonHttpParams: CommonHttpParams) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    this.GatewayApiUrlPrefix = environment.GatewayApiUrlPrefix;
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

  getCardTypes(): BehaviorSubject<any> {
    if (!this.cardTypes) {
      this.getData();
    }
    return this.cardTypes;
  }

  getInfoBinCode(binCode: string): BehaviorSubject<any> {
    const result = new BehaviorSubject(null);
    // if (!this.cards) {
    //   this.getData();
    // }
    log.debug("This Card:", this.cards);
    this.cards?.subscribe((values: any) => {
      if (values) {
        log.debug("Value is: ", values);
        let have = false;
        for (const v of values) {
          if (v.binCode == binCode) {
            have = true;
            result.next({ ...v, existBin: true });
            break;
          }
        }
        if (!have) {
          result.next({ existBin: false });
        }
      }
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
    }
  }
  //----end Class---//
}
