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
  private name: string = `${process.env.SUPABASE_PROJECT}-auth-token`;
  constructor() {
    const userPath = this.electron.app.getPath('userData');
    this.partition = this.electron.session.fromPartition('persist:session');
    this.path = path.join(userPath, 'session.json');
    this.data = parseDataFile(this.path);
  }

  async setSession(session: Session) {
    // console.log(this.electron.app.getAppPath());
    await this.electron.session.defaultSession.cookies.set({
      path: '/',
      sameSite: 'lax',
      url: 'http://www.test.com',
      domain: 'test.com',
      expirationDate: session.expires_at,
      name: this.name,
      value: encodeURIComponent(
        [
          session.access_token,
          session.refresh_token,
          null,
          null,
          null
        ].toString()
      )
    });
    return session;
    // this.storeSessionInFile(session);
  }

  getSession(): Session | null {
    return null;
  }

  clearSession() {
    this.electron.session.defaultSession.cookies.remove('/', this.name);
  }

  private storeSessionInFile(data: Session) {
    fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2));
  }
}

export const ElectronService =
  getPlatform() === 'desktop' ? new ElectronStore() : null;
