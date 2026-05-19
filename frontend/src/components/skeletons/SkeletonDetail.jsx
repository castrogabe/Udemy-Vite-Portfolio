import SkeletonBase from './SkeletonBase';

export default function SkeletonDetail() {
  return (
    <div className='content'>
      <div className='box'>
        <SkeletonBase width='50%' height='1.5rem' /> {/* heading */}
        <SkeletonBase width='100%' height='1rem' />
        <SkeletonBase width='95%' height='1rem' />
        <SkeletonBase width='90%' height='1rem' />
      </div>
      <div className='box'>
        <SkeletonBase width='100%' height='250px' radius='8px' /> {/* image */}
      </div>
    </div>
  );
}
