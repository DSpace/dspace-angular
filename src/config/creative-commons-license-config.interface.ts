import { Config } from './config.interface';

export interface CreativeCommonsLicenseConfig extends Config {

    /**
     * CC icon position ('sidebard' or 'content')
     * Used by {@link ItemPageCcLicenseFieldComponent}.
     */
    position: 'sidebard' | 'content';

    /**
     * Shows the CC license name with the image. Always show if image fails to load
     * Used by {@link ItemPageCcLicenseFieldComponent}.
     */
    showName: boolean;

    /**
     * Show the disclaimer in the 'full' variant of the component
     * Used by {@link ItemPageCcLicenseFieldComponent}.
     */
    showDisclaimer: boolean;
}
