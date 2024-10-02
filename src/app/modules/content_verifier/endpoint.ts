import { Modules, Types } from 'klayr-sdk';
import { ContentStore, ContentEntry } from './stores/content';
import { StatsStore, ContentStats } from './stores/stats';
import { UserReputationStore } from './stores/user_reputation';

export class ContentVerifierEndpoint extends Modules.BaseEndpoint {
    public async getContent(ctx: Types.ModuleEndpointContext): Promise<ContentEntry | null> {
        const { hash } = ctx.params;
        const contentStore = this.stores.get(ContentStore);
        
        try {
            return await contentStore.get(ctx, Buffer.from(hash as string));
        } catch (error) {
            return null;
        }
    }

    public async getStats(ctx: Types.ModuleEndpointContext): Promise<ContentStats> {
        const statsStore = this.stores.get(StatsStore);
        
        try {
            return await statsStore.get(ctx, Buffer.from('globalStats'));
        } catch (error) {
            return { totalContents: 0, verifiedContents: 0 };
        }
    }

    public async getReputation(ctx: Types.ModuleEndpointContext): Promise<{ userId: string; reputation: number; totalSubmissions: number; verifiedSubmissions: number }> {
        const { userId } = ctx.params as { userId: string };
        const userReputationStore = this.stores.get(UserReputationStore);
    
        try {
            const userReputation = await userReputationStore.get(ctx, Buffer.from(userId));
            const reputation = userReputation.totalSubmissions > 0 
                ? userReputation.verifiedSubmissions / userReputation.totalSubmissions 
                : 0;
    
            return {
                userId,
                reputation,
                totalSubmissions: userReputation.totalSubmissions,
                verifiedSubmissions: userReputation.verifiedSubmissions,
            };
        } catch (error) {
            return {
                userId,
                reputation: 0,
                totalSubmissions: 0,
                verifiedSubmissions: 0,
            };
        }
    }

    // public async verifyContent(ctx: Types.ModuleEndpointContext): Promise<{ success: boolean }> {
    //     const { hash } = ctx.params;
    //     const contentStore = this.stores.get(ContentStore);
    //     const statsStore = this.stores.get(StatsStore);

    //     const content = await contentStore.get(ctx, Buffer.from(hash as string)).catch(() => null);
    //     if (!content) return { success: false };

    //     content.verified = true;
    //     await contentStore.set(ctx, Buffer.from(hash as string), content);

    //     const stats = await statsStore.get(ctx, Buffer.from('globalStats')).catch(() => ({ totalContents: 0, verifiedContents: 0 }));
    //     stats.verifiedContents += 1;
    //     await statsStore.set(ctx, Buffer.from('globalStats'), stats);

    //     return { success: true };
    // }
}
