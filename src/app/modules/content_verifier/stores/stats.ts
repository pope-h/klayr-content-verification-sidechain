import { Modules } from 'klayr-sdk';

export interface ContentStats {
    totalContents: number;
    verifiedContents: number;
}

export const ContentStatsSchema = {
        $id: '/contentVerifier/contentStats',
        type: 'object',
        required: ['totalContents', 'verifiedContents'],
        properties: {
            totalContents: {
                dataType: 'uint32',
                fieldNumber: 1,
            },
            verifiedContents: {
                dataType: 'uint32',
                fieldNumber: 2,
            },
        },
    };

export class StatsStore extends Modules.BaseStore<ContentStats> {
    public schema = ContentStatsSchema;
}