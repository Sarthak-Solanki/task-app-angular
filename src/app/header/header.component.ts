import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  @Input() headerTitle: any;
  @Input() headerSubtitle: any;
  balance:number

  getHeaderTitle : any;
  getHeaderSubtitle: any;

    /**
   * A callback method that is invoked immediately after the default change detector has checked the directive's data-bound
   * properties for the first time, and before any of the view or content children have been checked. It is invoked only once
   * when the directive is instantiated.
   */
ngOnInit() {
    // this.dataService.currentBalance.subscribe(balanceComing=>this.balance=balanceComing)
    this.getHeaderTitle = this.headerTitle;

  }

  ngOnChanges(){
    this.getHeaderSubtitle = this.headerSubtitle;
  }

}
