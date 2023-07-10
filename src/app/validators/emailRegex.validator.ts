import { AbstractControl, ValidationErrors } from "@angular/forms";

export function emailRegexValidator (control : AbstractControl) : ValidationErrors | null {
    if(control.value){
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (regex.test(control.value)) {
            return null; // Le modèle est valide
        } else {
            // Le modèle est invalide
            return {emailRegex : 'invalid email'}
        }
    }
    return {emailRegex : 'email required'}
}