"use client";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main className="app-shell app-empty"><h1>Something went wrong</h1><p>We couldn’t complete that request. Please try again.</p><button className="app-button" onClick={reset}>Try again</button></main>; }
