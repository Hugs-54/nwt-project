import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

    static atLeastOneCheckboxChecked(): ValidatorFn {
        return (formArray: AbstractControl): ValidationErrors | null => {
            const answers = formArray.value;
            let check = 0;
            for (let i = 0; i < answers.length; i++) {
                if(answers[i].isCorrect === true){
                    check++;
                }
            }
            if (check > 0) {
              return null; // Au moins une case est cochée
            } else {
              return { atLeastOneCheckboxChecked: true }; // Aucune case a été cochée
            }
        };
      }

    static arrayContainsAtLeast(minLength: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value.length < minLength) {
                return { 'minArrayLength': true }; //La taille n'est pas bonne
            }
            return null; //La taille est bonne
        }
    }
}
