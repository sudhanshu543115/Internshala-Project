export function distributeRoundRobin(items, agentIds) {
  const result = {};
  agentIds.forEach((id) => (result[id] = []));
  if (!items.length || !agentIds.length) return result;
  let i = 0;
  for (const item of items) {
    const agentId = agentIds[i % agentIds.length];
    result[agentId].push(item);
    i++;
  }
  return result;
}
