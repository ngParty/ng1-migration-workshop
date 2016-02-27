import { PipeTransform, Pipe } from 'ng-metadata/core';

@Pipe( { name: 'checkmark' } )
export class CheckmarkPipe implements PipeTransform {

  transform( input: boolean, args?: any ): string {
    return input
      ? '\u2713'
      : '\u2718';
  }

}
