import SkeletonBase from './SkeletonBase';

export default function SkeletonForm() {
  return (
    <div className='content box'>
      <SkeletonBase width='40%' height='1.5rem' />
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <SkeletonBase width='30%' height='1rem' />
          <SkeletonBase width='100%' height='2.5rem' radius='6px' />
        </div>
      ))}
      <SkeletonBase width='40%' height='2.5rem' radius='8px' /> {/* button */}
    </div>
  );
}
