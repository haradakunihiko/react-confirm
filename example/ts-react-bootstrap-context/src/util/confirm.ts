import { createConfirmationCreater, createReactTreeMounter, createMountPoint } from 'react-confirm';
import Confirmation, { Props as ConfimationProps } from '../components/Confirmation';
import ComplexConfirmation from '../components/ComplexConfirmation';

const mounter = createReactTreeMounter();

export const createConfirmation = createConfirmationCreater(mounter);
export const MountPoint = createMountPoint(mounter);

export const confirm = createConfirmation(Confirmation);

export const confirmComplex = createConfirmation(ComplexConfirmation);
