export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.18';
  };
  public: {
    Tables: {
      project_developers: {
        Row: {
          id: string;
          name: string;
          position: number;
          project_id: string;
          url: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          position?: number;
          project_id: string;
          url?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          position?: number;
          project_id?: string;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'project_developers_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      project_features: {
        Row: {
          description: string;
          id: string;
          position: number;
          project_id: string;
          title: string;
        };
        Insert: {
          description?: string;
          id?: string;
          position?: number;
          project_id: string;
          title: string;
        };
        Update: {
          description?: string;
          id?: string;
          position?: number;
          project_id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_features_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      project_images: {
        Row: {
          alt: string;
          created_at: string;
          id: string;
          path: string;
          position: number;
          project_id: string;
        };
        Insert: {
          alt: string;
          created_at?: string;
          id?: string;
          path: string;
          position?: number;
          project_id: string;
        };
        Update: {
          alt?: string;
          created_at?: string;
          id?: string;
          path?: string;
          position?: number;
          project_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_images_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      project_requests: {
        Row: {
          client_name: string;
          consent: boolean;
          contact_preference: Database['public']['Enums']['contact_preference'];
          created_at: string;
          deadline: string | null;
          description: string;
          email: string;
          id: string;
          ip_hash: string | null;
          phone: string | null;
          platform: Database['public']['Enums']['request_platform'];
          status: Database['public']['Enums']['request_status'];
        };
        Insert: {
          client_name: string;
          consent: boolean;
          contact_preference: Database['public']['Enums']['contact_preference'];
          created_at?: string;
          deadline?: string | null;
          description: string;
          email: string;
          id?: string;
          ip_hash?: string | null;
          phone?: string | null;
          platform: Database['public']['Enums']['request_platform'];
          status?: Database['public']['Enums']['request_status'];
        };
        Update: {
          client_name?: string;
          consent?: boolean;
          contact_preference?: Database['public']['Enums']['contact_preference'];
          created_at?: string;
          deadline?: string | null;
          description?: string;
          email?: string;
          id?: string;
          ip_hash?: string | null;
          phone?: string | null;
          platform?: Database['public']['Enums']['request_platform'];
          status?: Database['public']['Enums']['request_status'];
        };
        Relationships: [];
      };
      projects: {
        Row: {
          client: string;
          color_accent: string;
          color_background: string;
          color_primary: string;
          created_at: string;
          description: string;
          has_ring: boolean;
          id: string;
          name: string;
          position: number;
          published: boolean;
          slug: string;
          summary: string;
          technologies: string[];
          texture: Database['public']['Enums']['planet_texture'];
          type: Database['public']['Enums']['project_type'];
          updated_at: string;
          year: number;
        };
        Insert: {
          client?: string;
          color_accent: string;
          color_background: string;
          color_primary: string;
          created_at?: string;
          description?: string;
          has_ring?: boolean;
          id?: string;
          name: string;
          position?: number;
          published?: boolean;
          slug: string;
          summary: string;
          technologies?: string[];
          texture?: Database['public']['Enums']['planet_texture'];
          type: Database['public']['Enums']['project_type'];
          updated_at?: string;
          year: number;
        };
        Update: {
          client?: string;
          color_accent?: string;
          color_background?: string;
          color_primary?: string;
          created_at?: string;
          description?: string;
          has_ring?: boolean;
          id?: string;
          name?: string;
          position?: number;
          published?: boolean;
          slug?: string;
          summary?: string;
          technologies?: string[];
          texture?: Database['public']['Enums']['planet_texture'];
          type?: Database['public']['Enums']['project_type'];
          updated_at?: string;
          year?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      submit_project_request: {
        Args: {
          p_client_name: string;
          p_consent: boolean;
          p_contact_preference: Database['public']['Enums']['contact_preference'];
          p_deadline: string;
          p_description: string;
          p_email: string;
          p_ip_hash: string;
          p_phone: string;
          p_platform: Database['public']['Enums']['request_platform'];
        };
        Returns: string;
      };
    };
    Enums: {
      contact_preference: 'email' | 'phone';
      planet_texture: 'gas' | 'rocky' | 'earth' | 'ice';
      project_type: 'app' | 'site' | 'system';
      request_platform: 'web' | 'mobile' | 'web_and_mobile';
      request_status: 'new' | 'contacted' | 'closed';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      contact_preference: ['email', 'phone'],
      planet_texture: ['gas', 'rocky', 'earth', 'ice'],
      project_type: ['app', 'site', 'system'],
      request_platform: ['web', 'mobile', 'web_and_mobile'],
      request_status: ['new', 'contacted', 'closed'],
    },
  },
} as const;
