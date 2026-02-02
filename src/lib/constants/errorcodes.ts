/**
 * Error Codes
 * Prisma : https://www.prisma.io/docs/reference/api-reference/error-reference
 */
export const PRISMA_ERRORS: Record<string, string> = {
  P1001: "The database can't be reached",
  P2001: 'No record found matching the criteria',
  P2002: 'A record with this unique value already exists',
  P2003: 'The referenced record does not exist',
  P2010: 'Raw query failed',
  P2025: 'The record you are trying to update or delete does not exist',
};

export type PrismaErrorCode = keyof typeof PRISMA_ERRORS;
