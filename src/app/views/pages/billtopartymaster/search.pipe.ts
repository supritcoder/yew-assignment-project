import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log('Value:', value);
    console.log('Args:', args);
    if (!value) return null;
    if (!args) return value;
  
    args = args.toLowerCase();
    const filteredValue = value.filter((item: any) => {
      return JSON.stringify(item).toLowerCase().includes(args);
    });
  
    console.log('Filtered Value:', filteredValue);
    return filteredValue;
  }
  
}
