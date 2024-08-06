import Confirmation from '../components/Confirmation';
import ComplexConfirmation from '../components/ComplexConfirmation';
import { createConfirmation } from 'react-confirm';

export const confirm = createConfirmation(Confirmation);

export const confirmComplex = createConfirmation(ComplexConfirmation);
