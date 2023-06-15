import Mirador from 'mirador/dist/es/src/index';

// You can modify this default Mirador configuration file. However,
// you should consider creating a copy of this file named
// 'config.local.js'. If that file exists it will be used to build
// your local Mirador instance. This allows you to keep local
// Mirador configuration separate from this default distribution
// copy.

// For an example of all Mirador configuration options, see
// https://github.com/ProjectMirador/mirador/blob/master/src/config/settings.js

// You can add or remove plugins. When adding new plugins be sure to also
// import them into the project via your package.json dependencies.
import miradorShareDialogPlugin from 'mirador-share-plugin/es/MiradorShareDialog';
import miradorSharePlugin from 'mirador-share-plugin/es/miradorSharePlugin';
import miradorDownloadPlugin from 'mirador-dl-plugin/es/miradorDownloadPlugin';
import miradorDownloadDialog from 'mirador-dl-plugin/es/MiradorDownloadDialog';

const params = new URLSearchParams(location.search);
const manifest = params.get('manifest');
const searchOption = params.get('searchable');
const query = params.get('query');
const multi = params.get('multi');
const notMobile = params.get('notMobile');

let windowSettings = {};
let sidbarPanel = 'info';
let defaultView = 'single';
let multipleItems = false;
let thumbNavigation = 'off';

windowSettings.manifestId = manifest;

(() => {
  if (searchOption) {
    defaultView = 'book';
    sidbarPanel = 'search';
    multipleItems = true;
    if (notMobile) {
      thumbNavigation = 'far-right';
    }
    if (query !== 'null') {
      windowSettings.defaultSearchQuery = query;
    }
  } else {
    if(multi) {
      multipleItems = multi;
      if (notMobile) {
        thumbNavigation = 'far-right';
      }
    }
  }
})();

(Mirador.viewer(
    {
      id: 'mirador',
      mainMenuSettings: {
        show: true
      },
      thumbnailNavigation: {
        defaultPosition: thumbNavigation, // Which position for the thumbnail navigation to be be displayed. Other possible values are "far-bottom" or "far-right"
        displaySettings: true, // Display the settings for this in WindowTopMenu
        height: 120, // height of entire ThumbnailNavigation area when position is "far-bottom"
        width: 100, // width of one canvas (doubled for book view) in ThumbnailNavigation area when position is "far-right"
      },
      themes: {
        light: {
          palette: {
            type: 'light',
            primary: {
              main: '#266883',
            },
            secondary: {
              main: '#b03727',
            },
            shades: { // Shades that can be used to offset color areas of the Workspace / Window
              dark: '#eeeeee',
              main: '#ffffff',
              light: '#ffffff',
            },
            highlights: {
              primary: '#ffff00',
              secondary: '#00BFFF',
            },
            search: {
              default: { fillStyle: '#00BFFF', globalAlpha: 0.3 },
              hovered: { fillStyle: '#00FFFF', globalAlpha: 0.3 },
              selected: { fillStyle: '#ff0900', globalAlpha: 0.3 },
            },
          },
        },
        dark: {
          palette: {
            type: 'dark',
            primary: {
              main: '#2790b0',
            },
            secondary: {
              main: '#eeeeee',
            },
            highlights: {
              primary: '#ffff00',
              secondary: '#00BFFF',
            },
          },
        },
      },
      selectedTheme: 'light',
      data: [manifest],
      windows: [
        windowSettings
      ],
      miradorSharePlugin: {
        dragAndDropInfoLink: 'https://iiif.io',
        embedOption: {
          enabled: true,
          embedUrlReplacePattern: [
            /.*\.edu\/(\w+)\/iiif\/manifest/,
            manifest
          ],
          syncIframeDimensions: {
            height: {param: 'maxheight'},
          },
        },
        shareLink: {
          enabled: true,
          manifestIdReplacePattern: [
            /\/iiif\/manifest/,
            '',
          ],
        },
      },
      miradorDownloadPlugin: {
        restrictDownloadOnSizeDefinition: false
      },
      window: {
        allowClose: false,
        // sideBarOpenByDefault: false,
        allowFullscreen: true,
        allowMaximize: false,
        defaultView: defaultView,
        sideBarOpen: notMobile,
        allowTopMenuButton: true,
        defaultSidebarPanelWidth: 230,
        switchCanvasOnSearch: true,
        views: [
          { key: 'single', behaviors: ['individuals'] },
          { key: 'book', behaviors: ['paged'] },
          { key: 'scroll', behaviors: ['continuous'] },
          { key: 'gallery' },
        ],
        panels: {
          info: true,
          attribution: false,
          canvas: true,
          search: searchOption,
          layers: false,
        },
        sideBarPanel: sidbarPanel
      },
      workspace: {
        allowNewWindows: false,
        showZoomControls: true,
        type: 'mosaic'
      },
      workspaceControlPanel: {
        enabled: false
      }
    },
    [
      miradorShareDialogPlugin,
      miradorSharePlugin,
      miradorDownloadDialog,
      miradorDownloadPlugin
    ]
  )
)(manifest);
