import { AbstractControl, ValidationErrors } from "@angular/forms";

export function passwdRegexValidator (control : AbstractControl) : ValidationErrors | null {
    if(control.value){
        const regex = /^[a-zA-Z0-9=]+$/;
        if (regex.test(control.value)) {
            return null; // Le modèle est valide
        } else {
            return {passwdRegex: 'Password: enter letters from \'a\' to \'Z\' or numbers from 0 to 9'}
        }
    }
    return {passwdRegex : 'password required'}
}