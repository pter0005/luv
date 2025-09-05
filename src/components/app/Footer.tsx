"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="py-10 md:pt-20 border-t border-t-neutral-800 bg-black">
      <div className="container flex flex-col md:flex-row justify-between">
        <div className="w-full md:w-1/3">
          <Link href="/">
             <Image src="https://storage.googleapis.com/app-prototyping-public-artifacts/logo-name.webp" alt="Heartzzu logo" width={140} height={40}/>
          </Link>
          <p className="text-sm text-neutral-300 mt-4">
            A Heartzzu é uma plataforma que permite criar páginas
            personalizadas para pessoas especiais.
          </p>
        </div>
        <div className="w-full md:w-1/3 md:flex md:justify-end mt-4 md:mt-0">
          <ul className="text-sm text-neutral-300 mt-4">
            <li className="py-1">
              <Link href="#">Termos de uso</Link>
            </li>
            <li className="py-1">
              <Link href="#">Política de privacidade</Link>
            </li>
          </ul>
        </div>
        <div className="w-full md:w-1/3 md:flex md:justify-end mt-4 md:mt-0 pr-10">
          <ul className="text-sm text-neutral-300 mt-4">
            <li className="py-1">
              <Link href="#">Instagram</Link>
            </li>
            <li className="py-1">
              <Link href="#">TikTok</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container flex flex-col-reverse md:flex-row items-center justify-between mt-12 md:mt-8 gap-2">
        <p className="text-sm text-neutral-500">
          Copyright © {new Date().getFullYear()} - Heartzzu.com
        </p>
        <Image src="https://storage.googleapis.com/app-prototyping-public-artifacts/pagarme-extend.webp" alt="pagarme logo" height={24} width={150} />
      </div>
    </footer>
  );
}
