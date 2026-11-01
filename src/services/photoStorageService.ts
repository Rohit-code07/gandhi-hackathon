// Photo Storage Service using IndexedDB for Blobs and Object URLs

export interface StoredPhoto {
  id: string;
  name: string;
  folder: string; // e.g. "C:/My Pictures"
  size: number;
  type: string;
  width: number;
  height: number;
  blob: Blob;
  uploadedAt: string;
}

const DB_NAME = 'Win98_PhotosDB';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

class PhotoStorageService {
  private db: IDBDatabase | null = null;
  private isReady = false;
  private urlCache: Map<string, string> = new Map();

  public async init(): Promise<void> {
    if (this.isReady) return;

    return new Promise((resolve) => {
      try {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e: any) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            store.createIndex('folder', 'folder', { unique: false });
          }
        };

        req.onsuccess = async (e: any) => {
          this.db = e.target.result;
          this.isReady = true;
          // Seed default retro photos if empty
          const count = await this.countPhotos();
          if (count === 0) {
            await this.seedDefaultPhotos();
          }
          resolve();
        };

        req.onerror = () => {
          this.isReady = true;
          resolve();
        };
      } catch (err) {
        this.isReady = true;
        resolve();
      }
    });
  }

  private countPhotos(): Promise<number> {
    return new Promise((resolve) => {
      if (!this.db) return resolve(0);
      const tx = this.db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const countReq = store.count();
      countReq.onsuccess = () => resolve(countReq.result);
      countReq.onerror = () => resolve(0);
    });
  }

  // Seed default 1998 retro photos
  private async seedDefaultPhotos(): Promise<void> {
    // 1. Family Trip 1998 Photo SVG Blob
    const familyTripSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <rect width="400" height="300" fill="#e8dcba"/>
      <rect x="20" y="20" width="360" height="260" fill="#eed9b3" stroke="#8b7355" stroke-width="2"/>
      <rect x="40" y="180" width="320" height="80" fill="#8b5a2b"/>
      <rect x="150" y="70" width="120" height="100" rx="4" fill="#d2b48c" stroke="#5c2e17" stroke-width="2"/>
      <rect x="160" y="80" width="100" height="80" fill="#008080"/>
      <text x="210" y="125" fill="#fff" font-family="monospace" font-size="10" text-anchor="middle">Windows 98</text>
      <circle cx="100" cy="110" r="28" fill="#ffe0bd" stroke="#000" stroke-width="2"/>
      <path d="M75 110 Q100 80 125 110 Z" fill="#3d2314"/>
      <circle cx="92" cy="108" r="4" fill="#000"/>
      <circle cx="108" cy="108" r="4" fill="#000"/>
      <path d="M92 120 Q100 128 108 120" stroke="#000" stroke-width="2" fill="none"/>
      <path d="M75 138 L125 138 L135 220 L65 220 Z" fill="#000080" stroke="#000" stroke-width="2"/>
      <text x="200" y="250" font-family="Comic Sans MS, cursive" font-size="13" font-weight="bold" fill="#333" text-anchor="middle">
        "Hostel Room 204 - November 1998 (With Pentium II 350MHz)"
      </text>
    </svg>`;
    const blob1 = new Blob([familyTripSvg], { type: 'image/svg+xml' });
    await this.saveBlob(blob1, 'family_trip_1998.bmp', 'C:/My Pictures', 400, 300);

    // 2. Alex & Pentium II Vintage Photo
    const pentium2Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <rect width="400" height="300" fill="#1b2735"/>
      <circle cx="200" cy="140" r="90" fill="#ffd700" stroke="#ffaa00" stroke-width="4"/>
      <text x="200" y="130" font-family="Arial, sans-serif" font-weight="bold" font-size="28" fill="#000" text-anchor="middle">intel</text>
      <text x="200" y="165" font-family="Arial, sans-serif" font-weight="bold" font-size="18" fill="#000" text-anchor="middle">pentium® II</text>
      <text x="200" y="260" font-family="monospace" font-size="12" fill="#00ff66" text-anchor="middle">
        Maneuvering 350 MHz with MMX Technology
      </text>
    </svg>`;
    const blob2 = new Blob([pentium2Svg], { type: 'image/svg+xml' });
    await this.saveBlob(blob2, 'me_and_my_pentium2.bmp', 'C:/My Pictures', 400, 300);

    // 3. Secret Photo
    const secretSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <rect width="400" height="300" fill="#000000"/>
      <rect x="20" y="20" width="360" height="260" fill="#0a192f" stroke="#00ffcc" stroke-width="2"/>
      <text x="200" y="100" fill="#ff0055" font-family="Impact" font-size="24" text-anchor="middle">TOP SECRET EVIDENCE</text>
      <circle cx="200" cy="160" r="40" fill="#ffd700"/>
      <circle cx="188" cy="155" r="5" fill="#000"/>
      <circle cx="212" cy="155" r="5" fill="#000"/>
      <path d="M185 175 Q200 195 215 175" fill="none" stroke="#000" stroke-width="3"/>
      <text x="200" y="235" fill="#ffffff" font-family="monospace" font-size="11" text-anchor="middle">
        "The day KaZaA disconnected at 99.8% - Oct 2005"
      </text>
    </svg>`;
    const blob3 = new Blob([secretSvg], { type: 'image/svg+xml' });
    await this.saveBlob(blob3, 'evidence_classified.jpg', 'C:/My Pictures', 400, 300);
  }

  private saveBlob(blob: Blob, name: string, folder: string, width: number, height: number): Promise<StoredPhoto> {
    return new Promise((resolve) => {
      const id = `photo-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const photo: StoredPhoto = {
        id,
        name,
        folder,
        size: blob.size,
        type: blob.type || 'image/jpeg',
        width: width || 400,
        height: height || 300,
        blob,
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };

      if (!this.db) return resolve(photo);

      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(photo);
      tx.oncomplete = () => resolve(photo);
    });
  }

  public async savePhoto(file: File | Blob, name: string, folder: string = 'C:/My Pictures'): Promise<StoredPhoto> {
    await this.init();

    // Read image dimensions if browser image
    const { width, height } = await this.getImageDimensions(file);

    return this.saveBlob(file, name, folder, width, height);
  }

  private getImageDimensions(blob: Blob): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth || 400, height: img.naturalHeight || 300 });
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        resolve({ width: 400, height: 300 });
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
  }

  public async getAllPhotos(): Promise<StoredPhoto[]> {
    await this.init();
    return new Promise((resolve) => {
      if (!this.db) return resolve([]);
      const tx = this.db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  public async getPhotosByFolder(folder: string): Promise<StoredPhoto[]> {
    const all = await this.getAllPhotos();
    const cleanFolder = folder.replace(/\/+$/, '').toLowerCase();
    return all.filter((p) => p.folder.replace(/\/+$/, '').toLowerCase() === cleanFolder);
  }

  public async getPhotoById(id: string): Promise<StoredPhoto | undefined> {
    await this.init();
    return new Promise((resolve) => {
      if (!this.db) return resolve(undefined);
      const tx = this.db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(undefined);
    });
  }

  public async deletePhoto(id: string): Promise<void> {
    await this.init();
    this.revokeObjectUrl(id);
    return new Promise((resolve) => {
      if (!this.db) return resolve();
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve();
    });
  }

  public async renamePhoto(id: string, newName: string): Promise<void> {
    const photo = await this.getPhotoById(id);
    if (!photo || !this.db) return;

    photo.name = newName;
    return new Promise((resolve) => {
      const tx = this.db!.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(photo);
      tx.oncomplete = () => resolve();
    });
  }

  public async getFolders(): Promise<string[]> {
    const photos = await this.getAllPhotos();
    const folderSet = new Set<string>(['C:/My Pictures', 'C:/My Pictures/Sample Photos']);
    photos.forEach((p) => {
      if (p.folder) folderSet.add(p.folder);
    });
    const saved = localStorage.getItem('win98_photo_custom_folders');
    if (saved) {
      try {
        const arr = JSON.parse(saved);
        arr.forEach((f: string) => folderSet.add(f));
      } catch (e) {}
    }
    return Array.from(folderSet);
  }

  public addFolder(folderPath: string): void {
    const saved = localStorage.getItem('win98_photo_custom_folders');
    const arr = saved ? JSON.parse(saved) : [];
    if (!arr.includes(folderPath)) {
      arr.push(folderPath);
      localStorage.setItem('win98_photo_custom_folders', JSON.stringify(arr));
    }
  }

  // Get or create cached Object URL
  public getObjectUrl(photo: StoredPhoto): string {
    if (this.urlCache.has(photo.id)) {
      return this.urlCache.get(photo.id)!;
    }
    const url = URL.createObjectURL(photo.blob);
    this.urlCache.set(photo.id, url);
    return url;
  }

  public revokeObjectUrl(id: string): void {
    if (this.urlCache.has(id)) {
      URL.revokeObjectURL(this.urlCache.get(id)!);
      this.urlCache.delete(id);
    }
  }

  public clearAllObjectUrls(): void {
    this.urlCache.forEach((url) => URL.revokeObjectURL(url));
    this.urlCache.clear();
  }
}

export const photoStorageService = new PhotoStorageService();
