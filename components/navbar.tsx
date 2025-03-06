"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import SignoutButton from "./signout-button";
import { Session } from "@/auth";

export default function Navbar({ session }: { session: Session | null }) {
  return (
    <nav
      className="flex justify-between items-center py-3 px-4 fixed top-0
left-0 right-0 z-50 bg-slate-100"
    >
      <Link href="/" className="text-xl font-bold">
        AI TT Scorer
      </Link>
      <div className="flex gap-2">
        {!session ? (
          <div className="flex gap-2 justify-center">
            <Link href="/sign-in">
              <Button variant="default">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="default">Sign Up</Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center">
            <SignoutButton />
          </div>
        )}

        {/* <Link href="/scorer" className="hover:text-blue-500">
          <Button>Live Scorer</Button>
        </Link>
        <Link href="/video-analysis" className="hover:text-blue-500">
          <Button>Video Analysis</Button>
        </Link> */}
      </div>
    </nav>
  );
}
