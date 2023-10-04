import { autoserialize, autoserializeAs } from 'cerialize';

/**
 * This class is used to store the information about a file or a directory
 */
export class FileInfo {
  @autoserialize name: string;
  @autoserialize content: any;
  @autoserialize size: string;
  @autoserialize isDirectory: boolean;
  @autoserializeAs('sub') sub: { [key: string]: FileInfo };
}
