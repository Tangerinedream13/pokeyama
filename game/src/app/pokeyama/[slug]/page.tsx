import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCreatures, getCreatureBySlug } from "@/lib/creatures";

export function generateStaticParams() {
  return getAllCreatures().map((creature) => ({ slug: creature.slug }));
}

export default async function CreaturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const creature = getCreatureBySlug(slug);
  if (!creature) notFound();

  const stats = [
    ["HP", creature.stats.hp],
    ["Attack", creature.stats.attack],
    ["Defense", creature.stats.defense],
    ["Magic", creature.stats.magic],
    ["Speed", creature.stats.speed],
    ["Luck", creature.stats.luck],
  ] as const;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm text-slate-400 hover:text-white">
        ← Back to Collection
      </Link>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-xl bg-slate-800">
          <Image
            src={creature.image}
            alt={creature.name}
            fill
            className="object-contain p-4"
          />
        </div>
        <div>
          <p className="text-sm text-slate-500">
            #{creature.number} &middot; {creature.rarity}
          </p>
          <h1 className="text-3xl font-bold">{creature.name}</h1>
          <p className="text-slate-400">{creature.subtitle}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-slate-700 px-3 py-1">
              {creature.type}
            </span>
            <span className="rounded-full bg-slate-700 px-3 py-1">
              {creature.habitat}
            </span>
            <span className="rounded-full bg-slate-700 px-3 py-1">
              {creature.temperament}
            </span>
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Story</h2>
        <p className="mt-2 text-slate-300">{creature.description}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Battle Moves</h2>
        <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-slate-300 sm:grid-cols-3">
          {creature.battleMoves.map((move) => (
            <li key={move}>{move}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">
          Signature Move: {creature.signatureMoveName}
        </h2>
        <p className="mt-2 text-slate-300">
          {creature.signatureMoveDescription}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Stats</h2>
        <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {stats.map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg bg-slate-800 p-3 text-center"
            >
              <p className="text-xs text-slate-400">{label}</p>
              <p className="text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Evolution</h2>
        <p className="mt-2 text-slate-300">
          Previous: {creature.evolutionPrevious} &middot; Next:{" "}
          {creature.evolutionNext}
        </p>
      </section>
    </main>
  );
}
