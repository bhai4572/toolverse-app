'use client';

import React from 'react';
import Link from 'next/link';
import { getPhoneBySlug, getAllPhones } from '@/lib/phones/database';
import { Breadcrumb } from '@/components/Breadcrumb';
import { UnderCtaAdBand } from '@/components/ads/UnderCtaAdBand';
import {
  Smartphone,
  Cpu,
  Camera,
  BatteryCharging,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Scale,
} from 'lucide-react';

interface PhoneDetailPageProps {
  slug: string;
}

export default function PhoneDetailPage({ slug }: PhoneDetailPageProps) {
  const phone = getPhoneBySlug(slug);
  const allPhones = getAllPhones();

  if (!phone) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold">Mobile Phone Model Not Found</h1>
        <p className="text-sm text-slate-500">
          The requested smartphone specification sheet could not be located in the directory.
        </p>
        <Link
          href="/phones"
          className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
        >
          Browse All Mobile Phones
        </Link>
      </div>
    );
  }

  const alternatives = phone.alternativeSlugs
    .map((s) => allPhones.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const specSections: { title: string; rows: [string, string][] }[] = [
    {
      title: '1. Network',
      rows: [
        ['Technology', phone.specs.network.technology],
        ['2G Bands', phone.specs.network.bands2g],
        ['3G Bands', phone.specs.network.bands3g],
        ['4G Bands', phone.specs.network.bands4g],
        ['5G Bands', phone.specs.network.bands5g],
        ['Speed', phone.specs.network.speed],
      ],
    },
    {
      title: '2. Launch & Status',
      rows: [
        ['Announced', phone.specs.launch.announced],
        ['Availability Status', phone.specs.launch.status],
        ['Pakistan PTA Status', phone.ptaStatus],
      ],
    },
    {
      title: '3. Body & Build',
      rows: [
        ['Dimensions', phone.specs.body.dimensions],
        ['Weight', phone.specs.body.weight],
        ['Materials / Build', phone.specs.body.build],
        ['SIM Slot', phone.specs.body.sim],
        ['Durability / Protection', phone.specs.body.protection],
      ],
    },
    {
      title: '4. Display',
      rows: [
        ['Panel Type', phone.specs.display.type],
        ['Screen Size', phone.specs.display.size],
        ['Resolution', phone.specs.display.resolution],
        ['Refresh Rate', `${phone.specs.display.refreshRateHz} Hz`],
        ['Glass Protection', phone.specs.display.protection],
      ],
    },
    {
      title: '5. Platform & Performance',
      rows: [
        ['Operating System', phone.specs.platform.os],
        ['Chipset / SoC', phone.specs.platform.chipset],
        ['CPU', phone.specs.platform.cpu],
        ['GPU', phone.specs.platform.gpu],
      ],
    },
    {
      title: '6. Memory & Storage',
      rows: [
        ['Card Slot', phone.specs.memory.cardSlot],
        ['Internal Configurations', phone.specs.memory.internal],
      ],
    },
    {
      title: '7. Main Camera',
      rows: [
        ['Modules', phone.specs.mainCamera.modules],
        ['Features', phone.specs.mainCamera.features],
        ['Video Recording', phone.specs.mainCamera.video],
      ],
    },
    {
      title: '8. Selfie Camera',
      rows: [
        ['Sensor', phone.specs.selfieCamera.modules],
        ['Features', phone.specs.selfieCamera.features],
        ['Video Recording', phone.specs.selfieCamera.video],
      ],
    },
    {
      title: '9. Sound & Audio',
      rows: [
        ['Loudspeaker', phone.specs.sound.loudspeaker],
        ['3.5mm Headphone Jack', phone.specs.sound.jack35mm],
      ],
    },
    {
      title: '10. Communications & Connectivity',
      rows: [
        ['WLAN / Wi-Fi', phone.specs.comms.wlan],
        ['Bluetooth', phone.specs.comms.bluetooth],
        ['GPS & Positioning', phone.specs.comms.positioning],
        ['NFC', phone.specs.comms.nfcNotes],
        ['Infrared Port', phone.specs.comms.infrared ? 'Yes' : 'No'],
        ['FM Radio', phone.specs.comms.radio],
        ['USB Port', phone.specs.comms.usb],
      ],
    },
    {
      title: '11. Features & Sensors',
      rows: [['Sensors', phone.specs.features.sensors]],
    },
    {
      title: '12. Battery & Charging',
      rows: [
        ['Battery Type & Capacity', `${phone.specs.battery.type} (${phone.specs.battery.capacityMah} mAh)`],
        ['Charging Support', phone.specs.battery.charging],
      ],
    },
    {
      title: '13. Misc & Pricing',
      rows: [
        ['Available Colors', phone.specs.misc.colors],
        ['Model Variants', phone.specs.misc.models],
        ['Price in Pakistan', phone.pricePkr ? `PKR ${phone.pricePkr.toLocaleString()}` : 'TBA'],
        ['Global Retail Price', phone.priceUsd ? `$${phone.priceUsd} USD` : 'TBA'],
      ],
    },
  ];

  // Valid Schema.org JSON-LD (Product + BreadcrumbList + FAQPage — strictly no fabricated reviews)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://toolverse.baby/' },
          { '@type': 'ListItem', position: 2, name: 'Mobile Phones', item: 'https://toolverse.baby/phones' },
          {
            '@type': 'ListItem',
            position: 3,
            name: phone.brandName,
            item: `https://toolverse.baby/phones/brand/${phone.brandSlug}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: phone.fullName,
            item: phone.seo.canonicalUrl,
          },
        ],
      },
      {
        '@type': 'Product',
        name: phone.fullName,
        brand: { '@type': 'Brand', name: phone.brandName },
        description: phone.originalSummary,
        url: phone.seo.canonicalUrl,
        ...(phone.pricePkr || phone.priceUsd
          ? {
              offers: {
                '@type': 'Offer',
                priceCurrency: phone.pricePkr ? 'PKR' : 'USD',
                price: phone.pricePkr || phone.priceUsd,
                availability:
                  phone.releaseStatus === 'Available'
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/PreOrder',
              },
            }
          : {}),
      },
      {
        '@type': 'FAQPage',
        mainEntity: phone.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb
        items={[
          { label: 'Mobile Phones', href: '/phones' },
          { label: phone.brandName, href: `/phones/brand/${phone.brandSlug}` },
          { label: phone.fullName },
        ]}
      />

      {/* Hero Header Card */}
      <header className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <img
            src={phone.thumbUrl}
            alt={phone.fullName}
            className="w-36 h-44 object-contain rounded-2xl bg-slate-100 dark:bg-slate-800 p-2 shrink-0"
          />

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Link
                href={`/phones/brand/${phone.brandSlug}`}
                className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold"
              >
                {phone.brandName}
              </Link>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold">
                {phone.releaseStatus} ({phone.releaseYear})
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold">
                {phone.ptaStatus}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {phone.fullName} — Specifications &amp; Price in Pakistan
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {phone.originalSummary}
            </p>

            {/* Dual Price Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              {phone.pricePkr && (
                <div className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-300 block font-semibold">
                    Expected / Retail Price (Pakistan)
                  </span>
                  <span className="text-lg font-black text-emerald-800 dark:text-emerald-200">
                    PKR {phone.pricePkr.toLocaleString()}
                  </span>
                </div>
              )}
              {phone.priceUsd && (
                <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 block font-semibold">Global Launch Price</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    ${phone.priceUsd} USD
                  </span>
                </div>
              )}
              <Link
                href="/phones/compare"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition"
              >
                <Scale className="w-4 h-4" />
                <span>Compare With Other Phones</span>
              </Link>
            </div>
          </div>
        </div>

        {/* At-a-Glance Highlights */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <Smartphone className="w-4 h-4 text-sky-500 mb-1" />
            <div className="text-slate-400">Display</div>
            <div className="font-bold">{phone.specs.display.size} • {phone.specs.display.refreshRateHz}Hz</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <Cpu className="w-4 h-4 text-indigo-500 mb-1" />
            <div className="text-slate-400">Chipset</div>
            <div className="font-bold line-clamp-1">{phone.specs.platform.chipset}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <HardDrive className="w-4 h-4 text-purple-500 mb-1" />
            <div className="text-slate-400">RAM / Storage</div>
            <div className="font-bold">Up to {phone.specs.memory.maxRamGb}GB / {phone.specs.memory.maxStorageGb}GB</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <Camera className="w-4 h-4 text-rose-500 mb-1" />
            <div className="text-slate-400">Main Camera</div>
            <div className="font-bold">{phone.specs.mainCamera.primaryMp} MP</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <BatteryCharging className="w-4 h-4 text-emerald-500 mb-1" />
            <div className="text-slate-400">Battery</div>
            <div className="font-bold">{phone.specs.battery.capacityMah} mAh</div>
          </div>
        </div>
      </header>

      {/* Variant Price Matrix */}
      {phone.variants.length > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <h2 className="text-base font-extrabold mb-3">
            {phone.fullName} Storage Variants &amp; Price List
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {phone.variants.map((v, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <span className="font-bold text-slate-900 dark:text-white">
                  {v.ram} RAM + {v.storage}
                </span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {v.pricePkr ? `PKR ${v.pricePkr.toLocaleString()}` : ''}{' '}
                  {v.priceUsd ? `($${v.priceUsd})` : ''}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Single Clean In-Content AdSense Band */}
      <UnderCtaAdBand variant="leaderboard" region="phone-detail-mid" />

      {/* Complete 13-Group Technical Specification Sheet (GSMArena Style) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>Complete {phone.fullName} Technical Specifications</span>
          </h2>
          <span className="text-xs text-slate-400">Updated: {phone.lastUpdated}</span>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {specSections.map((group) => (
            <div key={group.title} className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-3 p-4 bg-slate-50 dark:bg-slate-800/40 font-extrabold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {group.title}
              </div>
              <div className="md:col-span-9 divide-y divide-slate-100 dark:divide-slate-800/70">
                {group.rows.map(([label, val]) => (
                  <div key={label} className="grid grid-cols-1 sm:grid-cols-12 p-3.5 text-xs sm:text-sm gap-1">
                    <div className="sm:col-span-4 font-semibold text-slate-500">{label}</div>
                    <div className="sm:col-span-8 text-slate-900 dark:text-slate-100">{val}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pros & Cons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-base font-extrabold text-emerald-600 mb-3">Key Strengths (Pros)</h2>
          <ul className="space-y-2 text-xs sm:text-sm">
            {phone.pros.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-base font-extrabold text-rose-600 mb-3">Trade-Offs &amp; Cons</h2>
          <ul className="space-y-2 text-xs sm:text-sm">
            {phone.cons.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-base font-extrabold mb-3">Top Competitors &amp; Alternatives</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {alternatives.map((alt) => (
              <Link
                key={alt.slug}
                href={`/phones/${alt.slug}`}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition"
              >
                <div className="font-bold text-sm">{alt.fullName}</div>
                <div className="text-xs text-emerald-600 font-semibold mt-1">
                  {alt.pricePkr ? `PKR ${alt.pricePkr.toLocaleString()}` : ''} (${alt.priceUsd})
                </div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {alt.specs.platform.chipset} • {alt.specs.battery.capacityMah}mAh
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <h2 className="text-base font-extrabold flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <span>Frequently Asked Questions — {phone.fullName}</span>
        </h2>
        <div className="space-y-3">
          {phone.faqs.map((f, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-sm">{f.question}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

