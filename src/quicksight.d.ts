declare module "amazon-quicksight-embedding-sdk" {
  function embedDashboard(options: EmbeddingOptions): any;
  function embedSession(options: EmbeddingOptions): any;
  
  export interface EmbeddingOptions {
    dashboardId?: string,
    url: string,
    container: HTMLElement | string,
    errorCallback?: Function,
    loadCallback?: Function,
    parametersChangeCallback?: Function,
    selectedSheetChangeCallback?: Function,
    parameters?: Object,
    printEnabled?: boolean,
    sheetTabsDisabled?: boolean,
    sheetId?: string,
    defaultEmbeddingVisualType?: string,
    iframeResizeOnSheetChange?: boolean,
    width?: string,
    height?: string,
    loadingHeight?: string,
    scrolling?: string,
    className?: string,
    locale?: string,
    footerPaddingEnabled?: boolean,
    undoRedoDisabled?: boolean,
    resetDisabled?: boolean,
    isQEmbedded?: boolean,
    qSearchBarOptions?: QSearchBarOptions
  }

  export interface QSearchBarOptions {
    expandCallback?: Function,
    collapseCallback?: Function,
    iconDisabled?: boolean,
    topicNameDisabled?: boolean, 
    themeId?: string,
    allowTopicSelection?: boolean
  }
}