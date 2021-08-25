/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { TemplatesService } from '../templates.service';

/**
 * Edit Template data resolver.
 */
@Injectable()
export class EditTemplateResolver implements Resolve<Object> {

  /**
   * @param {TemplatesService} templatesService Templates service.
   */
  constructor(private templatesService: TemplatesService) {}

  /**
   * Returns the template data.
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const templateId = route.paramMap.get('id') ;
    return this.templatesService.getEditTemplateData(templateId);
  }

}
