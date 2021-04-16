import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Bill } from '@models/bill';
import { Provider } from '@models/provider';
import { BillService } from '@services/bill.service';
import { ProvidersService } from '@services/providers.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.scss']
})
export class ReportFormComponent implements OnInit {

  reportForm!: FormGroup
  loadingSearch = false
  billsReport!: Bill[]
  filterProvider!: Bill[]
  totalReport!: number

  constructor(
    private formBuilder: FormBuilder,
    private billService: BillService,
    private providersService: ProvidersService

  ) {
    this.builderForm()
  }

  ngOnInit(): void {
  }

  searchReport() {
    if (!this.reportForm!.valid) {
      this.reportForm!.markAllAsTouched()
      return
    }

    const dateString: string = this.reportFormControls.date.value
    const monthReport = +dateString.slice(5, 8) - 1
    this.billService.getAll().pipe(
      switchMap(dataBills => {
        const bills: Bill[] = dataBills
        bills.map(bill => bill.date = new Date(bill.date).getMonth())
        this.billsReport = bills.filter(bill => bill.date === monthReport)
        this.filterProvider = this.billsReport.filter((actually, index, array) => {
          return array.findIndex(value => value.providerId === actually.providerId) === index
        })
        return this.providersService.getAll()
      })).subscribe(providersData => {
        const providers: Provider[] = providersData
        for (let index = 0; index < this.filterProvider.length; index++) {
          const indexProvider = providers.findIndex(provider => provider.id === this.filterProvider[index].providerId)
          if (indexProvider !== -1) this.filterProvider[index] = {
            ...this.filterProvider[index],
            nit: providers[indexProvider].nit,
            tradename: providers[indexProvider].tradename,
          }
        }

        let totalFull = 0
        this.billsReport.forEach(function (bill, index) {
          totalFull += bill.total
        })

        this.totalReport = totalFull

        let sumBills = 0;
        for (let index in this.filterProvider) {
          const filter: Bill[] = this.billsReport.filter(provider => provider.providerId === this.filterProvider[index].providerId)
          filter.forEach(function (bill, index) {
            sumBills = sumBills + bill.total
          })
          this.filterProvider[index] = {
            ...this.filterProvider[index],
            totalBills: filter.length,
            sumTotal: sumBills
          }
          sumBills = 0
        }

        let total = 0
        this.filterProvider.forEach(function (bill) {
          total = total + bill.sumTotal!
        })

        this.filterProvider.sort((bill, otherBill)=> otherBill.totalBills! - bill.totalBills!)
      })

  }

  builderForm() {
    this.reportForm! = this.formBuilder.group({
      date: ['']
    })
  }

  get reportFormControls() {
    return this.reportForm!.controls
  }
}
