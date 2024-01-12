export const assignSize = (number, numPartitions) => {
  if (number === 0 || number === -1) {
    return 'unknown';
  }

  const minValue = 4000; // TODO: Make this numbers dynamic based on biggest and lowest values from api
  const maxValue = 20000;

  const totalRange = maxValue - minValue;
  const partitionSize = totalRange / numPartitions;

  const size = (number >= minValue && number < maxValue)
    ? (number < minValue + partitionSize ? 'sm' :
      number < minValue + 2 * partitionSize ? 'md' :
      number < minValue + 3 * partitionSize ? 'l' :
      'xl')
    : 'xxl';

  return size;
};