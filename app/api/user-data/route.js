import { getToken } from "next-auth/jwt";

export async function GET(req) {
  // getToken expects the Request object from the App Router
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true });

  // console.log(token);

  const res = await fetch("http://127.0.0.1:8000/api/home", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  return new Response(JSON.stringify(data));
}
