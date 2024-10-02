import { Modules } from 'klayr-sdk';

export interface UserReputation {
    userId: string;
    totalSubmissions: number;
    verifiedSubmissions: number;
}

export const UserReputationSchema = {
    $id: '/contentVerifier/userReputation',
    type: 'object',
    required: ['userId', 'totalSubmissions', 'verifiedSubmissions'],
    properties: {
        userId: {
            dataType: 'string',
            fieldNumber: 1,
        },
        totalSubmissions: {
            dataType: 'uint32',
            fieldNumber: 2,
        },
        verifiedSubmissions: {
            dataType: 'uint32',
            fieldNumber: 3,
        },
    },
};

export class UserReputationStore extends Modules.BaseStore<UserReputation> {
    public schema = UserReputationSchema;
}