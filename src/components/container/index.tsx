'use client'
export default function Container({children,}: {children: React.ReactNode}) {
    return (
        <section className="relative flex flex-col items-center gap-6 w-full mx-auto md:gap-0 md:flex-row md:max-w-6xl">
            {children}
        </section>
    );
}