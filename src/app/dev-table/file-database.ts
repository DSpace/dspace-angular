/**
 * Json node data with nested structure. Each node has a filename and a value or a list of children
 */
import doc from './dev-progress.json';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileNode } from './file-node';

/**
 * The Json tree data in string. The data could be parsed into Json object
 */
const TREE_DATA = JSON.stringify(doc);

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class FileDatabase {
  reserved = ['name', 'percentage', 'status'];
  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Parse the string to json object.
    const dataObject = JSON.parse(TREE_DATA);

    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.
    const data = this.buildFileTree(dataObject);

    // Notify the change.
    this.dataChange.next(data);
  }


  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(obj: { [key: string]: any }, level: number = 0): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new FileNode();
      node.taskName = key;
      if (this.reserved.includes(key)) {
        return accumulator;
      }

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
          if (value.name != null) {
            node.taskName = value.name;
          }
          if (value.status != null) {
            node.status = value.status;
          }
          if (value.percentage != null) {
            node.donePercentage = value.percentage;
          }
        } else {
          node.donePercentage = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}
