import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/authentication/authentication.service';

@Component({
  selector: 'midas-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {
  isMenuOpen: Boolean = false;
  constructor(private router: Router,
    private authenticationService: AuthenticationService,) { }

  ngOnInit(): void {
  }
  /**
   * Logs out the authenticated user and redirects to login page.
   */
  logout() {
    this.authenticationService.logout()
      .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  /**
   * Opens Midas JIRA Wiki page.
   */
  help() {
    window.open('https://drive.google.com/drive/folders/1-J4JQyaaxBz2QSfZMzC4bPrPwWlksFWw?usp=sharing', '_blank');
  }

  openMenu(){
    this.isMenuOpen=!this.isMenuOpen
  }

  public doAction(event: any) {
    if (event ==='trigger'){
      this.isMenuOpen = !this.isMenuOpen;

      return;
    }

}

}
