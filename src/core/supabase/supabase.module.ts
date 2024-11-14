import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: SupabaseClient,
            useFactory: (configService: ConfigService) => {
                const supabaseUrl = configService.get<string>('SUPABASE_URL');
                const supabaseKey = configService.get<string>('SUPABASE_KEY');
                return createClient(supabaseUrl, supabaseKey);
            },
            inject: [ConfigService],
        },
    ],
    exports: [SupabaseClient],
})
export class SupabaseModule {}