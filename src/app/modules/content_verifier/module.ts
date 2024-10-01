/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/member-ordering */
import {
    Modules
} from 'klayr-sdk';
import { CreateContentCommand } from "./commands/create_content_command";
import { ContentVerifierEndpoint } from './endpoint';
import { ContentVerifierMethod } from './method';
import { ContentStore } from './stores/content';
import { StatsStore } from './stores/stats';

export class ContentVerifierModule extends Modules.BaseModule {
	public projectName = 'contentVerifier';
    public id = 1000;
    public endpoint = new ContentVerifierEndpoint(this.stores, this.offchainStores);
    public method = new ContentVerifierMethod(this.stores, this.events);
    public commands = [new CreateContentCommand(this.stores, this.events)];

    private maxContentLength: number;
    private minReputationForVerification: number;

	public constructor() {
        super();
        this.stores.register(ContentStore, new ContentStore(this.name, 0));
        this.stores.register(StatsStore, new StatsStore(this.name, 1));
        this.maxContentLength = 1000;
        this.minReputationForVerification = 0.5;
    }

	// public constructor() {
	// 	super();
	// 	// registeration of stores and events
	// }

	public metadata(): Modules.ModuleMetadata {
        return {
            ...this.baseMetadata(),
            endpoints: [
                {
                    name: 'submitContent',
                    request: this.getSubmitContentSchema(),
                    response: this.getSubmitContentResponseSchema(),
                },
                {
                    name: 'verifyContent',
                    request: this.getVerifyContentSchema(),
                    response: this.getVerifyContentResponseSchema(),
                },
                {
                    name: 'getReputation',
                    request: this.getReputationSchema(),
                    response: this.getReputationResponseSchema(),
                },
            ],
            assets: [],
        };
    }

	private getSubmitContentSchema() {
        return {
            $id: '/contentVerifier/submitContent',
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
    }

	private getSubmitContentResponseSchema() {
        return {
            $id: '/contentVerifier/submitContentResponse',
            type: 'object',
            required: ['success'],
            properties: {
                success: {
                    dataType: 'boolean',
                    fieldNumber: 1,
                },
            },
        };
    }

	private getVerifyContentSchema() {
        return {
            $id: '/contentVerifier/verifyContent',
            type: 'object',
            required: ['hash'],
            properties: {
                hash: {
                    dataType: 'string',
                    fieldNumber: 1,
                },
            },
        };
    }

    private getVerifyContentResponseSchema() {
        return {
            $id: '/contentVerifier/verifyContentResponse',
            type: 'object',
            required: ['success', 'verified'],
            properties: {
                success: {
                    dataType: 'boolean',
                    fieldNumber: 1,
                },
                verified: {
                    dataType: 'boolean',
                    fieldNumber: 2,
                },
            },
        };
    }

    private getReputationSchema() {
        return {
            $id: '/contentVerifier/getReputation',
            type: 'object',
            required: ['userId'],
            properties: {
                userId: {
                    dataType: 'string',
                    fieldNumber: 1,
                },
            },
        };
    }

    private getReputationResponseSchema() {
        return {
            $id: '/contentVerifier/getReputationResponse',
            type: 'object',
            required: ['userId', 'reputation', 'totalSubmissions', 'verifiedSubmissions'],
            properties: {
                userId: {
                    dataType: 'string',
                    fieldNumber: 1,
                },
                reputation: {
                    dataType: 'float',
                    fieldNumber: 2,
                },
                totalSubmissions: {
                    dataType: 'uint32',
                    fieldNumber: 3,
                },
                verifiedSubmissions: {
                    dataType: 'uint32',
                    fieldNumber: 4,
                },
            },
        };
    }

    // Lifecycle hooks
    // eslint-disable-next-line @typescript-eslint/require-await
    public async init(args: Modules.ModuleInitArgs): Promise<void> {
        const { moduleConfig }: { moduleConfig?: { maxContentLength?: number; minReputationForVerification?: number } } = args;
    
        if (moduleConfig) {
            this.maxContentLength = moduleConfig.maxContentLength ?? this.maxContentLength;
            this.minReputationForVerification = moduleConfig.minReputationForVerification ?? this.minReputationForVerification;
        }
    
        // Other initialization logic...
    }

	// public async insertAssets(_context: StateMachine.InsertAssetContext) {
	// 	// initialize block generation, add asset
	// }

	// public async verifyAssets(_context: StateMachine.BlockVerifyContext): Promise<void> {
	// 	// verify block
	// }

    // Lifecycle hooks
	// public async verifyTransaction(_context: StateMachine.TransactionVerifyContext): Promise<StateMachine.VerificationResult> {
		// verify transaction will be called multiple times in the transaction pool
		// return { status: StateMachine.VerifyStatus.OK };
	// }

	// public async beforeCommandExecute(_context: StateMachine.TransactionExecuteContext): Promise<void> {
	// }

	// public async afterCommandExecute(_context: StateMachine.TransactionExecuteContext): Promise<void> {

	// }
	// public async initGenesisState(_context: StateMachine.GenesisBlockExecuteContext): Promise<void> {

	// }

	// public async finalizeGenesisState(_context: StateMachine.GenesisBlockExecuteContext): Promise<void> {

	// }

	// public async beforeTransactionsExecute(_context: StateMachine.BlockExecuteContext): Promise<void> {

	// }

	// public async afterTransactionsExecute(_context: StateMachine.BlockAfterExecuteContext): Promise<void> {

	// }
}