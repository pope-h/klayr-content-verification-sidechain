/* eslint-disable @typescript-eslint/member-ordering */
import {
    Modules,
    StateMachine,
} from 'klayr-sdk';
import { ContentStore, ContentEntry } from '../stores/content';
import { StatsStore, ContentStats } from '../stores/stats';
import { UserReputationStore, UserReputation } from '../stores/user_reputation';

interface Params {
    hash: string;
}

export const verifyContentSchema = {
    $id: 'contentVerifier/verifyContent',
    type: 'object',
    required: ['hash'],
    properties: {
        hash: {
            dataType: 'string',
            fieldNumber: 1,
        },
    },
};

export class VerifyContentCommand extends Modules.BaseCommand {
    public schema = verifyContentSchema;

    public async verify(context: StateMachine.CommandVerifyContext<Params>): Promise<StateMachine.VerificationResult> {
        const { hash } = context.params;
        const contentStore = this.stores.get(ContentStore);

        try {
            await contentStore.get(context, Buffer.from(hash));
        } catch (error) {
            return {
                status: StateMachine.VerifyStatus.FAIL,
                error: new Error('Content not found'),
            };
        }

        return { status: StateMachine.VerifyStatus.OK };
    }

    public async execute(context: StateMachine.CommandExecuteContext<Params>): Promise<void> {
        const { hash } = context.params;
        
        const contentStore = this.stores.get(ContentStore);
        const statsStore = this.stores.get(StatsStore);
        const userReputationStore = this.stores.get(UserReputationStore);

        // Get the content
        const content: ContentEntry = await contentStore.get(context, Buffer.from(hash));

        // If content is already verified, do nothing
        if (content.verified) {
            return;
        }

        // Update content to verified
        content.verified = true;
        await contentStore.set(context, Buffer.from(hash), content);

        // Update stats
        let stats: ContentStats;
        try {
            stats = await statsStore.get(context, Buffer.from('globalStats'));
        } catch (error) {
            stats = { totalContents: 0, verifiedContents: 0 };
        }
        stats.verifiedContents += 1;
        await statsStore.set(context, Buffer.from('globalStats'), stats);

        // Update user reputation
        let userReputation: UserReputation;
        try {
            userReputation = await userReputationStore.get(context, Buffer.from(content.userId));
        } catch (error) {
            userReputation = { userId: content.userId, totalSubmissions: 0, verifiedSubmissions: 0 };
        }
        userReputation.verifiedSubmissions += 1;
        await userReputationStore.set(context, Buffer.from(content.userId), userReputation);
    }
}