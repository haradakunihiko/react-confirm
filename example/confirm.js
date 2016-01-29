import Confirmation from './Confirmation';
import reactConfirm from 'react-confirm';

const confirm = reactConfirm(Confirmation);

export default function(confirmation, options = {}) {
  return confirm({ confirmation, ...options });
}
