import { feature, mesh } from "topojson-client";
import type { Feature, FeatureCollection, MultiLineString } from "geojson";
import type { Topology } from "topojson-specification";
import land110Raw from "world-atlas/land-110m.json";
import land50Raw from "world-atlas/land-50m.json";
import countries50Raw from "world-atlas/countries-50m.json";

// Données Natural Earth (domaine public) via le paquet npm world-atlas.
/* eslint-disable @typescript-eslint/no-explicit-any */
const land110 = land110Raw as unknown as Topology;
const land50 = land50Raw as unknown as Topology;
const countries50 = countries50Raw as unknown as Topology;

export const LAND_110 = feature(land110, land110.objects.land as any) as unknown as FeatureCollection;
export const LAND_50 = feature(land50, land50.objects.land as any) as unknown as FeatureCollection;
export const COUNTRIES_50 = feature(
  countries50,
  countries50.objects.countries as any,
) as unknown as FeatureCollection;
export const BORDERS_50 = mesh(
  countries50,
  countries50.objects.countries as any,
  (a: any, b: any) => a !== b,
) as MultiLineString;

export const SWITZERLAND = COUNTRIES_50.features.find(
  (f) => (f.properties as { name?: string } | null)?.name === "Switzerland",
) as Feature;
