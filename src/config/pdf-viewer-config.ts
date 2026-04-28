import { Config } from './config.interface';

export class PdfViewerConfig implements Config {

  /**
   * Whether the PDF viewer is enabled throughout the whole application
   */
  public enabled: boolean;
}
