import Image from "next/image";
import Link from "next/link";
import { getAllCreatures } from "@/lib/creatures";

export default function HomePage() {
  const creatures = getAllCreatures();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-bold tracking-tight">Pokeyama Collection</h1>
      <p className="mt-2 text-slate-400">
        {creatures.length} Yamas discovered so far. Click one to see its full
        entry.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
        {creatures.map((creature) => (
          <Link
            key={creature.slug}
            href={`/pokeyama/${creature.slug}`}
            className="group rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition hover:border-slate-400 hover:bg-slate-800"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-900">
              <Image
                src={creature.image}
                alt={creature.name}
                fill
                className="object-contain p-2"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </div>
            <p className="mt-3 text-xs text-slate-500">#{creature.number}</p>
            <p className="font-semibold group-hover:text-white">
              {creature.name}
            </p>
            <p className="text-xs text-slate-400">{creature.type}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
