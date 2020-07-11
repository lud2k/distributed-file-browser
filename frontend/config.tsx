interface FrontendConfig {
  rootDirName: string
  filePreviewSize: number
}

export const config: FrontendConfig = {
  rootDirName: 'root',
  filePreviewSize: 100000,
  ...(window as any).config,
}
