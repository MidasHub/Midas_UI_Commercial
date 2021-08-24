/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
/** rxjs Imports */
import { Observable, BehaviorSubject, of } from 'rxjs';
import { CommonHttpParams } from 'app/shared/CommonHttpParams';

/**
 * Groups service.
 */
@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  private credentialsStorageKey = 'midasCredentials';
  private accessToken: any;
  private GatewayApiUrlPrefix: any;
  public pending_limit: any;
  constructor(private http: HttpClient, private commonHttpParams: CommonHttpParams) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey) || ''
    );
    this.GatewayApiUrlPrefix = environment.GatewayApiUrlPrefix;
  }

  updateDefaultSavingAccount(savingAccountInfo: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('groupId', savingAccountInfo.groupId);
    httpParams = httpParams.set('savingAccountId', savingAccountInfo.savingAccountId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/groups/edit_group_default_saving_account`, httpParams);
  }

  /**
   * @param {any} filterBy Properties by which entries should be filtered.
   * @param {string} orderBy Property by which entries should be sorted.
   * @param {string} sortOrder Sort order: ascending or descending.
   * @param {number} offset Page offset.
   * @param {number} limit Number of entries within the page.
   * @returns {Observable<any>} Groups.
   */
  getGroups(filterBy: any, orderBy: string, sortOrder: string, offset: number = 0, limit: number = 10): Observable<any> {
    let httpParams = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString())
      .set('sortOrder', sortOrder)
      .set('orderBy', orderBy)
      .set('paged', 'true');
    // filterBy: name
    filterBy.forEach(function (filter: any) {
      if (filter.value) {
        httpParams = httpParams.set(filter.type, filter.value);
      }
    });
    return this.http.get('/groups', { params: httpParams });
  }

  getCartTypes(): Observable<any> {
    const httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/groups/get_fee_group_template`, httpParams);
  }

  getCartTypesByGroupId(groupId: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set('groupId', groupId);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/groups/get_fee_by_GroupId`, httpParams);
  }

  /**
   * @param {string} orderBy Property by which entries should be sorted.
   * @param {string} sortOrder Sort order: ascending or descending.
   * @param {string} name Filter value for groups names.
   * @param {any} officeId? Office Id.
   * @param {any} orphansOnly? Orphans Only.
   * @returns {Observable<any>} Groups.
   */
  getFilteredGroups(
    orderBy: string,
    sortOrder: string,
    name: string,
    officeId?: any,
    orphansOnly?: any
  ): Observable<any> {
    let httpParams = new HttpParams().set('name', name).set('sortOrder', sortOrder).set('orderBy', orderBy);
    if (officeId) {
      httpParams = httpParams.set('officeId', officeId);
    }
    httpParams = orphansOnly ? httpParams.set('orphansOnly', orphansOnly) : httpParams;
    return this.http.get('/groups', { params: httpParams });
  }

  /**
   * @param {number} officeId Office Id of office to get groups for.
   * @returns {Observable<any>}
   */
  getGroupsByOfficeId(officeId: number): Observable<any> {
    const httpParams = new HttpParams().set('officeId', officeId.toString());
    return this.http.get('/groups', { params: httpParams });
  }

  /**
   * @param {string} groupId Group Id of group to get data for.
   * @param {string} template? Is template data required.
   * @returns {Observable<any>} Group data.
   */
  getGroupData(groupId?: string | null, template?: string): Observable<any> {
    let httpParams = new HttpParams().set('associations', 'all');
    httpParams = template ? httpParams.set('template', template) : httpParams;
    if (groupId) {
    return this.http.get(`/groups/${groupId}`, { params: httpParams });
    } else {
      return of();
    }
  }

  /**
   * @param groupId Group Id of group to get data for.
   * @returns {Observable<any>} Group Summary data.
   */
  getGroupSummary(groupId?: string|null): Observable<any> {
    if (groupId) {
    const httpParams = new HttpParams().set('R_groupId', groupId).set('genericResultSet', 'false');
    return this.http.get(`/runreports/GroupSummaryCounts`, { params: httpParams });
    } else {
      return of();
    }
  }

  /**
   * @param groupId Group Id of group to get data for.
   * @returns {Observable<any>} Group Accounts data.
   */
  getGroupAccountsData(groupId?: string | null): Observable<any> {
    if (groupId) {
      return this.http.get(`/groups/${groupId}/accounts`);
    } else {
      return of();
    }
  }

  /**
   * @param groupId Group Id of group to get data for.
   * @returns {Observable<any>} Group Notes data.
   */
  getGroupNotes(groupId?: string|null): Observable<any> {
    return this.http.get(`/groups/${groupId}/notes`);
  }

  /**
   * @param groupId Group Id of group to create note for.
   * @param noteData Note Data.
   * @returns {Observable<any>}
   */
  createGroupNote(groupId: string, noteData: any): Observable<any> {
    return this.http.post(`/groups/${groupId}/notes`, noteData);
  }

  /**
   * @param groupId Group Id of group to edit note for.
   * @param noteId Note Id
   * @param noteData Note Data
   * @returns {Observable<any>}
   */
  editGroupNote(groupId: string, noteId: string, noteData: any): Observable<any> {
    return this.http.put(`/groups/${groupId}/notes/${noteId}`, noteData);
  }

  /**
   * @param groupId Group Id of group to delete note for.
   * @param noteId Note Id
   * @returns {Observable<any>}
   */
  deleteGroupNote(groupId: string, noteId: string): Observable<any> {
    return this.http.delete(`/groups/${groupId}/notes/${noteId}`);
  }

  /**
   * @returns {Observable<any>}
   */
  getGroupDatatables(): Observable<any> {
    const httpParams = new HttpParams().set('apptable', 'm_group');
    return this.http.get(`/datatables`, { params: httpParams });
  }

  /**
   * @param groupId Group Id of group to get datatable for.
   * @param datatableName Data table name.
   * @returns {Observable<any>}
   */
  getGroupDatatable(groupId?: string|null, datatableName?: string| null): Observable<any> {
    const httpParams = new HttpParams().set('genericResultSet', 'true');
    if ((groupId) && (datatableName)) {
    return this.http.get(`/datatables/${datatableName}/${groupId}`, { params: httpParams });
    } else {
      return of();
    }
  }

  /**
   * @param groupId Group Id of group to get add datatable entry for.
   * @param datatableName Data Table name.
   * @param data Data.
   * @returns {Observable<any>}
   */
  addGroupDatatableEntry(groupId?: string|null, datatableName?: string|null, data?: any): Observable<any> {
    const httpParams = new HttpParams().set('genericResultSet', 'true');
    return this.http.post(`/datatables/${datatableName}/${groupId}`, data, { params: httpParams });
  }

  /**
   * @param groupId Group Id of group to get add datatable entry for.
   * @param datatableName Data Table name.
   * @param data Data.
   * @returns {Observable<any>}
   */
  editGroupDatatableEntry(groupId?: string|null, datatableName?: string|null, data?: any): Observable<any> {
    const httpParams = new HttpParams().set('genericResultSet', 'true');
    return this.http.put(`/datatables/${datatableName}/${groupId}`, data, { params: httpParams });
  }

  /**
   * @param groupId Group Id of group to get add datatable entry for.
   * @param datatableName Data Table name.
   * @returns {Observable<any>}
   */
  deleteDatatableContent(groupId?: string|null, datatableName?: string|null): Observable<any> {
    const httpParams = new HttpParams().set('genericResultSet', 'true');
    return this.http.delete(`/datatables/${datatableName}/${groupId}`, { params: httpParams });
  }

  /**
   * @param {any} command Command
   * @returns {Observable<any>} Group Command Template
   */
  getGroupCommandTemplate(command: string): Observable<any> {
    const httpParams = new HttpParams().set('command', command);
    return this.http.get(`/groups/template`, { params: httpParams });
  }

  /**
   * @param {string} groupId Group Id
   * @param {string} command Command
   * @param {any} data Command payload
   * @returns {Observable<any>}
   */
  executeGroupCommand(groupId: string, command: string, data: any): Observable<any> {
    const httpParams = new HttpParams().set('command', command);
    return this.http.post(`/groups/${groupId}`, data, { params: httpParams });
  }

  /**
   * @param {string} groupId Group Id
   * @param {any} roleId Role Id
   * @returns {Observable<any>}
   */
  unAssignRoleCommand(groupId: string, roleId: any): Observable<any> {
    const httpParams = new HttpParams().set('command', 'unassignRole').set('roleId', roleId);
    return this.http.post(`/groups/${groupId}`, {}, { params: httpParams });
  }

  /**
   * @param {any} group Group to be created.
   * @returns {Observable<any>}
   */
  createGroup(group: any): Observable<any> {
    return this.http.post('/groups', group);
  }
  createFeeGroup(groupId: any, listFeeGroup: any): Observable<any> {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey) || ''
    );
    const httpParams = {
      createdBy: this.accessToken.userId,
      accessToken: this.accessToken.base64EncodedAuthenticationKey,
      groupId: groupId,
      listFeeGroup: JSON.stringify(listFeeGroup),
    };
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/groups/add_fee_by_Group`, httpParams);
  }

  updateFeeGroup(groupId: any, listFeeGroup: any): Observable<any> {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey) || ''
    );
    const httpParams = {
      createdBy: this.accessToken.userId,
      accessToken: this.accessToken.base64EncodedAuthenticationKey,
      groupId: groupId,
      listFeeGroup: JSON.stringify(listFeeGroup),
    };
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/groups/update_fee_by_Group`, httpParams);
  }
  /**
   * @param {any} group Group to be updated.
   * @param {any} groupId Group Id
   * @returns {Observable<any>}
   */
  updateGroup(group: any, groupId: any): Observable<any> {
    return this.http.put(`/groups/${groupId}`, group);
  }

  /**
   * @param {string} groupId group Id
   * @returns {Observable<any>}
   */
  deleteGroup(groupId: string): Observable<any> {
    return this.http.delete(`/groups/${groupId}`);
  }

  /**
   * @param {any} groupId Group Id
   * @returns {Observable<any>}
   */
  getGroupCalendarTemplate(groupId: any): Observable<any> {
    return this.http.get(`/groups/${groupId}/calendars/template`);
  }

  /**
   * @param {any} groupId Group Id
   * @param {any} calendarId Calendar Id
   * @returns {Observable<any>}
   */
  getGroupCalendarAndTemplate(groupId: any, calendarId: any): Observable<any> {
    const httpParams = new HttpParams().set('template', 'true');
    return this.http.get(`/groups/${groupId}/calendars/${calendarId}`, { params: httpParams });
  }

  /**
   * @param {any} groupId Group Id
   * @param {any} data Group meeting data
   * @returns {Observable<any>}
   */
  createGroupMeeting(groupId: any, data: any): Observable<any> {
    return this.http.post(`/groups/${groupId}/calendars`, data);
  }

  /**
   * @param {any} groupId Group Id
   * @param {any} data Meeting Data
   * @param {any} calendarId Calendar Id
   * @returns {Observable<any>}
   */
  updateGroupMeeting(groupId: any, data: any, calendarId: any): Observable<any> {
    return this.http.put(`/groups/${groupId}/calendars/${calendarId}`, data);
  }

  /**
   * @param {any} groupId Group Id
   * @param {any} calendarId Calendar Id
   * @returns {Observable<any>}
   */
  getMeetingsTemplate(groupId: any, calendarId: any): Observable<any> {
    const httpParams = new HttpParams().set('calenderId', calendarId);
    return this.http.get(`/groups/${groupId}/meetings/template`, { params: httpParams });
  }

  /**
   * @param {any} groupId Group Id
   * @param {any} calendarId Calendar Id
   * @param {any} data Attendance Data
   * @returns {Observable<any>}
   */
  assignGroupAttendance(groupId: any, calendarId: any, data: any): Observable<any> {
    const httpParams = new HttpParams().set('calenderId', calendarId);
    return this.http.post(`/groups/${groupId}/meetings`, data, { params: httpParams });
  }

  /**
   * @param {number} id Office Id of office to get staff for.
   * @returns {Observable<any>} Staff Data for group.
   */
  getStaff(id: number): Observable<any> {
    const httpParams = new HttpParams().set('officeId', id.toString()).set('staffInSelectedOfficeOnly', 'true');
    return this.http.get('/groups/template', { params: httpParams });
  }

  getStaffs(officeId: string): Observable<any> {
    const httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey)
      .set('officeId', officeId);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/common/get_list_staffName_of_office`, httpParams);
  }
  getLastTransaction(groupId: any): Observable<any> {
    const httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/groups/${groupId}/last_transaction`, httpParams);
  }

  getSalesLast3months(groupId: any): Observable<any> {
    const httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/groups/${groupId}/sales_last_3_months`, httpParams);
  }

  storeSpendingLimit(data: any): Observable<any> {
    let httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    const keys = Object.keys(data);
    for (const key of keys) {
      httpParams = httpParams.set(key, data[key]);
    }
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/config/store_limit_config_info`, httpParams);
  }
  getConfigSpendingLimit(year: number, month: number): BehaviorSubject<any> {
    if (!this.pending_limit) {
      this.pending_limit = new BehaviorSubject(null);
    }
    const data = this.pending_limit.getValue();
    if (!data || data.year !== year || data.month !== month) {
      const httpParams = new HttpParams()
        .set('createdBy', this.accessToken.userId)
        .set('accessToken', this.accessToken.base64EncodedAuthenticationKey)
        .set('year', String(year))
        .set('month', String(month));
      this.http
        .post<any>(`${this.GatewayApiUrlPrefix}/config/get_limit_config_info`, httpParams)
        .subscribe((response) => {
          this.pending_limit.next({
            year: year,
            month: month,
            data: response?.result,
          });
        });
    }
    return this.pending_limit;
  }
  addLimitRow(row: any) {
    const value = this.pending_limit.getValue();
    if (value.year === row.year && value.month === row.month) {
      const newData = {
        ...value,
        data: {
          ...value.data,
          listSavingLimitConfig: [row, ...value.data.listSavingLimitConfig],
        },
      };
      this.pending_limit.next(newData);
    }
  }
  updateLimitRow(row: any) {
    const value = this.pending_limit.getValue();
    if (value.year === row.year && value.month === row.month) {
      const newData = {
        ...value,
        data: {
          ...value.data,
          listSavingLimitConfig: value.data.listSavingLimitConfig.map((item: any) => {
            if (item.refid === row.refid) {
              return row;
            }
            return item;
          }),
        },
      };
      this.pending_limit.next(newData);
    }
  }
}
