import { Component, OnInit } from '@angular/core';
import { PageSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { Provider } from '@models/provider';
import { ProvidersService } from '@services/providers.service';
import { SyncfusionLanguageService } from '@services/syncfusion-language.service';
import { GridLanguage, PagerLanguage } from '@models/syncfusion-language';
import { SnackbarService } from '@services/snackbar.service';

@Component({
  selector: 'app-providers-list',
  templateUrl: './providers-list.component.html',
  styleUrls: ['./providers-list.component.scss']
})
export class ProvidersListComponent implements OnInit {
  pageSettings!: PageSettingsModel;
  toolbarOptions!: ToolbarItems[];
  dataProviders: Provider[] = [];
  locale: any

  constructor(
    private providersService: ProvidersService,
    private syncfusionLanguageService: SyncfusionLanguageService,
    private snackService: SnackbarService
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

    this.getProviders()
  }

  getProviders(){
    this.providersService.getAll().subscribe(data => {
      this.dataProviders = data
    })
  }

}
