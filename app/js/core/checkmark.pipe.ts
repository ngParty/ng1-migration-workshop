import { PipeTransform, Pipe } from 'ng-metadata/core';

@Pipe( { name: 'checkamrk' } )
export class CheckmarkPipe implements PipeTransform {

  transform( input: boolean, ...args: any[] ): string {
    return input
      ? '\u2713'
      : '\u2718';
  }

}
