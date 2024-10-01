import { Modules } from 'klayr-sdk';

export interface ContentEntry {
    userId: string;
    timestamp: number;
    verified: boolean;
}

export const ContentEntrySchema = {
        $id: '/contentVerifier/content',
        type: 'object',
        required: ['userId', 'timestamp', 'verified'],
        properties: {
            userId: {
                dataType: 'string',
                fieldNumber: 1,
            },
            timestamp: {
                dataType: 'uint32',
                fieldNumber: 2,
            },
            verified: {
                dataType: 'boolean',
                fieldNumber: 3,
            },
        },
    };

export class ContentStore extends Modules.BaseStore<ContentEntry> {
    public schema = ContentEntrySchema;
}