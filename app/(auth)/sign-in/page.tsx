"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import LoadingButton from '@/components/loading-button';

import Link from 'next/link';

import { signInSchema } from '@/lib/zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { authClient } from '@/auth-client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ErrorContext } from '@better-fetch/fetch';

export default function SignIn() {
    const [pendingCredentials, setPendingCredentials] = useState(false);
    const [pendingGoogle, setPendingGoogle] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

    const handleCredentialSignIn = async (values: z.infer<typeof signInSchema>) => {
        await authClient.signIn.email(
			{
				email: values.email,
				password: values.password,
			},
			{
				onRequest: () => {
					setPendingCredentials(true);
				},
				onSuccess: () => {
                    console.log('hi');
                    router.push("/game-form");
                    router.refresh();
				},
				onError: (ctx: ErrorContext) => {
					console.log("error", ctx);
					toast("Something went wrong",{
						description: ctx.error.message ?? "Something went wrong.",
					});
				},
			}
		);
		setPendingCredentials(false);
    }

    const handleSignInWithGoogle = async () => {
        await authClient.signIn.social(
            {
                provider: "google",
            },
            {
                onRequest: () => {
                    setPendingGoogle(true);
                },
                onSuccess: async () => {
                    router.push("/game-form");
                    router.refresh();
                },
                onError: (ctx: ErrorContext) => {
                    toast("Something went wrong", {
                        description: ctx.error.message ?? "Something went wrong.",
                    });
                },
            }
        );
        setPendingGoogle(false);
    }

    return (
        <div className='grow flex justify-center items-center p-4'>
            <Card className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle className='text-3xl font-bold text-center text-gray-800'>Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCredentialSignIn)} className='space-y-6'>
                            {['email', 'password'].map((field) => (
                                <FormField
                                    control={form.control}
                                    key={field}
                                    name={field as keyof z.infer<typeof signInSchema>}
                                    render={({ field: fieldProps }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {field.charAt(0).toUpperCase() + field.slice(1)}
                                            </FormLabel>
                                            <FormControl>
                                                <Input type={
                                                    field.includes("password")
                                                    ? "password"
                                                    : "email"
                                                } 
                                                placeholder={`Enter your ${field}`}
                                                {...fieldProps}
                                                autoComplete={
                                                    field === "password" ? "current-password" : "email"
                                                }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                            <LoadingButton pending={pendingCredentials}>Sign In</LoadingButton>
                        </form>
                    </Form>
                    <div className='mt-4'>
                        <LoadingButton
                            pending={pendingGoogle}
                            onClick={handleSignInWithGoogle}
                        >

                            Continue with Google
                        </LoadingButton>
                    </div>
                    <div className='mt-4 text-center text-sm'>
                        <Link href='/forgot-password' className='text-primary hover:underline'>
                            Forgot password?
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}