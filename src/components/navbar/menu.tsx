import Link from "next/link";

export default function MenuNavbar() {
  return (
    <ul className="flex flex-col md:flex-row md:space-x-8">
      <li>
        <Link href="/search" className="block py-2 px-3 rounded-sm hover:bg-gray-100">
          encontrar destinos
        </Link>
      </li>
      <li>
        <Link href="/trips" className="block py-2 px-3 rounded-sm hover:bg-gray-100">
          roteiros
        </Link>
      </li>
    </ul>
  );
}
