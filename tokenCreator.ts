import type { TokenCreatorInput, TokenCreatorOutput } from '../types';

export function createSolanaTokenDraft(input: TokenCreatorInput): TokenCreatorOutput {
  const name = input.name.trim();
  const symbol = input.symbol.trim().toUpperCase();
  const decimals = input.decimals ?? 9;

  if (!name) throw new Error('Token name is required.');
  if (!/^[A-Z0-9]{2,10}$/.test(symbol)) throw new Error('Symbol must be 2-10 uppercase letters or numbers.');
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 9) {
    throw new Error('Solana token decimals must be an integer between 0 and 9.');
  }

  const supply = String(input.supply);
  if (!/^\d+(\.\d+)?$/.test(supply)) throw new Error('Supply must be a positive numeric value.');

  return {
    name,
    symbol,
    decimals,
    supply,
    description: input.description,
    imageUrl: input.imageUrl,
    chain: 'solana',
    createdAt: new Date().toISOString()
  };
}
