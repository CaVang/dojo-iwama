'use client';

import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-washi px-6">
      <div className="text-center max-w-md">
        <span className="font-jp text-8xl text-japan-blue/10 block mb-6">
          迷
        </span>
        <h1 className="font-serif text-6xl text-japan-blue mb-4">404</h1>
        <h2 className="font-serif text-2xl text-sumi mb-4">Path Not Found</h2>
        <p className="text-sumi-muted mb-8 leading-relaxed">
          Like a student who has lost their way, this page cannot be found.
        </p>
        <Link
          href="/en"
          className="btn-primary inline-flex items-center gap-2"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
