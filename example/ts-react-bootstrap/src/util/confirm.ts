import Confirmation, { Props as ConfimationProps } from '../components/Confirmation';
import ComplexConfirmation from '../components/ComplexConfirmation';
import { createConfirmation } from 'react-confirm';

const defaultConfirmation = createConfirmation(Confirmation);

// create syntax sugar for confrmation function. 
// You can use `confirm('Are you sure?')` instead of `confirm({ confrmation: 'Are you sure? '})`
export function confirm(confirmation: string, options: ConfimationProps = {}) {
  return defaultConfirmation({ confirmation, ...options });
}

export const confirmComplex = createConfirmation(ComplexConfirmation);
