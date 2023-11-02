import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

    static atLeastOneCheckboxChecked(): ValidatorFn {
        return (formArray: AbstractControl): ValidationErrors | null => {
          if (formArray instanceof FormArray) {
            const controls = formArray.controls;
            const isChecked = controls.some((control) => control.get('isCorrect')?.value === true);
    
            if (isChecked) {
              return null; // Au moins une case est cochée
            } else {
              return { atLeastOneCheckboxChecked: true }; // Aucune case a été cochée
            }
          }
    
          return null; // Si ce n'est pas un FormArray, la validation est ignorée
        };
      }

    static arrayContainsAtLeast(minLength: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value.length < minLength) {
                return { 'minArrayLength': true };
            }
            return null;
        }
    }
}
