import { Component, OnInit, EventEmitter} from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import 'rxjs/add/operator/switchMap';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { VIEW } from '../../../core/models/enums';
import { MessageSeverity, AlertService } from '../../../core/common/alert.service';
import { Utilities } from '../../../core/common/utilities';
import { User } from '../../../ng-chat/core/user';
import { DBkeys } from '../../../core/common/db-keys';
import { Items } from '../../../core/models/view-models/items.model';
import { SharedService } from '../../../core/services/shared.service';
import { ItemsService } from '../../../core/services/items.service';
import { ItemMasterService } from '../../../core/services/item-master.service';
import { CommonService } from '../../../core/services/shared/common.service';
import { LocalStoreManager } from '../../../core/common/local-store-manager.service';
import { AuthService } from '../../../core/auth/auth.service';
import { MonsterTemplateService } from '../../../core/services/monster-template.service';
import { CombatService } from '../../../core/services/combat.service';
//import { AddMonster } from '../../../core/models/view-models/addMonster.model';


@Component({
    selector: 'app-remove-combat-monster',
    templateUrl: './remove-monster-combat.component.html',
    styleUrls: ['./remove-monster-combat.component.scss']
})
export class RemoveCombatMonsterComponent  implements OnInit {

  public event: EventEmitter<any> = new EventEmitter();
    isLoading = false;
    title: string;
    _view: string;
    characterId: number;
    rulesetId: number;
    characterItems: any;
    searchText: string;
    itemsList: any[] = [];
  selectedItemsList: any[] = [];
  isChecked: boolean = false;
 // combatMonster   =  new AddMonster();

    constructor(
        private router: Router, private bsModalRef: BsModalRef, private alertService: AlertService, private authService: AuthService,
        public modalService: BsModalService, private localStorage: LocalStoreManager, private route: ActivatedRoute,
        private sharedService: SharedService, private commonService: CommonService,
      private combatService: CombatService, private monsterTemplateService: MonsterTemplateService
    ) {
        this.route.params.subscribe(params => { this.characterId = params['id']; });
    }

    ngOnInit() {
        setTimeout(() => {

            this.title = this.bsModalRef.content.title;
            this._view = this.bsModalRef.content.button;
            this.rulesetId = this.bsModalRef.content.rulesetID;
            if (this.rulesetId == undefined)
                this.rulesetId = this.localStorage.getDataObject<number>(DBkeys.RULESET_ID);

           this.initialize();
        }, 0);
    }

  private initialize() {
   
    //this.itemsList = [
    //  {
    //      recordId: 1,
    //      name: 'Monster1',
    //      image: 'https://rpgsmithsa.blob.core.windows.net/user-248c6bae-fab3-4e1f-b91b-f674de70a65d/e21b5355-9824-4aa0-b3c0-274cf9255e45.jpg',
    //      selected: false,
    //      type: '',
    //      quantity: 0
    //  },
    //  {
    //    recordId: 2,
    //    name: 'Monster2',
    //    image: 'https://rpgsmithsa.blob.core.windows.net/user-248c6bae-fab3-4e1f-b91b-f674de70a65d/e21b5355-9824-4aa0-b3c0-274cf9255e45.jpg',
    //    selected: false,
    //    type: '',
    //    quantity: 0
    //  },
    //  {
    //    recordId:3,
    //    name: 'Monster3',
    //    image: 'https://rpgsmithsa.blob.core.windows.net/user-248c6bae-fab3-4e1f-b91b-f674de70a65d/e21b5355-9824-4aa0-b3c0-274cf9255e45.jpg',
    //    selected: false,
    //    type: '',
    //    quantity: 0
    //  },
    //  {
    //    recordId: 4,
    //    name: 'Monster4',
    //    image: 'https://rpgsmithsa.blob.core.windows.net/user-248c6bae-fab3-4e1f-b91b-f674de70a65d/e21b5355-9824-4aa0-b3c0-274cf9255e45.jpg',
    //    selected: false,
    //    type: '',
    //    quantity: 0
    //  },
    //  {
    //    recordId: 5,
    //    name: 'Monster5',
    //    image: 'https://rpgsmithsa.blob.core.windows.net/user-248c6bae-fab3-4e1f-b91b-f674de70a65d/e21b5355-9824-4aa0-b3c0-274cf9255e45.jpg',
    //    selected: false,
    //    type: '',
    //    quantity: 0
    //  }
    //]

        let user = this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
        if (user == null)
            this.authService.logout();
        else {
            this.isLoading = true;
          this.combatService.getCombat_MonstersList<any>(this.rulesetId)
            .subscribe(data => {
              if (data) {
                this.itemsList = data.map((rec) => {
                  return {
                    recordId: rec.monsterId,
                    name: rec.name,
                    image: rec.imageUrl,
                    selected: false,                    
                  };
                })
              }
                  
                    this.isLoading = false;
                }, error => {
                    this.isLoading = false;
                    let Errors = Utilities.ErrorDetail("", error);
                    if (Errors.sessionExpire) {
                        //this.alertService.showMessage("Session Ended!", "", MessageSeverity.default);
                        this.authService.logout(true);
                    } else {
                      this.alertService.showStickyMessage(Errors.summary, Errors.errorMessage, MessageSeverity.error, error);
                    }
                }, () => { });
        }
    }

  setItemMaster(event: any, itemMaster: any) {
    debugger
    itemMaster.selected = event.target.checked;
      if (event.target.checked) {
        const _containsItems = Object.assign([], this.selectedItemsList);
        _containsItems.push(itemMaster);
        this.selectedItemsList = _containsItems;
        } else {
        let _item = itemMaster;
            const index: number = this.selectedItemsList.indexOf(_item);
            if (index !== -1) {
              this.selectedItemsList.splice(index, 1);
            }else {
              const _arrayItems = Object.assign([], this.selectedItemsList);
              this.selectedItemsList = _arrayItems.filter(function (itm) {
                if (itm.recordId !== _item.recordId) return _item;
              });
            }
      }
    }

  submitForm() {
    
    if (this.selectedItemsList.length) {
      this.isLoading = true;
      let _msg = ' Removing Monster ....';
      this.alertService.startLoadingMessage("", _msg);
      let monstersToRemove = this.selectedItemsList.map((m) => {
        return { monsterId: m.recordId };
      });
      this.combatService.removeMonsters(monstersToRemove, this.isChecked, true, this.rulesetId,0)
        .subscribe(data => {
          this.alertService.stopLoadingMessage();
          this.isLoading = false;
          this.close();
          this.sharedService.updateCombatantListForAddDeleteMonsters(true);
        }, error => {
          this.isLoading = false;
          this.alertService.stopLoadingMessage();
          this.alertService.showMessage(error, "", MessageSeverity.error);
          let Errors = Utilities.ErrorDetail("", error);
          if (Errors.sessionExpire) {
            this.authService.logout(true);
          } else {
            this.alertService.showStickyMessage(Errors.summary, Errors.errorMessage, MessageSeverity.error, error);
          }
        }, () => { });
    } else {
      let message = 'Please select atleast one Monster';
      this.alertService.showMessage(message, "", MessageSeverity.error);
    }
   
  }

  checkValue(event) {
    console.log(event);
    this.isChecked = event.target.checked;
  }

  close() {
        this.bsModalRef.hide();
   }

}
