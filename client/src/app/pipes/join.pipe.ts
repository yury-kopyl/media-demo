import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'join'
})

export class JoinPipe implements PipeTransform {

    transform(array: any[], arg?: string): string {
        return array.join(arg);
    }
}
