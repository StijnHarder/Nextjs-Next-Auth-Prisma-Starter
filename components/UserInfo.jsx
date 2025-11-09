"use client";

import { useSession, signOut, SessionProvider } from "next-auth/react";

function UserInfoContent() {
    const { data: session, status } = useSession();

    if (status === "loading") return <p>Loading session...</p>;
    if (!session) return <p>You are not logged in.</p>;

    const user = session.user;

    return (
        <div
            style={{
                maxWidth: "600px",
                margin: "20px auto",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "8px",
            }}
        >
            <h2>Welcome, {user.username}!</h2>
            <p>
                <strong>User ID:</strong> {user.id}
            </p>
            <p>
                <strong>Domain URL:</strong> {user.domain_url}
            </p>
            <p>
                <strong>Admin:</strong> {user.admin ? "Yes" : "No"}
            </p>
            <p>
                <strong>API Key Hash:</strong> {user.api_key_hash}
            </p>
            <button
                onClick={() => signOut()}
                style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
            >
                Sign Out
            </button>
        </div>
    );
}

export default function UserInfo() {
    return (
        <SessionProvider>
            <UserInfoContent />
        </SessionProvider>
    );
}
