/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable class-methods-use-this */
import {
	Modules,
	StateMachine,
} from 'klayr-sdk';
import { ContentStore, ContentEntry } from '../stores/content';
import { StatsStore, ContentStats } from '../stores/stats';
import { UserReputationStore, UserReputation } from '../stores/user_reputation';

interface Params {
    hash: string;
    userId: string;
    timestamp: number;
}

export const createContentSchema = {
		$id: 'contentVerifier/createContent',
    	type: 'object',
    	required: ['hash', 'userId', 'timestamp'],
    	properties: {
        	hash: {
            	dataType: 'string',
            	fieldNumber: 1,
        	},
        	userId: {
            	dataType: 'string',
            	fieldNumber: 2,
        	},
        	timestamp: {
            	dataType: 'uint32',
            	fieldNumber: 3,
        	},
    	},
	};

export class CreateContentCommand extends Modules.BaseCommand {
	public schema = createContentSchema;

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(_context: StateMachine.CommandVerifyContext<Params>): Promise<StateMachine.VerificationResult> {
		return { status: StateMachine.VerifyStatus.OK };
	}

	public async execute(context: StateMachine.CommandExecuteContext<Params>): Promise<void> {
		const { hash, userId, timestamp } = context.params;
        
        const contentStore = this.stores.get(ContentStore);
        const statsStore = this.stores.get(StatsStore);
		const userReputationStore = this.stores.get(UserReputationStore);

        // Create new content entry
        const newContent: ContentEntry = {
            userId,
            timestamp,
            verified: false,
        };

        // Save content
		await contentStore.set(context, Buffer.from(hash), newContent);

		// Update stats
		let stats: ContentStats;
        try {
            stats = await statsStore.get(context, Buffer.from('globalStats'));
        } catch (error) {
            stats = { totalContents: 0, verifiedContents: 0 };
        }
        stats.totalContents += 1;
        await statsStore.set(context, Buffer.from('globalStats'), stats);

        // Update user reputation
        let userReputation: UserReputation;
        try {
            userReputation = await userReputationStore.get(context, Buffer.from(userId));
        } catch (error) {
            userReputation = { userId, totalSubmissions: 0, verifiedSubmissions: 0 };
        }
        userReputation.totalSubmissions += 1;
        await userReputationStore.set(context, Buffer.from(userId), userReputation);
	}
}