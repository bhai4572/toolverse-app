import { SITE_URL, buildBreadcrumbNode, buildOrganizationNode, buildWebSiteNode, wrapInGraph } from '../seo/metaEngine';
import { VisaRule, Country, EmbassyMission } from './types';

/**
 * Build JSON-LD structured data graph for Travel Visa Requirement pages
 */
export function buildVisaPageJsonLd(rule: VisaRule, nationality: Country, destination: Country) {
  const canonicalUrl = `${SITE_URL}/travel/${nationality.iso2?.toLowerCase() || 'pk'}/${destination.iso2?.toLowerCase() || 'gb'}`;
  
  const pageTitle = `${nationality.name || nationality.commonName} to ${destination.name || destination.commonName} Visa Requirements (2026) — Toolverse Travel`;
  const description = `${rule.statusLabel || rule.status}. Allowed stay: ${rule.allowedStayDays || 30} days. Government Fee: $${rule.feeUsd || rule.visaFeeUsd || 0} USD. Official source verified.`;

  const faqNode = {
    '@type': 'FAQPage',
    '@id': `${canonicalUrl}#faq`,
    mainEntity: [
      {
        '@type': 'Question',
        name: `Do ${nationality.name || nationality.commonName} passport holders need a visa for ${destination.name || destination.commonName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Current status is ${rule.statusLabel || rule.status}. Allowed stay duration is ${rule.allowedStayDays || 30} days. Verified from ${rule.sourceName} on ${rule.lastVerifiedDate}.`,
        },
      },
      {
        '@type': 'Question',
        name: `How much is the visa fee for ${nationality.name || nationality.commonName} citizens visiting ${destination.name || destination.commonName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The official government visa fee is approximately $${rule.feeUsd || rule.visaFeeUsd || 0} USD (subject to currency exchange rates and service fees).`,
        },
      },
      {
        '@type': 'Question',
        name: `How long does it take to process a ${destination.name || destination.commonName} visa?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Standard processing time averages ${rule.processingTimeDays?.average || 14} days.`,
        },
      },
    ],
  };

  const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Travel Intelligence', url: `${SITE_URL}/travel` },
    { name: `${nationality.name || nationality.commonName} Passport`, url: `${SITE_URL}/travel/passport/${nationality.iso2?.toLowerCase()}` },
    { name: `${destination.name || destination.commonName} Visa`, url: canonicalUrl },
  ]);

  const graph = [
    buildOrganizationNode(),
    buildWebSiteNode(),
    breadcrumbs,
    faqNode,
  ];

  return {
    title: pageTitle,
    description,
    canonicalUrl,
    jsonLd: wrapInGraph(graph),
  };
}

export function generateTravelRouteSchema(rule: any, nationality: any, destination: any) {
  const meta = buildVisaPageJsonLd(rule, nationality, destination);
  return {
    '@context': 'https://schema.org',
    '@graph': meta.jsonLd
  };
}

/**
 * Build JSON-LD graph for Embassy & Consulate pages
 */
export function buildEmbassyJsonLd(embassy: EmbassyMission, hostCountry: Country, repCountry: Country) {
  const canonicalUrl = `${SITE_URL}/travel/embassies`;
  
  const embassyNode = {
    '@type': 'GovernmentOrganization',
    '@id': `${canonicalUrl}#${embassy.id}`,
    name: embassy.title,
    address: {
      '@type': 'PostalAddress',
      streetAddress: embassy.address,
      addressLocality: embassy.city,
      addressCountry: hostCountry.iso2,
    },
    telephone: embassy.phone,
    email: embassy.email,
    url: embassy.website,
  };

  return wrapInGraph([buildOrganizationNode(), buildWebSiteNode(), embassyNode]);
}
