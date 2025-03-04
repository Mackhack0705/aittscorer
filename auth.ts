import { betterAuth, BetterAuthOptions } from 'better-auth';
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from '@/lib/prisma';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mongodb",
    }),
    // secret: process.env.BETTER_AUTH_SECRET,
    // baseURL: process.env.BETTER_AUTH_URL,
} satisfies BetterAuthOptions);