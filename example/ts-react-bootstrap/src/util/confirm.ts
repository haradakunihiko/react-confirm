import Confirmation, { Props as ConfimationProps } from '../components/Confirmation';
import ComplexConfirmation, { Props as ConplexProps, Res } from '../components/ComplexConfirmation';
import { createConfirmation } from 'react-confirm';

const defaultConfirmation = createConfirmation<ConfimationProps, boolean>(Confirmation);

export function confirm(confirmation: string, options: Omit<ConfimationProps, 'confirmation'> = {}) {
  return defaultConfirmation({ confirmation, ...options });
}

export const confirmComplex = createConfirmation<ConplexProps, Res>(ComplexConfirmation);
