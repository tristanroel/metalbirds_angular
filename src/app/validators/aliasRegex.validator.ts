import { AbstractControl, ValidationErrors } from "@angular/forms";

export function aliasRegexValidator (control : AbstractControl) : ValidationErrors | null {
    if(control.value){
        const regex = /^[a-zA-Z0-9]+$/;
        if (regex.test(control.value)) {
            return null; // Le modèle est valide
        } else {
            // Le modèle est invalide
            return {aliasRegex : 'characteres invalide'}
        }
    }
    return {aliasRegex : 'alias required'}
}