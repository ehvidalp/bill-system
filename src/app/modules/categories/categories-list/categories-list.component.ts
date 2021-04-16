import { Component, OnInit } from '@angular/core';
import { PageSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { SyncfusionLanguageService } from '@services/syncfusion-language.service';
import { GridLanguage, PagerLanguage } from '@models/syncfusion-language';
import { SnackbarService } from '@services/snackbar.service';
import { Category } from '@models/category';
import { CategoryService } from '@services/category.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {

  pageSettings!: PageSettingsModel;
  toolbarOptions!: ToolbarItems[];
  dataCategories: Category[] = [];
  locale: any

  constructor(
    private categoryService: CategoryService,
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

    this.getCategories()
  }

  getCategories(){
    this.categoryService.getAll().subscribe(data => {
      this.dataCategories = data
    })
  }

  deleteCategory(categoryId: string | undefined) {
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
        this.categoryService.delete(categoryId!).then(()=> {
          this.snackService.setSuccess({success: true, message: 'Usuario eliminado'})
          this.getCategories()
        })
      }
    });
  }

}
