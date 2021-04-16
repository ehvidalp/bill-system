import { Component, OnInit } from '@angular/core';
import { PageSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { SyncfusionLanguageService } from '@services/syncfusion-language.service';
import { GridLanguage, PagerLanguage } from '@models/syncfusion-language';
import { SnackbarService } from '@services/snackbar.service';
import { Bill } from '@models/bill';
import { BillService } from '@services/bill.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AngularFireStorage } from '@angular/fire/storage';
import { ProvidersService } from '@services/providers.service';
import { Provider } from '@models/provider';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-bills-list',
  templateUrl: './bills-list.component.html',
  styleUrls: ['./bills-list.component.scss']
})
export class BillsListComponent implements OnInit {

  pageSettings!: PageSettingsModel;
  toolbarOptions!: ToolbarItems[];
  dataBills: Bill[] = [];
  providers: Provider[] = [];
  locale: any

  constructor(
    private billService: BillService,
    private providersService: ProvidersService,
    private syncfusionLanguageService: SyncfusionLanguageService,
    private snackService: SnackbarService,
    private storage: AngularFireStorage,
  ) { }

  ngOnInit(): void {
    const gridLanguage: GridLanguage = this.syncfusionLanguageService.gridLanguage
    const pagerLanguage: PagerLanguage = this.syncfusionLanguageService.pagerLanguage

    this.pageSettings = { pageSize: 15 };
    this.toolbarOptions = ['Search'];
    this.locale = setCulture('es-ES');

    L10n.load({
      'es-ES': {
        grid: gridLanguage,
        pager: pagerLanguage,
      },
    });

    this.getBills()
  }

  getBills() {

    this.providersService.getAll().pipe(
      switchMap(providers => {
        this.providers = providers
        return this.billService.getAll()
      }))
      .subscribe(bills => {
        this.dataBills = bills
        for (let index = 0; index < this.dataBills.length; index++) {
          const indexProvider = this.providers.findIndex(provider => provider.id === this.dataBills[index].providerId)
          if (indexProvider !== -1) this.dataBills[index] = {
            ...this.dataBills[index],
            nit: this.providers[indexProvider].nit,
            tradename: this.providers[indexProvider].tradename,
          }
          this.dataBills[index].date = new Date(this.dataBills[index].date)
        }
      })
  }

  deleteUser(userId: string | undefined, file: string | undefined) {
    Swal.fire({
      title: '¿Desea eliminar la factura?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
      confirmButtonColor: 'green',
      cancelButtonColor: 'red',
      icon: 'question',
    }).then((result) => {
      if (result.isConfirmed) {
        this.billService.delete(userId!).then(() => {
          this.storage.storage.refFromURL(file!).delete().then(() => {
            this.snackService.setSuccess({ success: true, message: 'Factura eliminada' })
            this.getBills()
          })
        })
      }
    });
  }
}
