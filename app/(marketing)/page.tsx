import { Medal} from "lucide-react";
import Link from 'next/link';
import React from 'react';
import {Poppins} from "next/font/google";
import {cn} from "@/lib/utils"

export const runtime="edge";

const headingFont=Poppins({
    subsets:["latin"],
    weight:[
        "100",
        "200",
        "300",
        "400",
        "500",
        "600",
        "700",
        "800",
        "900"
    ],
});

const MarketingPage = () => {
    return (
        <div className={cn("flex items-center justify-center flex-col", headingFont.className,)}>
            <div className="flex items-center justify-center flex-col">
                <div className="mb-4 flex items-center md:max-w-fit 
                 border shadow-sm p-4 bg-amber-100 text-amber-700 rounded-full uppercase">
                    <Medal className="h-6 w-6 mr-2" />
                    No 1 task management
                </div>
                <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6">
                    Task-Buddy helps teams move
                </h1>
                <div className="text-white text-3xl md:text-6xl bg-gradient-to-r from-fuchsia-600 to-pink-600 px-4 p-2 rounded-md w-fit">
                    Work forward.
                </div>
                <div className="text-sm md:text-xl text-neutral-400 mt-4
                max-w-xs md:max-w-2xl text-center mx-auto">
                    Collaborate, manage projects, and reach new productivity peaks.
                     From high rises to the home office, the way your team works is unique - 
                     accomplish it all with Task-Buddy!
                </div>
                <div className="mt-6 w-fit">
                    <Link href="/sign-up" passHref>
                        <button className="px-8 py-4 font-bold text-white bg-black rounded-lg shadow-md hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                            Get Task-Buddy for free
                        </button>
                    </Link>
    </div>
            </div>
        </div>
    );
};

export default MarketingPage;
