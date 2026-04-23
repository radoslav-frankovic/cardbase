import { Injectable, signal } from '@angular/core';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import type { CardRecord } from './app';

interface OwnedCardRow {
  card_id: string;
  copies: CardRecord['copies'];
  notes: string;
  photo: string | null;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client: SupabaseClient;
  readonly session = signal<Session | null>(null);
  readonly authReady = signal(false);

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });

    void this.client.auth.getSession().then(({ data }) => {
      this.session.set(data.session);
      this.authReady.set(true);
    });

    this.client.auth.onAuthStateChange((_event, session) => {
      this.session.set(session);
      this.authReady.set(true);
    });
  }

  configured(): boolean {
    return !environment.supabaseUrl.includes('YOUR_PROJECT_REF') && !environment.supabaseAnonKey.includes('YOUR_');
  }

  async signIn(email: string, password: string): Promise<void> {
    const { error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
  }

  async signUp(email: string, password: string): Promise<void> {
    const { error } = await this.client.auth.signUp({ email, password });
    if (error) {
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await this.client.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) {
      throw error;
    }
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut();
    if (error) {
      throw error;
    }
  }

  async loadOwnedCards(): Promise<Map<string, OwnedCardRow>> {
    const { data, error } = await this.client
      .from('owned_cards')
      .select('card_id,copies,notes,photo,updated_at');

    if (error) {
      throw error;
    }

    return new Map((data ?? []).map((row) => [row.card_id, row as OwnedCardRow]));
  }

  async saveCard(card: CardRecord): Promise<void> {
    const hasData = Boolean(card.copies?.length || card.notes);

    if (!hasData) {
      const { error } = await this.client.from('owned_cards').delete().eq('card_id', card.id);
      if (error) {
        throw error;
      }
      return;
    }

    const { error } = await this.client.from('owned_cards').upsert(
      {
        card_id: card.id,
        copies: card.copies ?? [],
        notes: card.notes,
        photo: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,card_id' },
    );

    if (error) {
      throw error;
    }
  }

  async clearOwnedCards(): Promise<void> {
    const { error } = await this.client.from('owned_cards').delete().neq('card_id', '');
    if (error) {
      throw error;
    }
  }
}
