import SkeletonBase from './SkeletonBase';

export default function SkeletonList() {
  return (
    <div className='content'>
      {[...Array(3)].map((_, i) => (
        <div key={i} className='box'>
          <SkeletonBase width='70%' height='1.5rem' /> {/* title */}
          <SkeletonBase width='100%' height='1rem' />
          <SkeletonBase width='90%' height='1rem' />
          <SkeletonBase width='80%' height='1rem' />
        </div>
      ))}
    </div>
  );
}
