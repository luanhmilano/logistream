export const parseKafkaBrokers = (brokers: string): string[] =>
  brokers
    .split(',')
    .map((broker) => broker.trim())
    .filter(Boolean);
