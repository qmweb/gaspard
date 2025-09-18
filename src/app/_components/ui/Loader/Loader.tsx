import { PuffLoader } from 'react-spinners';

export default function Loader() {
  return (
    <div className='flex flex-col items-center justify-center h-full w-full'>
      <PuffLoader color='#000000' size={100} speedMultiplier={0.7} />
    </div>
  );
}
