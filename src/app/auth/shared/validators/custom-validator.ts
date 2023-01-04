import {AbstractControl} from '@angular/forms';
import { FormGroup } from '@angular/forms';

export function zipcodeValidator(control: AbstractControl){
    if(control && (control.value !== null || control.value !== undefined)){

        const regex = new RegExp('^[0-9]{5}$');
        if(!regex.test(control.value)){
            return { isError: true };
        }
    }
   return null;
}


export function emailValidator(control: AbstractControl){
    if(control && (control.value !== null || control.value !== undefined)){
        const regex =  new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$');
        if(!regex.test(control.value)){
            return { isError: true };
        }
    }
    return null;
}

export function passValidator(control: AbstractControl):any{
	if(control && (control.value !== null || control.value !== undefined)){
        const cnfpassValue = control.value;
        const passControl = control.root.get('password');
		if(passControl){
			const passValue = passControl.value;
			if(passValue !== cnfpassValue || passValue===''){
				return{
					isError: true
				}
			}
		}
	}
}

// for TDF  password Validation JMU5
export function MustMatch(controlName: string, matchingControlName: string) { // passes in password and confpass input
    return (formGroup:FormGroup):any => {
        const control = formGroup.controls[controlName];   // looks  for control for  password
        const matchingControl = formGroup.controls[matchingControlName];  // Looks for control for confPass

        // return null if controls haven't initialised yet
        if (!control || !matchingControl) {
          return null;
        }

        // return null if another validator has already found an error on the matchingControl
        if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
            return null;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) { // if password does not match confPass
            matchingControl.setErrors({ mustMatch: true });  // turn on error
        } else {
            matchingControl.setErrors(null); // leave as is 
        }
    }
}

export function tdfZipValidator(controlName: string){ //JMU5 Validator for zip. controlName will be the name of the input it is applied to
    return (formGroup: FormGroup) => { //JMU5 will return a FormGroup object
        const control = formGroup.controls[controlName];//JMU5 looks into the object to find applied input name
       
        if(control && (control.value !== null || control.value !== undefined)){ //JMU5 if there isa value in formgroup
                
            const regex = new RegExp('^[0-9]{5}$'); // pattern  for number that is 5 digits long
            if(!regex.test(control.value)){ //see if  the value  is not a number or at 5 digits long
                control.setErrors({ zipcodeValidate: true }); //JMU5  submit error as true
            }else{
                control.setErrors(null ); //JMU5 if it is a 5 digit number,  do not submit an error, leave it as null
            }

        }
        
    }

}