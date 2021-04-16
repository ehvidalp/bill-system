import { Component, OnInit } from '@angular/core';
import { SAT } from '@models/sat';
import { PageSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { SyncfusionLanguageService } from '@services/syncfusion-language.service';
import { GridLanguage, PagerLanguage } from '@models/syncfusion-language';
import { SnackbarService } from '@services/snackbar.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { IvaService } from '@services/iva.service';
import { IsrService } from '@services/isr.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sat-list',
  templateUrl: './sat-list.component.html',
  styleUrls: ['./sat-list.component.scss']
})
export class SatListComponent implements OnInit {

  pageSettings!: PageSettingsModel;
  toolbarOptions!: ToolbarItems[];
  dataSat: SAT[] = [];
  locale: any;
  isIva!: boolean;

  constructor(
    private ivaService: IvaService,
    private isrService: IsrService,
    private syncfusionLanguageService: SyncfusionLanguageService,
    private snackService: SnackbarService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const gridLanguage: GridLanguage = this.syncfusionLanguageService.gridLanguage
    const pagerLanguage: PagerLanguage = this.syncfusionLanguageService.pagerLanguage

    this.isIva! = (this.router.url === '/sat/iva')? true : false

    this.pageSettings = { pageSize: 15 };
    this.toolbarOptions = ['Search'];
    this.locale = setCulture('es-ES');

    L10n.load({
      'es-ES': {
        grid: gridLanguage,
        pager: pagerLanguage,
      },
    });

    if(this.isIva) this.getIva()
    else this.getIsr()
  }

  getIva(){
    this.ivaService.getAll().subscribe(data => {
      this.dataSat = data
    })
  }

  getIsr(){
    this.isrService.getAll().subscribe(data => {
      this.dataSat = data
    })
  }

  deleteFormSat(idForm: string | undefined) {
    Swal.fire({
      title: '¿Desea eliminar la categoría?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
      confirmButtonColor: 'green',
      cancelButtonColor: 'red',
      icon: 'question',
    }).then((result) => {
      if (result.isConfirmed) {
        if(this.isIva){
          this.ivaService.delete(idForm!).then(()=> {
            this.snackService.setSuccess({success: true, message: 'Formulario eliminado'})
            this.getIva()
          })
        }
        else {
          this.isrService.delete(idForm!).then(()=> {
            this.snackService.setSuccess({success: true, message: 'Formulario eliminado'})
            this.getIsr()
          })
        }

      }
    });
  }

}
