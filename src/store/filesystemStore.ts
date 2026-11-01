import { create } from 'zustand';
import { VirtualFile } from '../types/filesystem';
import { vfsService } from '../services/virtualFileSystem';

interface FilesystemStoreState {
  files: VirtualFile[];
  isLoaded: boolean;
  clipboard: { action: 'copy' | 'cut'; file: VirtualFile } | null;
  selectedFileId: string | null;

  init: () => Promise<void>;
  createFile: (parentPath: string, name: string, content?: string) => Promise<VirtualFile>;
  createFolder: (parentPath: string, name: string) => Promise<VirtualFile>;
  updateFileContent: (path: string, content: string) => Promise<void>;
  deleteFile: (id: string, permanent?: boolean) => Promise<void>;
  restoreFile: (id: string) => Promise<void>;
  renameFile: (id: string, newName: string) => Promise<void>;
  setClipboard: (action: 'copy' | 'cut', file: VirtualFile) => void;
  pasteClipboard: (targetParentPath: string) => Promise<void>;
  getFileByPath: (path: string) => VirtualFile | undefined;
  getFilesInFolder: (parentPath: string) => VirtualFile[];
  resetAll: () => Promise<void>;
  setSelectedFileId: (id: string | null) => void;
}

export const useFilesystemStore = create<FilesystemStoreState>((set, get) => ({
  files: [],
  isLoaded: false,
  clipboard: null,
  selectedFileId: null,

  init: async () => {
    const files = await vfsService.init();
    set({ files, isLoaded: true });
  },

  createFile: async (parentPath, name, content = '') => {
    const ext = name.includes('.') ? name.split('.').pop() : 'txt';
    const cleanPath = `${parentPath.replace(/\/$/, '')}/${name}`;
    const newFile: VirtualFile = {
      id: `file-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      path: cleanPath,
      parentPath,
      type: 'file',
      extension: ext,
      size: content.length,
      modifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      content,
      icon: ext === 'bmp' || ext === 'jpg' ? '/icons/file-image.svg' : '/icons/file-text.svg'
    };

    await vfsService.saveFile(newFile);
    const updated = await vfsService.getAllFiles();
    set({ files: updated });
    return newFile;
  },

  createFolder: async (parentPath, name) => {
    const cleanPath = `${parentPath.replace(/\/$/, '')}/${name}`;
    const newFolder: VirtualFile = {
      id: `dir-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      path: cleanPath,
      parentPath,
      type: 'folder',
      size: 0,
      modifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      icon: '/icons/folder.svg'
    };

    await vfsService.saveFile(newFolder);
    const updated = await vfsService.getAllFiles();
    set({ files: updated });
    return newFolder;
  },

  updateFileContent: async (path, content) => {
    const { files } = get();
    const file = files.find((f) => f.path === path);
    if (!file) return;

    const updated: VirtualFile = {
      ...file,
      content,
      size: content.length,
      modifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    await vfsService.saveFile(updated);
    const all = await vfsService.getAllFiles();
    set({ files: all });
  },

  deleteFile: async (id, permanent = false) => {
    const { files } = get();
    const file = files.find((f) => f.id === id);
    if (!file) return;

    if (permanent || file.parentPath === 'C:/Recycle Bin') {
      await vfsService.deleteFile(id);
    } else {
      // Move to recycle bin
      const recycled: VirtualFile = {
        ...file,
        parentPath: 'C:/Recycle Bin',
        path: `C:/Recycle Bin/${file.name}`,
        isDeleted: true
      };
      await vfsService.saveFile(recycled);
    }

    const all = await vfsService.getAllFiles();
    set({ files: all });
  },

  restoreFile: async (id) => {
    const { files } = get();
    const file = files.find((f) => f.id === id);
    if (!file) return;

    // Restore to C:/My Documents by default
    const restored: VirtualFile = {
      ...file,
      parentPath: 'C:/My Documents',
      path: `C:/My Documents/${file.name}`,
      isDeleted: false
    };

    await vfsService.saveFile(restored);
    const all = await vfsService.getAllFiles();
    set({ files: all });
  },

  renameFile: async (id, newName) => {
    const { files } = get();
    const file = files.find((f) => f.id === id);
    if (!file) return;

    const oldPath = file.path;
    const newPath = `${file.parentPath.replace(/\/$/, '')}/${newName}`;
    const renamed: VirtualFile = {
      ...file,
      name: newName,
      path: newPath
    };

    await vfsService.saveFile(renamed);

    // If folder, update children paths
    if (file.type === 'folder') {
      for (const f of files) {
        if (f.path.startsWith(oldPath + '/')) {
          const childNewPath = f.path.replace(oldPath, newPath);
          const childNewParent = f.parentPath.replace(oldPath, newPath);
          await vfsService.saveFile({
            ...f,
            path: childNewPath,
            parentPath: childNewParent
          });
        }
      }
    }

    const all = await vfsService.getAllFiles();
    set({ files: all });
  },

  setClipboard: (action, file) => {
    set({ clipboard: { action, file } });
  },

  pasteClipboard: async (targetParentPath) => {
    const { clipboard, files } = get();
    if (!clipboard) return;

    const { action, file } = clipboard;
    if (action === 'cut') {
      const newPath = `${targetParentPath.replace(/\/$/, '')}/${file.name}`;
      const moved: VirtualFile = {
        ...file,
        parentPath: targetParentPath,
        path: newPath
      };
      await vfsService.saveFile(moved);
      set({ clipboard: null });
    } else {
      // Copy
      const copyName = `Copy of ${file.name}`;
      const newPath = `${targetParentPath.replace(/\/$/, '')}/${copyName}`;
      const copied: VirtualFile = {
        ...file,
        id: `file-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: copyName,
        parentPath: targetParentPath,
        path: newPath
      };
      await vfsService.saveFile(copied);
    }

    const all = await vfsService.getAllFiles();
    set({ files: all });
  },

  getFileByPath: (path) => {
    return get().files.find((f) => f.path.toLowerCase() === path.toLowerCase());
  },

  getFilesInFolder: (parentPath) => {
    const p = parentPath.replace(/\/$/, '').toLowerCase();
    return get().files.filter((f) => f.parentPath.toLowerCase() === p);
  },

  resetAll: async () => {
    const seeded = await vfsService.resetFileSystem();
    set({ files: seeded, clipboard: null, selectedFileId: null });
  },

  setSelectedFileId: (id) => {
    set({ selectedFileId: id });
  }
}));
