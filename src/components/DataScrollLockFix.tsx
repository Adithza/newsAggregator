"use client"

import { useEffect } from "react";


export function DataScrollLockFix() {


useEffect(() => {

    console.log("test gffgd")

    const observer = new MutationObserver(() => {
        document.body.removeAttribute("data-scroll-locked");
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["data-scroll-locked"],
    });
}, [])

    return <></>
}