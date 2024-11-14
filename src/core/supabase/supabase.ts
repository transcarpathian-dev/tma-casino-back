import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ExtractJwt } from 'passport-jwt';

@Injectable({ scope: Scope.REQUEST })
export class Supabase {
    private readonly logger = new Logger(Supabase.name);
    private clientInstance: SupabaseClient | null = null;

    constructor(
        @Inject(REQUEST) private readonly request: Request,
        private readonly configService: ConfigService,
    ) {}

    getClient(): SupabaseClient {
        const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
        const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

        this.clientInstance = createClient(supabaseUrl, supabaseKey, {
            auth: {
                autoRefreshToken: true,
                detectSessionInUrl: false,
            },
        });

        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(this.request);

        if (token) {
            this.clientInstance.auth.setSession({
                access_token: token,
                refresh_token: token,
            }).then(({ data, error }) => {
                if (error) {
                    this.logger.error('Failed to set session:', error.message);
                } else {
                    this.logger.log('Session has been set successfully');
                }
            });
        } else {
            this.logger.warn('No Bearer token found in request');
        }

        return this.clientInstance;
    }
}
