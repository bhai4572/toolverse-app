import { JobOpportunity, CostOfLivingCity } from './types';

export const SAMPLE_JOBS: JobOpportunity[] = [
  {
    id: 'job-de-1',
    countryIso2: 'DE',
    cityName: 'Berlin',
    title: 'Senior Full Stack Engineer (React/Node.js)',
    employer: 'Zalando SE',
    category: 'SOFTWARE',
    averageAnnualSalaryUsd: 85000,
    visaSponsorshipConfirmed: true,
    requirements: ['5+ years Software Development experience', 'English fluency', 'Degree in CS or equivalent'],
    applicationUrl: 'https://jobs.zalando.com',
    postedDate: '2026-10-01',
  },
  {
    id: 'job-ae-1',
    countryIso2: 'AE',
    cityName: 'Dubai',
    title: 'Cloud Infrastructure Architect',
    employer: 'Emirates Group',
    category: 'SOFTWARE',
    averageAnnualSalaryUsd: 95000,
    visaSponsorshipConfirmed: true,
    requirements: ['AWS/Azure Certifications', '5+ years DevOps/Cloud experience'],
    applicationUrl: 'https://emiratesgroupcareers.com',
    postedDate: '2026-10-02',
  },
  {
    id: 'job-gb-1',
    countryIso2: 'GB',
    cityName: 'London',
    title: 'Software Developer (Skilled Worker Visa Sponsor)',
    employer: 'Revolut Technologies',
    category: 'SOFTWARE',
    averageAnnualSalaryUsd: 90000,
    visaSponsorshipConfirmed: true,
    requirements: ['Skilled Worker Visa CoS Eligible', 'TypeScript/Python expertise'],
    applicationUrl: 'https://revolut.com/careers',
    postedDate: '2026-10-03',
  }
];

export const SAMPLE_COST_OF_LIVING: CostOfLivingCity[] = [
  {
    cityName: 'London',
    countryIso2: 'GB',
    monthlyRentBudgetStudioUsd: 1600,
    monthlyRentApartmentUsd: 2400,
    mealBudgetUsd: 500,
    monthlyTransportPassUsd: 200,
    monthlyUtilitiesUsd: 220,
    estimatedSingleTotalUsd: 2800,
    estimatedFamilyTotalUsd: 5200,
    lifestyleRating: 'EXPENSIVE',
  },
  {
    cityName: 'Dubai',
    countryIso2: 'AE',
    monthlyRentBudgetStudioUsd: 1100,
    monthlyRentApartmentUsd: 1800,
    mealBudgetUsd: 450,
    monthlyTransportPassUsd: 120,
    monthlyUtilitiesUsd: 180,
    estimatedSingleTotalUsd: 2100,
    estimatedFamilyTotalUsd: 4200,
    lifestyleRating: 'MODERATE',
  },
  {
    cityName: 'Berlin',
    countryIso2: 'DE',
    monthlyRentBudgetStudioUsd: 950,
    monthlyRentApartmentUsd: 1500,
    mealBudgetUsd: 400,
    monthlyTransportPassUsd: 90,
    monthlyUtilitiesUsd: 210,
    estimatedSingleTotalUsd: 1850,
    estimatedFamilyTotalUsd: 3600,
    lifestyleRating: 'MODERATE',
  }
];

export function getJobsForCountry(countryIso2: string): JobOpportunity[] {
  return SAMPLE_JOBS.filter((j) => j.countryIso2.toUpperCase() === countryIso2.toUpperCase());
}

export function getJobOpportunities(countryIso2: string): any[] {
  const jobs = getJobsForCountry(countryIso2);
  if (jobs.length > 0) {
    return jobs.map(j => ({
      id: j.id,
      title: j.title,
      employer: j.employer,
      city: j.cityName,
      employmentType: 'Full-Time (Sponsor)',
      salaryMinUsd: j.averageAnnualSalaryUsd - 10000,
      salaryMaxUsd: j.averageAnnualSalaryUsd + 15000,
      visaSponsorshipConfirmed: j.visaSponsorshipConfirmed,
      postedDate: j.postedDate,
      applicationUrl: j.applicationUrl
    }));
  }
  return [
    {
      id: `job-${countryIso2}-1`,
      title: `Software Systems Engineer (${countryIso2})`,
      employer: 'Global Tech Solutions',
      city: 'Capital City',
      employmentType: 'Full-Time (Sponsor)',
      salaryMinUsd: 65000,
      salaryMaxUsd: 95000,
      visaSponsorshipConfirmed: true,
      postedDate: '2026-10-01',
      applicationUrl: 'https://toolverse.baby/travel/jobs'
    }
  ];
}

export function getCostOfLiving(countryIso2OrCity: string): any {
  if (!countryIso2OrCity) return SAMPLE_COST_OF_LIVING[0];
  const q = countryIso2OrCity.trim().toUpperCase();
  const match = SAMPLE_COST_OF_LIVING.find(c => c.countryIso2.toUpperCase() === q || c.cityName.toUpperCase() === q);

  if (match) {
    return {
      cityName: match.cityName,
      rentApartment1BedCenterUsd: match.monthlyRentApartmentUsd,
      groceriesMonthlyUsd: match.mealBudgetUsd,
      transitMonthlyUsd: match.monthlyTransportPassUsd,
      utilitiesMonthlyUsd: match.monthlyUtilitiesUsd
    };
  }

  return {
    cityName: countryIso2OrCity,
    rentApartment1BedCenterUsd: 1200,
    groceriesMonthlyUsd: 350,
    transitMonthlyUsd: 100,
    utilitiesMonthlyUsd: 150
  };
}

export function calculateSalaryVsCostOfLiving(
  annualSalaryUsd: number,
  cityName: string,
  estimatedTaxRatePercentage: number = 25
) {
  const cost = getCostOfLiving(cityName);
  const grossMonthly = Math.round(annualSalaryUsd / 12);
  const estimatedTax = Math.round(grossMonthly * (estimatedTaxRatePercentage / 100));
  const netMonthly = grossMonthly - estimatedTax;
  const livingExp = cost.rentApartment1BedCenterUsd + cost.groceriesMonthlyUsd + cost.transitMonthlyUsd + cost.utilitiesMonthlyUsd;
  const netDisposable = netMonthly - livingExp;

  return {
    annualSalaryUsd,
    grossMonthlyUsd: grossMonthly,
    estimatedTaxMonthlyUsd: estimatedTax,
    netMonthlySalaryUsd: netMonthly,
    monthlyLivingExpensesUsd: livingExp,
    monthlyRentEstimateUsd: cost.rentApartment1BedCenterUsd,
    netDisposableSavingsUsd: netDisposable,
    isViable: netDisposable > 0,
  };
}
