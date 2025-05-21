"use client";

import { useState } from "react";
import { signUp } from "../../../lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignUp() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const router = useRouter();
	const [loading, setLoading] = useState(false);


	return (
		<div className="z-50 rounded-md rounded-t-none max-w-md">
			<div>
				<h2 className="text-lg md:text-xl">Sign Up</h2>
				<p className="text-xs md:text-sm">
					Enter your information to create an account
				</p>
			</div>
			<div>
				<div className="grid gap-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<label htmlFor="first-name">First name</label>
							<input
								id="first-name"
								placeholder="Max"
								required
								onChange={(e) => {
									setFirstName(e.target.value);
								}}
								value={firstName}
							/>
						</div>
						<div className="grid gap-2">
							<label htmlFor="last-name">Last name</label>
							<input
								id="last-name"
								placeholder="Robinson"
								required
								onChange={(e) => {
									setLastName(e.target.value);
								}}
								value={lastName}
							/>
						</div>
					</div>
					<div className="grid gap-2">
						<label htmlFor="email">Email</label>
						<input
							id="email"
							type="email"
							placeholder="m@example.com"
							required
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							value={email}
						/>
					</div>
					<div className="grid gap-2">
						<label htmlFor="password">Password</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="new-password"
							placeholder="Password"
						/>
					</div>
					<div className="grid gap-2">
						<label htmlFor="password">Confirm Password</label>
						<input
							id="password_confirmation"
							type="password"
							value={passwordConfirmation}
							onChange={(e) => setPasswordConfirmation(e.target.value)}
							autoComplete="new-password"
							placeholder="Confirm Password"
						/>
					</div>
					
					<button
						type="submit"
						className="w-full"
						disabled={loading}
						onClick={async () => {
							await signUp.email({
								email,
								password,
								name: `${firstName} ${lastName}`,
								callbackURL: "/dashboard",
								fetchOptions: {
									onResponse: () => {
										setLoading(false);
									},
									onRequest: () => {
										setLoading(true);
									},
									onError: (ctx) => {
										console.error(ctx.error.message);
									},
									onSuccess: async () => {
										router.push("/dashboard");
									},
								},
							});
						}}
					>
						{loading ? (
							<p>Loading...</p>
						) : (
							"Create an account"
						)}
					</button>
				</div>
			</div>
			<div>
				<div className="flex justify-center w-full border-t py-4">
					<p className="text-center text-xs text-neutral-500">
						Secured by <span className="text-orange-400">better-auth.</span>
					</p>
				</div>
			</div>
		</div>
	);
}
