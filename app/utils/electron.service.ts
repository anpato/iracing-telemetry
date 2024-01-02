import { Session, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { Database } from '~/shared/db';
import { getPlatform } from '~/utils/get-platform';

function parseDataFile(filePath: string): Record<'session', Session | null> {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify({ session: null }));
    }
    return JSON.parse(fs.readFileSync(filePath) as unknown as string);
  } catch (error) {
    return { session: null };
  }
}

class ElectronStore {
  private electron = require('electron');
  private path: string;
  private data: Record<'session', Session | null>;
  constructor() {
    const userPath = this.electron.app.getPath('userData');
    this.path = path.join(userPath, 'session.json');
    this.data = parseDataFile(this.path);
  }

  setSession(session: Session) {
    this.data['session'] = session;
    this.storeSessionInFile(session);
  }

  getSession(): Session | null {
    return this.data.session;
  }

  clearSession() {
    // fs.rmSync(this.path);
    this.data.session = null;
  }

  private storeSessionInFile(data: Session) {
    fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2));
  }
}

export const ElectronService =
  getPlatform() === 'desktop' ? new ElectronStore() : null;
