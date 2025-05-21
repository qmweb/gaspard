"use client"
import { signIn } from "../../../lib/auth-client";
import { useState } from "react";

import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  

  return (
    <div className="max-w-md">
      <div>
        <h2 className="text-lg md:text-xl">Sign In</h2>
        <p className="text-xs md:text-sm">
          Enter your email below to login to your account
        </p>
      </div>
      <div>
        <div className="grid gap-4">
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
              <div className="flex items-center">
                <label htmlFor="password">Password</label>
                
              </div>

              <input
                id="password"
                type="password"
                placeholder="password"
                autoComplete="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            

          

          <button
              type="submit"
              className="w-full"
              disabled={loading}
              onClick={async () => {
                await signIn.email(
                {
                    email,
                    password
                },
                {
                  onRequest: (ctx) => {
                    setLoading(true);
                  },
                  onResponse: (ctx) => {
                    setLoading(false);
                  },
                },
                );
              }}
            >
              {loading ? (
                <p>Chargement...</p>
              ) : (
                <p> Login </p>
              )}
              </button>

          

          
        </div>
      </div>
      
    </div>
  );
}