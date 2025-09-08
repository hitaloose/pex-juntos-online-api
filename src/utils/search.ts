export const escapeLike = (term: string) => {
  return term.replace(/[%_]/g, (m) => `\\${m}`);
};
