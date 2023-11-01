import { AbstractControl, FormArray, ValidationErrors } from '@angular/forms';

export class CustomValidators {

    static arrayContainsAtLeast(minLength: number): ValidationErrors | null {
        return (control: AbstractControl): {[key: string]:boolean} | null => {
            if (control.value.length < minLength) {
                return { 'minArrayLength': true };
            }
            return null;
        }
    }
}
