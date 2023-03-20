import { FormControl } from '@angular/forms';

export function cutWordIfNumberTooHight(maxNumber: number) {
  return (control: FormControl) => {
    const number = control.value;
    if (number > maxNumber) {
      const cutNumber = number.toString().slice(0, 4);
      control.setValue(Number(cutNumber));
      return { cutWord: true };
    }
    return null;
  };
}
