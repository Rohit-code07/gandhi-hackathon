export interface VirtualFile {
  id: string;
  name: string;
  path: string; // e.g. "C:/My Documents/diary.txt"
  parentPath: string; // e.g. "C:/My Documents"
  type: 'file' | 'folder' | 'drive';
  extension?: string;
  size: number; // in bytes
  modifiedAt: string;
  content?: string;
  icon?: string;
  isSystem?: boolean;
  isHidden?: boolean;
  isDeleted?: boolean;
}

export interface DriveInfo {
  letter: string;
  label: string;
  totalBytes: number;
  freeBytes: number;
  icon: string;
}
