"use client";

export function Footer() {
  return (
    <footer className="py-6 px-4 md:px-6 mt-auto border-t border-white/10 bg-background/50">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Forever Yours. All rights reserved.</p>
        <p className="italic mt-1">
          A declaration of love that lasts forever.
        </p>
      </div>
    </footer>
  );
}
