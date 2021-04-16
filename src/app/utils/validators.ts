import { ProvidersService } from '@services/providers.service';
import { AbstractControl } from '@angular/forms';
import { map } from 'rxjs/operators';

export class CustomValidators{

  // static validateProvider(service: ProvidersService) {
  //   return (control: AbstractControl) => {
  //     const value = control.value;
  //     return service.getHabitabilityProvider(value)
  //     .pipe(
  //       map((response: any) => {
  //         let isAvailable = response[0];
  //         if(isAvailable === undefined) isAvailable = false
  //         console.log(isAvailable)
  //         if (isAvailable === true) {
  //           return {available: true};
  //         }

  //         return null;
  //       })
  //     );
  //   };
  // }
}
