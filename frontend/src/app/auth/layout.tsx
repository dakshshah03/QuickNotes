'use client';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from "next/navigation";

export default function AuthLayout({children} : {
    children: React.ReactNode,}) {
    return (
        <div className="
            flex
            items-center
            justify-center
            min-h-screen
            bg-linear-to-t from-[#015a70] to-[#53003f]
        ">
            {children}
        </div>
    );
}