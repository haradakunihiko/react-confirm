import Confirmation from 'components/Confirmation';
import ComplexConfirmation from 'components/ComplexConfirmation';
import { createConfirmation } from 'react-confirm';

const defaultConfirmation = createConfirmation(Confirmation);

export function confirm(confirmation, options = {}) {
  return defaultConfirmation({ confirmation, ...options });
}

export const confirmComplex = createConfirmation(ComplexConfirmation);
