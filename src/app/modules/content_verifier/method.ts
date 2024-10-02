import { Modules, StateMachine } from 'klayr-sdk';
import { ContentStore, ContentEntry } from './stores/content';
import { StatsStore, ContentStats } from './stores/stats';
import { UserReputationStore } from './stores/user_reputation';

export class ContentVerifierMethod extends Modules.BaseMethod {
    public async getContent(
        methodContext: StateMachine.ImmutableMethodContext,
        hash: string
    ): Promise<ContentEntry | null> {
        const contentStore = this.stores.get(ContentStore);
        try {
            return await contentStore.get(methodContext, Buffer.from(hash));
        } catch (error) {
            return null;
        }
    }

    public async getStats(
        methodContext: StateMachine.ImmutableMethodContext
    ): Promise<ContentStats> {
        const statsStore = this.stores.get(StatsStore);
        try {
            return await statsStore.get(methodContext, Buffer.from('globalStats'));
        } catch (error) {
            return { totalContents: 0, verifiedContents: 0 };
        }
    }

    public async getUserReputation(
        methodContext: StateMachine.ImmutableMethodContext,
        userId: string
    ): Promise<{ reputation: number; totalSubmissions: number; verifiedSubmissions: number }> {
        const userReputationStore = this.stores.get(UserReputationStore);

        try {
            const userReputation = await userReputationStore.get(methodContext, Buffer.from(userId));
            const reputation = userReputation.totalSubmissions > 0 
                ? userReputation.verifiedSubmissions / userReputation.totalSubmissions 
                : 0;

            return {
                reputation,
                totalSubmissions: userReputation.totalSubmissions,
                verifiedSubmissions: userReputation.verifiedSubmissions,
            };
        } catch (error) {
            // User not found or other error
            return {
                reputation: 0,
                totalSubmissions: 0,
                verifiedSubmissions: 0,
            };
        }
    }
}
