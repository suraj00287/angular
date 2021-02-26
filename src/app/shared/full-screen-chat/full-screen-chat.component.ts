import { Component, OnInit, HostListener } from '@angular/core';
import { AppService1 } from '../../app.service';
import { LocalStoreManager } from '../../core/common/local-store-manager.service';
import { Router } from '@angular/router';
import { DBkeys } from '../../core/common/db-keys';


@Component({
  selector: 'app-full-screen-chat',
  templateUrl: './full-screen-chat.component.html',
  styleUrls: ['./full-screen-chat.component.scss']
})
export class FullScreenChatComponent implements OnInit {

refreshKeyPressed = false;


  @HostListener('window:keydown', ['$event'])
  keyEvent(evt: any) {
    if (evt.which == this.f5key || evt.which == this.rkey) {
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent1(evt: any) {
    if (evt.which == this.f5key || evt.which == this.rkey) {
  }

  constructor(private appService: AppService1, private localStorage: LocalStoreManager,
    private router: Router) {
  }

  ngOnInit() {
    let headers = this.localStorage.getDataObject<any>(DBkeys.HEADER_VALUE);
    this.appService.updateAccountSetting1(headers);
    this.appService.updateStartChatInNewTab(true);
  }

}