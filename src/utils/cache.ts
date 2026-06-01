import NodeCache from 'node-cache';

export const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

export const invalidateAdCache = () => {
  const keys = cache.keys();
  const adKeys = keys.filter((key) => key.startsWith('/ads'));
  cache.del(adKeys);
};
