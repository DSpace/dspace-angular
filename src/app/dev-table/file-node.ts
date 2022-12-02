export class FileNode {
  children: FileNode[];
  taskName: string;
  donePercentage: any;
  status: any = 'unspecified';

  getParsedPercentage() {
    let ret = '';
    if (this.donePercentage != null) {
      ret = ': ' + this.donePercentage + '%';
    }
    return ret;
  }
}
