import { PuffLoader } from 'react-spinners';

import '@/styles/ui/loader/loader.scss';

export default function Loader() {
  return (
    <div className='loader'>
      <PuffLoader color='#000000' size={100} speedMultiplier={0.7} />
    </div>
  );
}
