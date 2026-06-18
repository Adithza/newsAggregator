// app/actions/checkIframe.ts

"use server";

export async function checkIframe(url: string) {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
    });

    const xfo = response.headers.get("x-frame-options");
    const csp = response.headers.get("content-security-policy");

    return {
      xfo,
      csp,
    };
  } catch {
    return {
      xfo: null,
      csp: null,
    };
  }
}