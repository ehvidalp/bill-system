import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators';
import { Bill } from '@models/bill';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  url = 'bills';
  billsCollection: AngularFirestoreCollection<Bill>
  billDoc: AngularFirestoreDocument<Bill> | undefined
  bill: Observable<Bill[]> | undefined;
  getEditBill!: Object
  constructor(
    private dataBase: AngularFirestore,
  ) {
    this.billsCollection = this.dataBase.collection(this.url);
  }

  create(bill: Bill): any {
    return this.billsCollection.add(bill)
  }

  update(id: string, bill: Bill): Promise<void> {
    return this.billsCollection.doc(id).set(bill)
  }

  get(id: string): Observable<any> {
    this.billDoc = this.dataBase.collection(this.url).doc(id)
    return this.billDoc.get()
  }

  searchBillExists(serie: string, numberBill: string, providerId: string): Observable<any> {
    let existsBill: boolean = false
    return this.dataBase.collection(this.url, ref => ref.where('serie', '==', serie).where('numberBill', '==', numberBill).where('providerId', '==', providerId)).snapshotChanges().pipe(
      map(action => {
        return action.map(value => {
          const data = value.payload.doc.data() as Bill;
          if (data!.serie) existsBill = true
          return existsBill
        })
      })
    )
  }

    // getByDates(startDate: Date, endDate: Date): Observable<any> {
    //   return this.dataBase.collection(this.url, ref => ref.where('date', '==', '2021-02-22')).snapshotChanges().pipe(
    //     map(action => {
    //       return action.map(value  => {
    //         const data = value.payload.doc.data() as Bill;
    //         data.id = value.payload.doc.id;
    //         return data
    //       })
    //     })
    //   )
    // }


  getAll(): Observable<any> {
    this.bill = this.dataBase.collection(this.url).snapshotChanges().pipe(
      map(action => {
        return action.map(value => {
          const data = value.payload.doc.data() as Bill;
          data.id = value.payload.doc.id;
          return data
        })
      })
    )
    return this.bill;
  }

  delete(id: string): Promise<void> {
    this.billDoc = this.dataBase.doc(`${this.url}/${id}`)
    return this.billDoc.delete()
  }
}
