import {Outlet} from "react-router-dom";
import React from "react";

interface PageProps {
    title: string;
    withOutlet?: boolean;
}

export function Page({title, withOutlet: hasOutlet = false, children}: React.PropsWithChildren<PageProps>) {
    return (
        <>
            <h1>{title}</h1>
            {children}
            {hasOutlet ? <Outlet/> : undefined}
        </>
    );
}