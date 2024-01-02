export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: {
          created_at: string
          id: string
          metadata: Json
          track_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata: Json
          track_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json
          track_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_track_id_fkey"
            columns: ["track_id"]
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      telemetry: {
        Row: {
          created_at: string
          data: Json
          id: string
          sessionId: string
        }
        Insert: {
          created_at?: string
          data: Json
          id?: string
          sessionId: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          sessionId?: string
        }
        Relationships: [
          {
            foreignKeyName: "telemetry_sessionId_fkey"
            columns: ["sessionId"]
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      tracks: {
        Row: {
          created_at: string
          id: string
          irTrackId: number
          trackName: string
        }
        Insert: {
          created_at?: string
          id?: string
          irTrackId: number
          trackName: string
        }
        Update: {
          created_at?: string
          id?: string
          irTrackId?: number
          trackName?: string
        }
        Relationships: []
      }
      user_infos: {
        Row: {
          created_at: string
          first_time_login: boolean
          id: string
          iracing_member_id: string | null
          meta: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          first_time_login?: boolean
          id?: string
          iracing_member_id?: string | null
          meta?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          first_time_login?: boolean
          id?: string
          iracing_member_id?: string | null
          meta?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_infos_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

