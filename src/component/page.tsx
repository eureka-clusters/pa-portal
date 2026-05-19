import {PropsWithChildren, ReactNode} from "react";
import {Outlet} from "react-router-dom";

interface PageProps extends PropsWithChildren {
    withOutlet?: boolean;
}

export function Page({
                         withOutlet: hasOutlet = false,
                         children,
                     }: PageProps) {
    return (
        <section className="py-2">
            {children}
            {hasOutlet ? <Outlet/> : null}
        </section>
    );
}
