import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export const sameValidatorFactory: (
  firstField: string,
  secondField: string
) => ValidatorFn =
  (firstField, secondField) =>
  (group: AbstractControl): ValidationErrors | null => {
    const value = group.get(firstField)?.value;
    const valueConfirmation = group.get(secondField)?.value;
    return value === valueConfirmation ? null : { notSame: true };
  };

export default sameValidatorFactory;
