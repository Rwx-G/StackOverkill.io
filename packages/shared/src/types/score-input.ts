import { z } from 'zod';

/**
 * Application input schema - user's perception of their application needs
 */
export const ApplicationInputSchema = z.object({
  /** Business criticality (1-5): 1=Very Low, 5=Critical */
  criticality: z.number().int().min(1).max(5),
  /** Number of users (1-6): 1=1-10, 2=11-50, 3=51-200, 4=201-1000, 5=1001-5000, 6=5000+ */
  userCount: z.number().int().min(1).max(6),
  /** Financial impact (1-6): 1=None, 6=>100k€/month */
  financialImpact: z.number().int().min(1).max(6),
  /** Required availability (1-6): 1=Best effort, 6=99.999% */
  availability: z.number().int().min(1).max(6),
  /** Exposure level (1-5): 1=Internal only, 5=Public open */
  exposure: z.number().int().min(1).max(5),
  /** Functional complexity (1-5): 1=Very simple CRUD, 5=Very complex microservices */
  complexity: z.number().int().min(1).max(5),
  /** Data sensitivity (1-4): 1=Public, 4=Critical (GDPR, health, finance) */
  dataSensitivity: z.number().int().min(1).max(4),
});

export type ApplicationInput = z.infer<typeof ApplicationInputSchema>;

/**
 * Infrastructure input schema - user's perception of their infrastructure complexity
 */
export const InfrastructureInputSchema = z.object({
  /** Technical sophistication (1-6): 1=Single basic server, 6=Multi-cloud/Service mesh */
  sophistication: z.number().int().min(1).max(6),
  /** Resilience level (1-6): 1=No redundancy, 6=Multi-region active-active */
  resilience: z.number().int().min(1).max(6),
  /** Monthly cost (1-6): 1=Free, 6=5000€+ */
  cost: z.number().int().min(1).max(6),
  /** Team capacity (1-5): 1=Solo, 5=Dedicated 24/7 team */
  teamCapacity: z.number().int().min(1).max(5),
  /** Operational maturity (1-5): 1=No docs YOLO, 5=Full observability */
  operationalMaturity: z.number().int().min(1).max(5),
  /** Automation level (1-5): 1=All manual, 5=Full GitOps/IaC */
  automation: z.number().int().min(1).max(5),
  /** Security level (1-4): 1=Basic firewall, 4=Advanced Zero Trust/SIEM */
  security: z.number().int().min(1).max(4),
});

export type InfrastructureInput = z.infer<typeof InfrastructureInputSchema>;

/**
 * Complete score input combining application and infrastructure
 */
export const ScoreInputSchema = z.object({
  app: ApplicationInputSchema,
  infra: InfrastructureInputSchema,
});

export type ScoreInput = z.infer<typeof ScoreInputSchema>;
