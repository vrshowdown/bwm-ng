import { Directive, Input } from '@angular/core'; //JMU5
import { NG_VALIDATORS, Validator, ValidationErrors, FormGroup } from '@angular/forms';//JMU6

import { MustMatch } from './custom-validator'; //JMU5 import functon from validator file
import {tdfZipValidator} from './custom-validator'; //JMU5

@Directive({
    selector: '[mustMatch],[zipcodeValidate]', //JMU5 name selectors to add to  HTML for multiple directives
    providers: [{ provide: NG_VALIDATORS, useExisting: ValidatorDirective, multi: true }]
})
export class ValidatorDirective implements Validator { //JMU5 Name of Class
    @Input('mustMatch') mustMatch: string[] = []; //JMU5 Inputs  format array for 2 string values 
    @Input('zipcodeValidate') zipcodeValidate: string|any; //input  for 1 string value

    validate(formGroup: FormGroup): ValidationErrors {
        let test ={
            mm: MustMatch(this.mustMatch[0], this.mustMatch[1])(formGroup), //JMU5 Uses confirm pass validator function  to match with original password. Input array holds value for password, and confPass
            zv: tdfZipValidator(this.zipcodeValidate)(formGroup) //uses zipcode Validator function to require a set number of digits 
        }
        return  test; //JMU5
    }
    

}